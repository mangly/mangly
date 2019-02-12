const electron = require('electron');
const ipc = electron.ipcRenderer;

const { dialog } = require('electron').remote;

const remote = require('electron').remote;

require('../archivos_estaticos/chartjs-plugin-zoom');

var fs = require('fs');

var Application = require('../Model/Logic_Application');
var Application_Utilities = require('../Utilities/Application_Utilities');
var Visual_Application = require('../GUI/Visual_Application')

$(document).ready(function () {
    $('#options-color-edit-remove *').attr('disabled', 'disabled');
    $('#options-scale-axis *').attr('disabled', 'disabled');
    $('#option-mu *').attr('disabled', 'disabled');
    $('#option-s *').attr('disabled', 'disabled');
    $('#order-m').attr('disabled', 'disabled');


    // Instance Visual Application
    var application = new Visual_Application($('#mycanvas'), new Application());

    // var sampling_vector = [];
    var items_selecteds = [];
    application.Visualize_Information_Of_Functions(items_selecteds, $('#graphic'), $('#theta'), $('#rho'), $('#model'));

    $('#open-file').on('click', function () {

        var options = {
            filters: [
                { name: 'PSMC', extensions: ['psmc', 'txt', 'msmc'] }
            ],

            properties: ['multiSelections'],
        }


        // Open a File or Files selected for user
        dialog.showOpenDialog(options, function (arrPath) {
            if (arrPath) {
                var paths = Application_Utilities.Divide_Paths(arrPath);
                var psmc_msmc_paths = paths[0];
                var nssc_paths = paths[1];

                // var array_extensions = arrPath[0].split('.');
                // var model_type = array_extensions[array_extensions.length - 1];

                // if (model_type == 'psmc' || model_type == 'msmc') {
                if (psmc_msmc_paths.length != 0) {
                    application.logic_application.Add_File(psmc_msmc_paths, function () {

                        application.Visualize_PSMC_MSMC();

                        $('#options-scale-axis *').removeAttr('disabled');
                        $('#reset-scales').removeAttr('hidden');
                        $('#switch-selection').removeAttr('disabled');
                    })
                }

                if (nssc_paths.length != 0) {
                    for (const path of nssc_paths) {
                        fs.readFile(path, function read(err, data) {
                            if (err) {
                                throw err;
                            }

                            var nssc_file = JSON.parse(data);
                            var path_split = path.split('/');
                            var new_name = path_split[path_split.length - 1].slice(0, -5);
                            nssc_file.name = new_name;
                            application.logic_application.functions_collection.push(nssc_file);
                            application.Visualize_NSSC_Saved(nssc_file);
                        });
                    }
                }
            }
        });
    });


    var name_item_clicked;
    var legend_color = [];

    $('#switch-selection').on('change', function () {
        $('.custom-control-input').prop('checked', false);
        legend_color = [];
        items_selecteds = [];
        slider_s.noUiSlider.set(100);
        slider_mu.noUiSlider.set(1.25);
    });

    $('#list-graphics').on('click', function () {
        if ($(event.target).is('.custom-control-input')) {

            name_item_clicked = ($(event.target).parents('.custom-control').siblings('.listview__content').children('.listview__heading')).text();

            if (!$('#switch-selection').prop('checked')) {
                $('.custom-control-input').each(function () {
                    if (($(this).parents('.custom-control').siblings('.listview__content').children('.listview__heading')).text() != ($(event.target).parents('.custom-control').siblings('.listview__content').children('.listview__heading')).text()) {
                        $(this).prop('checked', false);
                    }
                });

                legend_color = [];
                items_selecteds = [];
                items_selecteds.push(name_item_clicked);
                legend_color.push($(event.target).parents('.custom-control').children('.custom-control--char__helper'));
            }

            else {
                if ($(event.target).prop('checked')) {
                    if (!items_selecteds.includes(name_item_clicked)) {
                        items_selecteds.push(name_item_clicked);
                        legend_color.push($(event.target).parents('.custom-control').children('.custom-control--char__helper'));
                    }
                }
                else {
                    var index = items_selecteds.indexOf(name_item_clicked);
                    items_selecteds.splice(index, 1)
                    legend_color.splice(index, 1)
                }
            }

            // var graphic = application.logic_application.Contain(name_item_clicked);


            // if (items_selecteds.length != 0) {
            $('#options-color-edit-remove *').removeAttr('disabled');
            $('#option-s *').removeAttr('disabled');
            $('#option-mu *').removeAttr('disabled');

            // }

            // else {
            //     // $('#options-color-edit-remove *').attr('disabled', 'disabled');

            // }

            // $('#options-color-edit-remove *').removeAttr('disabled');
            // $('#option-mu *').removeAttr('disabled');

            // var graphic = application.logic_application.Contain(name_item_clicked);
            // if (application.Get_Parametters(name_item_clicked)[2] == 'Pairwise Sequentially Markovian Coalescent') {
            // $('#option-s *').removeAttr('disabled');
            // $('#option-mu *').removeAttr('disabled');

            if (items_selecteds.length == 0 || items_selecteds.length > 1) {

                if (items_selecteds.length == 0) $('#option-mu *').attr('disabled', 'disabled');

                if (application.Get_Parametters(name_item_clicked)[2] == 'Pairwise Sequentially Markovian Coalescent') {
                    $('#option-s *').removeAttr('disabled');
                    $('#option-mu *').removeAttr('disabled');
                    slider_s.noUiSlider.set(100);
                    slider_mu.noUiSlider.set(1.25);
                }

                else {
                    $('#option-mu *').removeAttr('disabled');
                    slider_mu.noUiSlider.set(1.25);
                }
            }

            else {

                for (const element of items_selecteds) {
                    var graphic = application.logic_application.Get_Function(element);

                    if (application.Get_Parametters(name_item_clicked)[2] == 'Pairwise Sequentially Markovian Coalescent') {
                        $('#option-s *').removeAttr('disabled');
                        $('#option-mu *').removeAttr('disabled');
                        slider_s.noUiSlider.set(graphic.S);
                        slider_mu.noUiSlider.set(graphic.Mu);
                    }

                    else {

                        slider_s.noUiSlider.set(100);
                        slider_mu.noUiSlider.set(graphic.Mu);
                        $('#option-s *').attr('disabled', 'disabled');
                    }

                }
            }
            // }
            // for (const element of items_selecteds) {
            //     var graphic = application.logic_application.Contain(element);
            //     var found = false;

            //     if (graphic.model == 'msmc') {
            //         $('#option-s *').attr('disabled', 'disabled');
            //         found = true;
            //         break;
            //     }

            //     if (found) {
            //         slider_s.noUiSlider.set(100);
            //         // $('#option-s *').removeAttr('disabled');
            //     }

            // }
            application.Visualize_Information_Of_Functions(items_selecteds, $('#graphic'), $('#theta'), $('#rho'), $('#model'));
        }
    })

    $(".colorpicker-element").on("change", function () {
        var color = $(this).val();

        for (let index = 0; index < items_selecteds.length; index++) {
            application.Update_Colors(items_selecteds[index], color, legend_color[index]);
        }

    });

    // $('#edit').on('click', function () {
    //     itemTarget.parent().html('<input type="text" class="form-control edit-text" placeholder="">')
    // });

    $('#scaleX').on('change', function () {
        application.Change_Axis_Scale($(this).val().toLowerCase(), 'x');
    });

    $('#scaleY').on('change', function () {
        application.Change_Axis_Scale($(this).val().toLowerCase(), 'y');
    });

    // $('#options').on('click', function () {
    //     if ($('#options-scale-axis *').attr('disabled') == 'disabled') $('#modal-default').modal('show');

    //     else if (!$(event.target).is('#options-scale-axis *')) if (!itemTarget) $('#modal-default').modal('show');
    //     // if (!$(event.target).is('#options-scale-axis *') && $('#options #option-mu *').attr('disabled') == 'disabled') $('#modal-default').modal('show');
    // });

    var expand_file = false;

    $('#modal-default').on('hidden.bs.modal', function () {
        $('#open-menu').trigger('click');

        if (!expand_file) {
            $('#expand-file').trigger('click');
            expand_file = true;
        }
    });


    // Sliders configurations
    var slider_mu = document.getElementById("slider-mu");

    noUiSlider.create(slider_mu, {
        start: [1.25],
        connect: "lower",
        range: { min: 1, max: 3 },

        format: wNumb({
            decimals: 10,

            encoder: function (a) {
                return a * 1e-8;
            }
        })
    })

    if ($('#option-mu *').attr('disabled') == 'disabled') {
        slider_mu.noUiSlider.on("update", function (a, b) {
            $('#input-slider-value-mu').val(Application_Utilities.Convert_Decimal_Scientific_Notation(a[b]));
        });
    }

    slider_mu.noUiSlider.on('slide', function (a, b) {

        for (const element of items_selecteds) {
            application.Update_Scale(element, a[b], $('#input-slider-value-s').val());
        }

        $('#input-slider-value-mu').val(Application_Utilities.Convert_Decimal_Scientific_Notation(a[b]));
    })

    var slider_s = document.getElementById("slider-s");

    noUiSlider.create(slider_s, {
        start: [100],
        connect: "lower",
        range: { min: 1, max: 1000 },

        format: wNumb({
            decimals: 0,
        })
    })

    if ($('#options #option-s *').attr('disabled') == 'disabled') {
        slider_s.noUiSlider.on("update", function (a, b) {
            document.getElementById("input-slider-value-s").value = a[b];
        });
    }

    slider_s.noUiSlider.on('slide', function (a, b) {
        for (const element of items_selecteds) {
            application.Update_Scale(element, $('#input-slider-value-mu').val(), a[b]);
        }
    })

    $('#reset-scales').on('click', function () {
        application.Reset_Scales();
        slider_s.noUiSlider.set(100);
        slider_mu.noUiSlider.set(1.25);
        $('.custom-control-input').prop('checked', false);
        items_selecteds = [];
    });

    $('#order-n').on('keyup', function () {
        var order = $(this).val();
        $('#order-m').val(order);
    })

    var nssc_scenario;
    $('#open-matrix-editor').on('click', function () {
        var values = {
            nssc_scenario: nssc_scenario,
            number_of_matrix: parseInt($('#count-matrix').val()),
            order: parseInt($('#order-n').val()),
            // sampling_vector: sampling_vector.jexcel('getRowData', 0),
            name: $('#nssc-name').val(),
        }

        ipc.send('open-matrix-editor', values);

        // $('aside').removeClass('toggled');
    });

    // $('#test').on('click', function () {
    //     application.logic_application.Get_NSSC_Vectors('', function () {
    //         application.Visualize_NSSC();
    //         console.log('done!!!!!!!')
    //     });
    // });

    $('#test').on('click', function () {


        // var options = {
        //     title: 'Save as...',

        //     filters: [
        //         { name: 'PSMC', extensions: ['psmc'] }
        //     ],
        // }

        // dialog.showSaveDialog(options, function (filename) {
        //     let psmc = new PSMC('mandy', 1, [1, 2, 3], [2, 3, 4], 1, 2, 100, 100);

        //     var objS = serialize.serialize(psmc);

        //     var objUS = serialize.unserialize(objS)

        //     fs.writeFile(filename, objS, function (err) {
        //         if (err) {
        //             console.log(err);
        //         }

        //         console.log('done!!!')
        //     });
        // })


        // var data = {
        //     name: "cliff",
        //     age: "34",
        //     othername: "ted",
        //     otherage: "42",
        //     othername: "bob",
        //     otherage: "12"
        // }

        // var jsonData = JSON.stringify(data);

        // fs.writeFile("test.mangly", jsonData, function (err) {
        //     if (err) {
        //         console.log(err);
        //     }

        //     else console.log('save done!!!!!');
        // });


        //............



    });

    ipc.on('nssc-json-result', function (event, arg) {
        application.logic_application.Get_NSSC_Vectors(arg, function () {
            application.Visualize_NSSC();
        });
    });

    $('#load-nssc-state').on('click', function () {
        var options = {
            filters: [
                { name: 'SNSSC', extensions: ['snssc'] }
            ],

            // properties: ['multiSelections'],
        }

        dialog.showOpenDialog(options, function (arrPath) {
            if (arrPath) {
                fs.readFile(arrPath[0], function read(err, data) {
                    if (err) {
                        throw err;
                    }

                    nssc_scenario = JSON.parse(data);

                    $('#nssc-name').val(nssc_scenario.name)

                    var order = nssc_scenario.scenario[0].migMatrix.length;
                    $('#order-n').val(order);
                    $('#order-m').val(order);

                    $('#count-matrix').val(nssc_scenario.scenario.length);

                    $('#open-matrix-editor').trigger('click');
                });
            }
        });
    });

    $('#save-nssc').on('click', function () {
        var nssc_model = application.logic_application.Get_NSSC_Function(name_item_clicked)
        var nssc_save = JSON.stringify(nssc_model);

        var options = {
            title: 'Save...',
            defaultPath: nssc_model.name,

            filters: [
                { name: 'NSSC', extensions: ['nssc'] }
            ],
        }

        Application_Utilities.Save_File(nssc_save, options);
    });
});
const electron = require('electron');
const ipc = electron.ipcRenderer;

const { dialog } = require('electron').remote;

require('../archivos_estaticos/chartjs-plugin-zoom');

// require('chart.js')

// var fs = require('fs');
var remote = require('electron').remote;

var Application = require('../Model/Logic_Application');
var Application_Utilities = require('../Utilities/Application_Utilities');
var Visual_Application = require('../GUI/Visual_Application');
var ArgumentException = require('../Utilities/Exception');
const main_Window = remote.getCurrentWindow()

$(document).ready(function () {
    $('#change-color').attr('disabled', 'disabled');
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
                $('#canvas-container').removeClass('disabled');

                if (psmc_msmc_paths.length != 0) {
                    application.logic_application.Add_File_PSMC_MSMC(psmc_msmc_paths, function (err) {
                        // try {
                        if (err) {
                            throw new ArgumentException(err);
                        }

                        application.Visualize_PSMC_MSMC();

                        $('#options-scale-axis *').removeAttr('disabled');
                        $('#switch-selection').removeAttr('disabled');
                    });
                }

                if (nssc_paths.length != 0) {
                    application.logic_application.Add_File_NSSC(nssc_paths, function (err) {
                        // try {
                        // if (err) {
                        //     throw new ArgumentException(err);
                        // }

                        application.Visualize_NSSC_Saved();
                        // }

                        // catch (exception) {
                        //     dialog.showMessageBox(main_Window, { type: 'error', message: exception.message, buttons: ['Accept'] });
                        // }
                    });
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

                if ($(event.target).prop('checked')) {
                    $('#reset-scales').removeAttr('disabled');
                    $('#reset-all-scales').removeAttr('disabled');
                    $('#change-color').removeAttr('disabled');
                    $('#option-s *').removeAttr('disabled');
                    $('#option-mu *').removeAttr('disabled');
                    legend_color = [];
                    items_selecteds = [];
                    items_selecteds.push(name_item_clicked);
                    legend_color.push($(event.target).parents('.custom-control').children('.custom-control--char__helper'));
                }

                else {
                    $('#reset-scales').attr('disabled', 'disabled');
                    $('#reset-all-scales').attr('disabled', 'disabled');
                    $('#change-color').attr('disabled', 'disabled');
                    $('#option-s *').attr('disabled', 'disabled');
                    $('#option-mu *').attr('disabled', 'disabled');
                    legend_color = [];
                    items_selecteds = [];
                }
            }

            else {
                if ($(event.target).prop('checked')) {
                    $('#reset-scales').removeAttr('disabled');
                    $('#reset-all-scales').removeAttr('disabled');
                    $('#change-color').removeAttr('disabled');
                    $('#option-s *').removeAttr('disabled');
                    $('#option-mu *').removeAttr('disabled');
                    if (!items_selecteds.includes(name_item_clicked)) {
                        items_selecteds.push(name_item_clicked);
                        legend_color.push($(event.target).parents('.custom-control').children('.custom-control--char__helper'));
                    }
                }
                else {
                    $('#reset-scales').attr('disabled', 'disabled');
                    $('#reset-all-scales').attr('disabled', 'disabled');
                    $('#change-color').attr('disabled', 'disabled');
                    $('#option-s *').attr('disabled', 'disabled');
                    $('#option-mu *').attr('disabled', 'disabled');
                    var index = items_selecteds.indexOf(name_item_clicked);
                    items_selecteds.splice(index, 1)
                    legend_color.splice(index, 1)
                }
            }

            // var graphic = application.logic_application.Contain(name_item_clicked);


            // if (items_selecteds.length != 0) {

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

            if (items_selecteds.length == 1) {
                // if (items_selecteds.length == 0) $('#option-mu *').attr('disabled', 'disabled');
                var graphic = application.logic_application.Get_Function(name_item_clicked);

                if (graphic.model == 'psmc') {
                    $('#option-s *').removeAttr('disabled');
                    $('#option-mu *').removeAttr('disabled');
                    slider_s.noUiSlider.set(graphic.S);
                    slider_mu.noUiSlider.set(graphic.Mu);
                }

                else {
                    slider_s.noUiSlider.set(100);
                    slider_mu.noUiSlider.set(graphic.Mu);
                    $('#option-mu *').removeAttr('disabled');
                    $('#option-s *').attr('disabled', 'disabled');
                }
            }

            else {
                for (const element of items_selecteds) {
                    var graphic = application.logic_application.Get_Function(element);

                    if (graphic.model == 'psmc') {
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

    // var expand_file = false;

    // $('#modal-default').on('hidden.bs.modal', function () {
    //     $('#open-menu').trigger('click');

    //     if (!expand_file) {
    //         $('#expand-file').trigger('click');
    //         expand_file = true;
    //     }
    // });


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
        application.Reset_Scales(application.logic_application.Get_Function(name_item_clicked));
        slider_s.noUiSlider.set(100);
        slider_mu.noUiSlider.set(1.25);
    });

    $('#reset-all-scales').on('click', function () {
        application.Reset_All_Scales();
        slider_s.noUiSlider.set(100);
        slider_mu.noUiSlider.set(1.25);
    });

    $('#order-n').on('keyup', function () {
        var order = $(this).val();
        $('#order-m').val(order);
    });

    ipc.on('restart-options-nssc', function () {
        nssc_scenario = null;
        $('#count-matrix').val(1);
        $('#order-n').val(1);
        $('#order-m').val(1);
        $('#nssc-name').val('');
    });

    var nssc_scenario;
    $('#open-matrix-editor').on('click', function () {
        var values = {
            type: $('#type-nssc-model').val(),
            nssc_scenario: nssc_scenario,
            number_of_matrix: parseInt($('#count-matrix').val()),
            order: parseInt($('#order-n').val()),
            name: $('#nssc-name').val(),
        }

        ipc.send('open-matrix-editor', values);
    });

    $('#test').on('click', function () {

    });

    ipc.on('nssc-json-result', function (event, scenario) {
        application.logic_application.Get_NSSC_Vectors('general', $('#nssc-name').val(), scenario, function (nssc_function) {
            if (nssc_function) {
                application.Update_NSSC(nssc_function);
            }

            else application.Visualize_NSSC();
        });
    });

    $('#load-nssc-state').on('click', function () {
        edit = true;
        if ($('#model').html() != 'The Non-Stationary Structured Coalescent') {
            var options = {
                filters: [
                    { name: 'SNSSC', extensions: ['snssc'] }
                ],
            }

            dialog.showOpenDialog(options, function (arrPath) {
                if (arrPath) {
                    Application.Load_File(arrPath[0], function (scenario) {
                        nssc_scenario = scenario;

                        var path_split = arrPath[0].split('/');
                        var file_name = path_split[path_split.length - 1].slice(0, -6);

                        application.Load_Principal_Window_Data(file_name, scenario, function () {
                            $('#open-matrix-editor').trigger('click');
                        });
                    });
                }
            });
        }

        else {
            nssc_scenario = application.logic_application.Get_Function(name_item_clicked).scenario;

            $('#nssc-name').val(name_item_clicked)

            var order = nssc_scenario.scenario[0].migMatrix.length;
            $('#order-n').val(order);
            $('#order-m').val(order);

            $('#count-matrix').val(nssc_scenario.scenario.length);

            $('#open-matrix-editor').trigger('click');
        }
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

        // Application_Utilities.Save_File(nssc_save, options);
        dialog.showSaveDialog(options, function (filename) {
            Application_Utilities.Save_File(filename, nssc_save);
        });
    });

    $('#mycanvas').bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            $('#zoom').removeClass('zmdi-zoom-out');
            $('#zoom').addClass('zmdi-zoom-in');
            // console.log('scrolling up !');
        }
        else {
            $('#zoom').removeClass('zmdi-zoom-in');
            $('#zoom').addClass('zmdi-zoom-out');
            // console.log('scrolling down !');
        }
    });

    $('#reset-zoom').on('click', function () {
        application.Reset_Zoom();
    });
});
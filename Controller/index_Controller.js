const electron = require('electron');
const ipc = electron.ipcRenderer;

const { dialog } = require('electron').remote;

require('../archivos_estaticos/chartjs-plugin-zoom');

// require('chart.js')

// var fs = require('fs');

var Application = require('../Model/Logic_Application');
var Application_Utilities = require('../Utilities/Application_Utilities');
var Visual_Application = require('../GUI/Visual_Application');
// var ArgumentException = require('../Utilities/Exception');

var remote = require('electron').remote;
const main_Window = remote.getCurrentWindow();

$(document).ready(function () {
    $('#container-edit-nssc').hide();
    $('#change-color').attr('disabled', 'disabled');
    $('#options-scale-axis *').attr('disabled', 'disabled');
    $('#option-mu *').attr('disabled', 'disabled');
    $('#option-s *').attr('disabled', 'disabled');

    // Instance Visual Application
    var application = new Visual_Application($('#mycanvas'), new Application());

    // var sampling_vector = [];
    // var items_selecteds = [];
    application.Initialize_Information_Of_Functions($('#graphic'), $('#theta'), $('#rho'), $('#model'));

    $('#open-file').on('click', function () {

        var options = {
            filters: [
                { name: 'PSMC', extensions: ['psmc', 'txt', 'msmc'] }
            ],

            properties: ['multiSelections'],
        }


        // Open a File or Files selected for user
        dialog.showOpenDialog(main_Window, options, function (arrPath) {
            if (arrPath) {
                var paths = Application_Utilities.Divide_Paths(arrPath);
                var psmc_msmc_paths = paths[0];
                var nssc_paths = paths[1];
                $('#canvas-container').removeClass('disabled');

                if (psmc_msmc_paths.length != 0) {
                    application.logic_application.Add_File_PSMC_MSMC(psmc_msmc_paths, function () {

                        application.Visualize_PSMC_MSMC();

                        $('#options-scale-axis *').removeAttr('disabled');
                        $('#switch-selection').removeAttr('disabled');
                    });
                }

                if (nssc_paths.length != 0) {
                    application.logic_application.Add_File_NSSC(nssc_paths, function () {
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


    var selected_function;
    var legend_color;

    $('#list-graphics').on('click', function () {
        //Delete function
        if ($(event.target).is('.zmdi-delete')) {
            var event_target = $(event.target);

            dialog.showMessageBox(main_Window, { type: 'question', message: 'Do you want to delete this function', buttons: ['Accept', 'Cancel'] }, (response) => {
                if (response == 0) application.Delete_Function(event_target);
            });
        }

        //Selections
        if ($(event.target).is('.custom-control-input')) {

            selected_function = application.logic_application.Get_Function(($(event.target).parents('.custom-control').siblings('.listview__content').children('.listview__heading')).text());
            legend_color = $(event.target).parents('.custom-control').children('.custom-control--char__helper');

            // Disable multiple selection in checkbox control
            $('.custom-control-input').click(function () {
                $('.custom-control-input').not(this).prop('checked', false);
            });
            //------------

            if ($(event.target).prop('checked')) {
                $('#reset-scales').removeAttr('disabled');
                $('#reset-all-scales').removeAttr('disabled');
                $('#change-color').removeAttr('disabled');

                if (selected_function.model == 'psmc') {
                    $('#option-s *').removeAttr('disabled');
                    $('#option-mu *').removeAttr('disabled');
                    // slider_s.noUiSlider.set(graphic.S);
                    slider_mu.noUiSlider.set(selected_function.Mu);
                }

                else {
                    // slider_s.noUiSlider.set(100);
                    slider_mu.noUiSlider.set(selected_function.Mu);
                    $('#option-mu *').removeAttr('disabled');
                    $('#option-s *').attr('disabled', 'disabled');
                }

                // $('#option-s *').removeAttr('disabled');
                // $('#option-mu *').removeAttr('disabled');
                // legend_color = [];
                // items_selecteds = [];
                // items_selecteds.push(name_item_clicked);
                // legend_color.push($(event.target).parents('.custom-control').children('.custom-control--char__helper'));
            }

            else {
                $('#reset-scales').attr('disabled', 'disabled');
                $('#reset-all-scales').attr('disabled', 'disabled');
                $('#change-color').attr('disabled', 'disabled');
                $('#option-s *').attr('disabled', 'disabled');
                $('#option-mu *').attr('disabled', 'disabled');
                slider_s.noUiSlider.set(100);
                slider_mu.noUiSlider.set(1.25);

                // legend_color = [];
                // items_selecteds = [];
            }
            // }

            // else {
            //     if ($(event.target).prop('checked')) {
            //         if (!items_selecteds.includes(name_item_clicked)) {
            //             $('#reset-scales').removeAttr('disabled');
            //             $('#reset-all-scales').removeAttr('disabled');
            //             $('#change-color').removeAttr('disabled');
            //             $('#option-s *').removeAttr('disabled');
            //             $('#option-mu *').removeAttr('disabled');
            //             items_selecteds.push(name_item_clicked);
            //             legend_color.push($(event.target).parents('.custom-control').children('.custom-control--char__helper'));
            //         }
            //     }
            //     else {
            //         var index = items_selecteds.indexOf(name_item_clicked);
            //         items_selecteds.splice(index, 1)
            //         legend_color.splice(index, 1)

            //         if (items_selecteds.length == 0) {
            //             $('#reset-scales').attr('disabled', 'disabled');
            //             $('#reset-all-scales').attr('disabled', 'disabled');
            //             $('#change-color').attr('disabled', 'disabled');
            //             $('#option-s *').attr('disabled', 'disabled');
            //             $('#option-mu *').attr('disabled', 'disabled');
            //             slider_s.noUiSlider.set(100);
            //             slider_mu.noUiSlider.set(1.25);
            //         }
            //     }
            // }

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

            application.Visualize_Information_Of_Functions(selected_function, $('#graphic'), $('#theta'), $('#rho'), $('#model'));
        }
    })

    $(".colorpicker-element").on("change", function () {
        application.Update_Colors(selected_function, $(this).val(), legend_color);
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
        application.Update_Scale_PSMC_MSMC(selected_function, a[b], $('#input-slider-value-s').val());

        $('#input-slider-value-mu').val(Application_Utilities.Convert_Decimal_Scientific_Notation(a[b]));
    })

    // var slider_s = document.getElementById("slider-s");

    // noUiSlider.create(slider_s, {
    //     start: [100],
    //     connect: "lower",
    //     range: { min: 1, max: 1000 },

    //     format: wNumb({
    //         decimals: 0,
    //     })
    // })

    // if ($('#options #option-s *').attr('disabled') == 'disabled') {
    //     slider_s.noUiSlider.on("update", function (a, b) {
    //         document.getElementById("input-slider-value-s").value = a[b];
    //     });
    // }

    // slider_s.noUiSlider.on('slide', function (a, b) {
    //     for (const element of items_selecteds) {
    //         application.Update_Scale_PSMC_MSMC(element, $('#input-slider-value-mu').val(), a[b]);
    //     }
    // });

    //--------------
    var slider_nref = document.getElementById("slider-nref");

    noUiSlider.create(slider_nref, {
        start: [500],
        connect: "lower",
        range: { min: 1, max: 10000 },

        format: wNumb({
            decimals: 0,
        })
    })

    // if ($('#options #option-nref *').attr('disabled') == 'disabled') {
    slider_nref.noUiSlider.on("update", function (a, b) {
        document.getElementById("input-slider-value-nref").value = a[b];
    });
    // }

    slider_nref.noUiSlider.on('slide', function (a, b) {
        application.Update_Scale_NSSC(selected_function, a[b]);
    });

    $('#reset-scales').on('click', function () {
        application.Reset_Scales(application.logic_application.Get_Function(selected_function.name));
        slider_s.noUiSlider.set(100);
        slider_mu.noUiSlider.set(1.25);
        slider_nref.noUiSlider.set(500);
    });

    $('#reset-all-scales').on('click', function () {
        application.Reset_All_Scales();
        slider_s.noUiSlider.set(100);
        slider_mu.noUiSlider.set(1.25);
        slider_nref.noUiSlider.set(500);
    });

    // $('#order-n').on('keyup', function () {
    //     var order = $(this).val();
    //     $('#order-m').val(order);
    // });

    ipc.on('restart-options-nssc', function () {
        nssc_scenario = null;
        application.Restart_NSSC_Options();
    });

    var nssc_scenario;
    $('#open-scenario-editor').on('click', function () {
        var values = {
            type: $('#type-nssc-model').val(),
            nssc_scenario: nssc_scenario,
            number_of_events: parseInt($('#count-events').val()),
            order: parseInt($('#order-n').val()),
            name: $('#nssc-name').val(),
        }

        ipc.send('open-scenario-editor', values);
    });

    $('#test').on('click', function () {

    });

    ipc.on('nssc-json-result', function (event, scenario) {
        application.logic_application.Get_NSSC_Vectors($('#type-nssc-model').val(), $('#nssc-name').val(), scenario, function (nssc_function) {
            // if (nssc_function) application.Update_NSSC(nssc_function);
            application.Visualize_NSSC();
        });
    });


    var matrix_collection = [];
    var deme_vector_collection = [];
    var sampling_vector = $('#sampling-vector');
    var order;
    var number_of_events;

    $('#load-nssc-state').on('click', function () {
        if ($('#model').html() != 'The Non-Stationary Structured Coalescent') {
            var options = {
                filters: [
                    { name: 'SNSSC', extensions: ['snssc'] }
                ],
            }

            dialog.showOpenDialog(main_Window, options, function (arrPath) {
                if (arrPath) {
                    Application.Load_File(arrPath[0], function (scenario) {
                        nssc_scenario = scenario;

                        var path_split = arrPath[0].split('/');
                        var file_name = path_split[path_split.length - 1].slice(0, -6);

                        application.Load_Principal_Window_Data(file_name, nssc_scenario, function () {
                            $('#open-scenario-editor').trigger('click');
                        });
                    });
                }
            });
        }

        else {
            $('#container-create-nssc').fadeOut(50, function () {
                $('#container-edit-nssc').fadeIn(500);
            });

            nssc_scenario = selected_function.scenario;

            application.Load_Principal_Window_Data(selected_function.name, nssc_scenario, function () {

                var type = $('#type-nssc-model').val();
                number_of_events = parseInt($('#count-events').val());
                order = parseInt($('#order-n').val());

                Visual_Application.Build_Visual_Scenario(3, nssc_scenario, matrix_collection, deme_vector_collection, sampling_vector, order, type, number_of_events);
            });
        }
    });

    // $('highlight highlight-top highlight-bottom highlight-left highlight-right').on('click', function(){
    //     console.log('ok')
    // })

    $('#back').on('click', function () {
        $('#container-edit-nssc').fadeOut(50, function () {
            $('#container-create-nssc').fadeIn(500);
            application.Restart_Edit_Container(matrix_collection, deme_vector_collection, sampling_vector);
            matrix_collection = [];
            deme_vector_collection = [];
            sampling_vector = $('#sampling-vector');
        });
    });

    $('#ok').on('click', function () {
        var scenario;
        if ($('#type-nssc-model').val() == 'General') scenario = Application.Build_General_Scenario_NSSC(matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0));
        else scenario = Application.Build_Symmetrical_Scenario_NSSC(order, sampling_vector.jexcel('getRowData', 0), number_of_events + 1);

        application.logic_application.Get_NSSC_Vectors($('#type-nssc-model').val(), $('#nssc-name').val(), scenario, function (nssc_function) {
            application.Update_NSSC(nssc_function);
            // else application.Visualize_NSSC();
        });
    });

    $('#tab-container').on('scroll', function () {
        Visual_Application.Hide_Corner_Jexcel();
    });

    $('#switch-selection-pagination').on('change', function () {
        /* initiate plugin */
        if ($(this).prop('checked')) {
            $("div.holder").jPages({
                containerID: "list-scenario",
                perPage: 1
            });
        }

        else $("div.holder").jPages("destroy");
    });

    $('#save-nssc').on('click', function () {
        // var nssc_model = application.logic_application.Get_NSSC_Function(selected_function.name)
        var nssc_save = JSON.stringify(selected_function);

        var options = {
            title: 'Save...',
            defaultPath: selected_function.name,

            filters: [
                { name: 'NSSC', extensions: ['nssc'] }
            ],
        }

        dialog.showSaveDialog(main_Window, options, function (filename) {
            Application.Save_File(filename, nssc_save);
        });
    });

    $('#mycanvas').bind('mousewheel', function (e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            $('#zoom').removeClass('zmdi-zoom-out');
            $('#zoom').addClass('zmdi-zoom-in');
        }
        else {
            $('#zoom').removeClass('zmdi-zoom-in');
            $('#zoom').addClass('zmdi-zoom-out');
        }
    });

    $('#reset-zoom').on('click', function () {
        application.Reset_Zoom();
    });

    $('#get-distance').on('click', function () {
        var psmc_msmc_model_data = application.Get_Graphic($('#psmc-msmc-model').val()).data;
        var nssc_model = application.logic_application.Get_Function($('#nssc-model').val());

        var vectors = Application_Utilities.Generate_Inverse_Data_To_Chart(psmc_msmc_model_data);

        application.logic_application.Compute_Distance(vectors, nssc_model.scenario, $('#input-slider-value-nref').val(), function (result) {
            $('#distance-result').val('The distance is: ' + result)
        });
    });
});
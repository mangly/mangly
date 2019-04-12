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
    $('#change-color').attr('disabled', 'disabled');
    $('#options-scale-axis *').attr('disabled', 'disabled');
    $('#option-mu *').attr('disabled', 'disabled');
    $('#option-s *').attr('disabled', 'disabled');

    // Instance Visual Application
    var application = new Visual_Application($('#mycanvas'), new Application());

    // var sampling_vector = [];
    // var items_selecteds = [];
    application.Initialize_Information_Of_Functions();

    $('#open-file').on('click', function () {

        var options = {
            filters: [
                { name: 'File', extensions: ['psmc', 'txt', 'msmc', 'nssc'] }
            ],

            // properties: ['multiSelections'],
        }


        // Open a File or Files selected for user
        dialog.showOpenDialog(main_Window, options, function (arrPath) {
            if (arrPath) {
                var paths = Application_Utilities.Divide_Paths(arrPath);
                var psmc_msmc_paths = paths[0];
                var nssc_paths = paths[1];
                // $('#canvas-container').removeClass('disabled');

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
        var target = $(event.target);
        //Delete function
        if (target.is('.zmdi-delete')) {
            // var event_target = target;
            dialog.showMessageBox(main_Window, { type: 'question', message: 'Do you want to delete this function', buttons: ['Cancel', 'Accept'] }, (response) => {
                if (response == 1) {
                    application.Delete_Function(target);
                    application.Delete_Function_Metaheuristic_List(selected_function.name);
                    application.Initialize_Information_Of_Functions();
                    selected_function = null;
                }
            });
        }
        //Selections
        else if (target.is('.custom-control-input')) {
            selected_function = application.logic_application.Get_Function((target.parents('.custom-control').siblings('.listview__content').children('.listview__heading')).text());
            legend_color = target.parents('.custom-control').children('.custom-control--char__helper');
            application.Select_Function(target, selected_function, legend_color, slider_mu);
        }
    });


    $('#card-canvas').on('keydown', function (e) {
        if (e.ctrlKey) $('#canvas-container').removeClass('disabled');
    });

    $('#card-canvas').on('keyup', function () {
        $('#canvas-container').addClass('disabled');
    });

    var matrix;
    var sum = 2;
    var old_value = 0;
    $(document).on('click', 'td', function () {
        matrix = $(this).closest('.matrix');
        if (matrix.prop('id') == 'sampling-vector') {
            if (!$(this).hasClass('edition')) old_value = parseInt($(this).html());
        }
        else if (sum != 2) dialog.showMessageBox(main_Window, { type: 'error', message: 'The sum of the sampling vector has to be 2', buttons: ['Accept'] });
    });

    $(document).on('change', 'td', function (e) {
        var previous_sum = sum;
        sum = Application_Utilities.Sum(sampling_vector.jexcel('getRowData', 0));
        if (sum == 2) {
            var scenario_update = Application.Build_Scenario_Update(selected_function.type, matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0), number_of_events + 1);

            application.logic_application.Get_NSSC_Vectors(selected_function.type, selected_function.name, scenario_update, function (nssc_function) {
                application.Update_NSSC(nssc_function);
            });
        }

        else {
            if (isNaN(sum)) $(this).text(0);
            else if (sum > 2) {
                $(this).text(old_value);
                sum = previous_sum;
            }

            $(this).removeClass('edition');
        }
    });

    $(document).on('click', '.symmetrical-input', function () {
        // sum = Application_Utilities.Sum(sampling_vector.jexcel('getRowData', 0));
        // if (sum == 2) {
        //     var scenario_update = Application.Build_Scenario_Update(selected_function.type, matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0), number_of_events + 1);

        //     application.logic_application.Get_NSSC_Vectors(selected_function.type, selected_function.name, scenario_update, function (nssc_function) {
        //         application.Update_NSSC(nssc_function);
        //     });
        // }

        if (sum != 2) {
            dialog.showMessageBox(main_Window, { type: 'error', message: 'The sum of the sampling vector has to be 2', buttons: ['Accept'] });
        }
    });

    $(document).on('keypress', '.edition', function (e) {
        if (matrix.prop('id') == 'sampling-vector') Application_Utilities.Allow_Only_Number(e, 'int');
        else Application_Utilities.Allow_Only_Number(e, 'float');
    });

    $("#change-color").on("change", function () {
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
    });

    slider_mu.noUiSlider.on("slide", function (a, b) {
        var mu = (Math.round(a[b] * 100) / 100) + 'e-8';
        var real_mu = a[b] * 1e-8;
        var s = selected_function.S;
        $('#input-slider-value-mu').val(mu);
        application.Update_Scale_PSMC_MSMC(selected_function, real_mu, s);
    });

    $('#input-slider-value-mu').on('change', function () {
        document.getElementById("slider-mu").noUiSlider.set($(this).val() / 1e-8);
        application.Update_Scale_PSMC_MSMC(selected_function, $(this).val(), selected_function.S);
    });

    $('#input-slider-value-s').on('change', function () {
        application.Update_Scale_PSMC_MSMC(selected_function, $('#input-slider-value-mu').val(), $(this).val());
    });

    //Start N_ref--------------
    var slider_nref = document.getElementById("slider-nref");

    noUiSlider.create(slider_nref, {
        start: [500],
        connect: "lower",
        range: { min: 1, max: 10000 },

        format: wNumb({
            decimals: 0,
        })
    })

    $('#input-slider-value-nref').on('change', function () {
        document.getElementById("slider-nref").noUiSlider.set($(this).val());
        application.Update_Scale_NSSC(selected_function, $('#input-slider-value-nref').val());
    });

    slider_nref.noUiSlider.on('slide', function (a, b) {
        $('#input-slider-value-nref').val(a[b]);
        application.Update_Scale_NSSC(selected_function, a[b]);
    });

    slider_nref.noUiSlider.on('set', function (a, b) {
        if (compute_distance) application.Show_Distance();
    });
    //finish N_ref-------------------

    $('#reset-scales').on('click', function () {
        application.Reset_Scales(application.logic_application.Get_Function(selected_function.name));
        $('#input-slider-value-s').val(100);
        application.Reset_Slider('mu', slider_mu, $('#input-slider-value-mu'));
    });

    $('#reset-all-scales').on('click', function () {
        application.Reset_All_Scales();
        $('#input-slider-value-s').val(100);
        application.Reset_Slider('mu', slider_mu, $("#input-slider-value-mu"));
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

    // $('#test').on('click', function () {

    // });

    ipc.on('nssc-json-result', function (event, scenario) {
        application.logic_application.Get_NSSC_Vectors($('#type-nssc-model').val(), $('#nssc-name').val(), scenario, function () {
            application.Visualize_NSSC();
        });
    });


    var matrix_collection = [];
    var deme_vector_collection = [];
    var sampling_vector = $('#sampling-vector');
    var order;
    var number_of_events;

    $('#load-nssc-state').on('click', function () {
        if (!selected_function) {
            var options = {
                filters: [
                    { name: 'File', extensions: ['snssc'] }
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
            var type = selected_function.type;

            application.Load_Principal_Window_Data(selected_function.name, nssc_scenario, function () {
                if (type == 'Symmetrical') $('#demes-sv').removeAttr('hidden');
                else $('#demes-sv').attr('hidden', 'hidden');

                number_of_events = parseInt($('#count-events').val());
                order = parseInt($('#order-n').val());

                application.Build_Visual_Scenario_With_Sliders(nssc_scenario, matrix_collection, deme_vector_collection, sampling_vector, order, type, number_of_events);
                $('#demes-sv').val(order);
            });
        }
    });

    $('#demes-sv').on('change', function () {
        var diference = $(this).val() - order;

        if (diference > 0) {
            Visual_Application.Add_Deme(diference, order, deme_vector_collection, sampling_vector, matrix_collection);
            order += diference;
        }
        else if (diference != 0) {
            diference = Math.abs(diference);
            order -= diference;
            Visual_Application.Delete_Deme(diference, order, deme_vector_collection, sampling_vector, matrix_collection);
        }

        var scenario_update = Application.Build_Scenario_Update(selected_function.type, matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0), number_of_events + 1);

        application.logic_application.Get_NSSC_Vectors(selected_function.type, selected_function.name, scenario_update, function (nssc_function) {
            application.Update_NSSC(nssc_function);
            if (compute_distance) application.Show_Distance();
            // console.log(selected_function.scenario)
        });
    });

    $('#back').on('click', function () {
        $('#container-edit-nssc').fadeOut(50, function () {
            $('#container-create-nssc').fadeIn(500);
            application.Restart_Edit_Container();
            nssc_scenario = null;
            matrix_collection = [];
            deme_vector_collection = [];
            sampling_vector = $('#sampling-vector');
        });
    });

    $('#container-edit-nssc').on('scroll', function () {
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
                { name: 'File', extensions: ['nssc'] }
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

    var compute_distance = false;
    $('#psmc-msmc-model').on('change', function () {
        if ($(this).val() != '... PSMC / MSMC ...' && $('#nssc-model').val() != '... NSSC ...') {
            compute_distance = true;
            application.Show_Distance();
            application.Change_Information_Of_Functions();
            $('#start_metaheuristic').removeAttr('disabled');
        }
        else {
            $('#distance-value-col').fadeOut(50, function () {
                $('.theta-rho').fadeIn(500);
            });

            $('#start_metaheuristic').attr('disabled', 'disabled');
        }
    });

    $('#nssc-model').on('change', function () {
        var target;
        var name_model = $(this).val();
        list_graphics = $('.custom-control-input');

        for (let index = 0; index < list_graphics.length; index++) {
            const element = list_graphics.eq(index);

            if (name_model == (element.parents('.custom-control').siblings('.listview__content').children('.listview__heading')).text()) {
                element.prop('checked', 'true');
                target = element;
                break;
            }
        }

        if (target) {
            selected_function = application.logic_application.Get_Function((target.parents('.custom-control').siblings('.listview__content').children('.listview__heading')).text());
            application.Select_Function(target, selected_function, legend_color, slider_mu);
        }

        if (name_model != '... NSSC ...' && $('#psmc-msmc-model').val() != '... PSMC / MSMC ...') {
            compute_distance = true;
            application.Show_Distance();
            application.Change_Information_Of_Functions();
            $('#start_metaheuristic').removeClass('disabled');
        }
        else {
            $('#distance-value-col').fadeOut(50, function () {
                $('.theta-rho').fadeIn(500);
            });

            $('#start_metaheuristic').addClass('disabled');
        }
    });

    var metaheuristic_scenario_result;
    var metaheuristic_n_ref_result;
    var metaheuristic_distance_result;
    var metaheuristic_vectors_result;
    $('#start_metaheuristic').on('click', function () {
        if ($('#nssc-model').val() != '... NSSC ...' && $('#psmc-msmc-model').val() != '... PSMC / MSMC ...') {
            $('#modal-default').modal({
                backdrop: 'static',
                keyboard: false
            });
            application.Show_Optimal_Values_Metaheuristics(function (metaheuristic_results) {
                // $('#modal-default').modal('hide');
                $('.modal-title').text('Do you want evaluate this solution?')
                $('#stop-yes').html('Yes');
                $('#no').fadeIn(500);
                $('#function_processing').fadeOut(50, function () {
                    $('.solution').fadeIn(500, function () {
                        metaheuristic_scenario_result = metaheuristic_results.optimal_scenario;
                        metaheuristic_distance_result = metaheuristic_results.distance;
                        metaheuristic_n_ref_result = metaheuristic_results.n_ref;
                        metaheuristic_vectors_result = metaheuristic_results.vectors;

                        best_distance = parseFloat($('#distance-value').text()) > parseFloat(metaheuristic_distance_result);
                        if (best_distance) $('.solution').html('The algorithm obtained an acceptable solution');
                        else $('.solution').html('The algorithm did not obtain an acceptable solution');
                    });
                });
            });
        }
    });

    $('#stop-yes').on('click', function () {
        $('#distance-value').text(metaheuristic_distance_result);
        application.logic_application.Update_NSSC(selected_function, metaheuristic_scenario_result, metaheuristic_vectors_result);
        selected_function.N_ref = metaheuristic_n_ref_result;
        application.Update_NSSC(selected_function);
        $('#load-nssc-state').trigger('click');
        $('#tab-nssc').trigger('click');
        $('#input-slider-value-nref').val(selected_function.N_ref);
        document.getElementById("slider-nref").noUiSlider.set(selected_function.N_ref);
    });

    $('#es').on('click', function () {
        // $('#modal-default').modal({
        //     backdrop: 'static',
        //     keyboard: false
        // });

        // $('body').attr('disabled', 'disabled')
    });

    // $('#get-distance').on('click', function () {
    //     var psmc_msmc_model_data = application.Get_Graphic($('#psmc-msmc-model').val()).data;
    //     var nssc_model = application.logic_application.Get_Function($('#nssc-model').val());

    //     var vectors = Application_Utilities.Generate_Inverse_Data_To_Chart(psmc_msmc_model_data);

    //     application.logic_application.Compute_Distance(vectors, nssc_model.scenario, $('#input-slider-value-nref').val(), function (result) {
    //         $('#distance-result').val('The distance is: ' + result)
    //     });
    // });
});
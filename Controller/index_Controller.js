const electron = require('electron');
const ipc = electron.ipcRenderer;

const { dialog } = require('electron').remote;

require('chartjs-plugin-zoom');

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

    //Popovers
    var popOverSettings = {
        placement: 'right',
        container: 'body',
        html: true,
        selector: '[rel="popover"]',
        content: function () {
            return $('#open-file').html();
        }
    }

    $(document).on("click", "button[rel=popover]", function () {
        $("button[rel=popover]").not(this).popover('hide');
    });

    $('body').popover(popOverSettings);
    //Popovers

    // Instance Visual Application
    var application = new Visual_Application($('#mycanvas'), new Application());

    application.Initialize_Information_Of_Functions();

    ipc.on('open-file', function () {
        var options = {
            filters: [
                { name: 'File', extensions: ['psmc', 'txt', 'msmc', 'nssc'] }
            ],
        }

        // Open a File selected for the user
        dialog.showOpenDialog(main_Window, options, function (arrPath) {
            if (arrPath) {
                var extension = Application_Utilities.Get_Model_Selected(arrPath[0]);
                var name = Application_Utilities.Get_Model_Name(arrPath[0]);

                if (extension == 'psmc' || extension == 'psmcp' || extension == 'msmc' || extension == 'msmcp' || extension == 'txt') {
                    if (extension == 'psmc')
                        application.logic_application.Add_File_PSMC(arrPath[0], name, function (error) {
                            if (!error) application.Visualize_PSMC();
                            else application.Show_Information_Window('The selected function already exists whit that name or it has the same behavior');
                        });

                    else if (extension == 'msmc' || extension == 'txt') {
                        application.logic_application.Add_File_MSMC(arrPath[0], name, function (error) {
                            if (!error) application.Visualize_MSMC();
                            else application.Show_Information_Window('The selected function already exists whit that name or it has the same behavior');
                        });
                    }

                    else if (extension == 'psmcp') {
                        application.logic_application.Add_File_PSMCP(arrPath[0], function (error) {
                            if (!error) application.Visualize_PSMC();
                            else application.Show_Information_Window('The selected function already exists whit that name or it has the same behavior');
                        });
                    }

                    else if (extension == 'msmcp') {
                        application.logic_application.Add_File_MSMCP(arrPath[0], function (error) {
                            if (!error) application.Visualize_MSMC();
                            else application.Show_Information_Window('The selected function already exists whit that name or it has the same behavior');
                        });
                    }

                    $('#options-scale-axis *').removeAttr('disabled');
                    $('#delete-all').prop('disabled', false);
                }

                else if (extension == 'nssc') {
                    application.logic_application.Add_File_NSSC(arrPath[0], function (error) {
                        if (!error) application.Visualize_NSSC();
                        else application.Show_Information_Window('The selected function already exists whit that name or it has the same behavior');
                    });

                    $('#delete-all').prop('disabled', false);
                }

                else if (extension == 'adhos') {
                    application.logic_application.Add_Files(arrPath[0], function () {
                        application.Visualize_Application();
                    });

                    $('#delete-all').prop('disabled', false);
                }

                else application.Show_Error_Window('Invalid file: ' + name + '.' + extension);
            }
        });
    });


    var selected_function;
    var legend_color;

    $(document).on('click', '.btn-delete', function () {
        if (selected_function && selected_function.name == ($(this).siblings('.listview__content').children('.listview__heading')).text()) {
            $("button[rel=popover]").popover('hide');

            application.Show_Delete_Window('The function is going to be eliminated', () => {
                if ($('#nssc-model').val() == selected_function.name || $('#psmc-msmc-model').val() == selected_function.name) {
                    compute_distance = false;
                    $('#start_metaheuristic').prop('disabled', true);
                    application.Hide_Panel_Distance();
                }
                application.Delete_Function(selected_function.name, $(this));
                selected_function = null
            });
        }
    });

    $(document).on('click', '.btn-load', function () {
        if (selected_function && selected_function.name == ($(this).siblings('.listview__content').children('.listview__heading')).text()) {
            $("button[rel=popover]").popover('hide');

            if (selected_function.model == 'nssc') {
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
                    Visual_Application.Hide_Corner_Jexcel();
                });

                $('#tab-nssc').trigger('click');
            }

            else $('#tab-scales').trigger('click');
        }
    });

    $(document).on('click', '.custom-control-input', function () {
        selected_function = application.logic_application.Get_Function(($(this).parents('.custom-control').siblings('.listview__content').children('.listview__heading')).text());
        legend_color = $(this).parents('.custom-control').children('.custom-control--char__helper');
        selected_function = application.Select_Function($(this), selected_function, slider_mu);
    });

    $('#delete-all').on('click', function () {
        application.Show_Delete_Window('All functions are going to be eliminated', () => {
            application.Delete_All_Function();
            $(this).prop('disabled', true);

            compute_distance = false;
            $('#start_metaheuristic').prop('disabled', true);
            application.Hide_Panel_Distance();
        });

    });

    $('#card-canvas').on('keydown', function (e) {
        if (e.ctrlKey) $('#canvas-container').removeClass('disabledCanvas');
    });

    $('#card-canvas').on('keyup', function () {
        $('#canvas-container').addClass('disabledCanvas');
    });

    $('.dropdown ul li').on('click', function () {
        $(this).trigger('mouseout');
    });

    var matrix;
    var sum = 2;
    var old_value = 0;
    $(document).on('click', 'td', function () {
        matrix = $(this).closest('.matrix');
        if (matrix.prop('id') == 'sampling-vector') {
            if (!$(this).hasClass('edition')) old_value = parseInt($(this).html());
        }
        // else if (sum != 2) dialog.showMessageBox(main_Window, { type: 'error', message: 'The sum of the sampling vector has to be 2', buttons: ['Accept'] });
    });

    $(document).on('change', 'td', function () {
        var previous_sum = sum;
        sum = Application_Utilities.Sum(sampling_vector.jexcel('getRowData', 0));
        if (sum == 2) {
            $('#save').css('color', 'white');
            $('#container-nref').removeClass('disabled');
            $('#matrices-deme-sizes').removeClass('disabled');
            $('#container-matrices').removeClass('disabled');

            if (Application_Utilities.Valid_Number($(this).find('.editor').val())) {
                var scenario_update = Application.Build_Scenario_Update(selected_function.type, matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0), number_of_events + 1);

                application.logic_application.Get_NSSC_Vectors(selected_function.type, selected_function.name, scenario_update, function (nssc_function) {
                    application.Update_NSSC(nssc_function);
                });
            }
        }

        else {
            if (isNaN(sum)) $(this).text(0);
            else if (sum > 2) {
                $(this).text(old_value);
                sum = previous_sum;
            }

            else {
                $('#container-nref').addClass('disabled');
                $('#matrices-deme-sizes').addClass('disabled');
                $('#container-matrices').addClass('disabled');
            }

            $(this).removeClass('edition');
        }
    });

    $(document).on('keypress', '.edition', function (e) {
        if (matrix.prop('id') == 'sampling-vector') Application_Utilities.Allow_Only_Number(e, 'int');
        else if (matrix.prop('id').substring(0, 4) == 'deme') Application_Utilities.Allow_Only_Number(e, 'non_negative');
        else Application_Utilities.Allow_Only_Number(e, 'float');
    });

    $('#count-events').on('click', function () {
        old_value = parseInt($(this).val());
    });

    $('#count-events').on('keypress', function (e) {
        Application_Utilities.Allow_Only_Number(e, 'non_negative');
    });

    $('#count-events').on('change', function () {
        if (Application_Utilities.Valid_Number_Of_Events($(this).val())) old_value = parseInt($(this).val());
        else $(this).val(old_value);
    });

    $('#order-n').on('click', function () {
        old_value = parseInt($(this).val());
    });

    $('#order-n').on('keypress', function (e) {
        Application_Utilities.Allow_Only_Number(e, 'non_negative');
    });

    $('#order-n').on('change', function () {
        if (Application_Utilities.Valid_Number_Of_Demes($(this).val())) old_value = parseInt($(this).val());
        else $(this).val(old_value);
    });

    $('#input-slider-value-mu').on('click', function (e) {
        old_value = parseFloat($(this).val());
    });

    $('#input-slider-value-mu').on('keypress', function (e) {
        Application_Utilities.Allow_Only_Number(e, 'sn');
    });

    $('#input-slider-value-s').on('click', function (e) {
        old_value = parseInt($(this).val());
    });

    $('#input-slider-value-s').on('keypress', function (e) {
        Application_Utilities.Allow_Only_Number(e, 'int');
    });

    $('#input-slider-value-nref').on('click', function (e) {
        old_value = parseInt($(this).val());
    });

    $('#input-slider-value-nref').on('keypress', function (e) {
        Application_Utilities.Allow_Only_Number(e, 'int');
    });

    $('#demes-sv').on('click', function (e) {
        old_value = parseInt($(this).val());
    });

    $('#demes-sv').on('change', function (e) {
        if (!Application_Utilities.Valid_Sampling_Vector(parseInt($(this).val()))) {
            $(this).val(old_value);
            e.preventDefault();
        }

        old_value = parseInt($(this).val());
    });

    $('#demes-sv').on('keypress', function (e) {
        Application_Utilities.Allow_Only_Number(e, 'int');
    });

    $("#change-color").on("change", function () {
        application.Update_Colors(selected_function, $(this).val(), legend_color);
    });

    $('#tab-graphics').on('click', function () {
        $('#back').trigger('click');
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
        // var mu = (Math.round(a[b] * 100) / 100) + 'e-8';
        $('#save').css('color', 'white');
        var mu = a[b];
        var s = selected_function.S;
        $('#input-slider-value-mu').val(mu + 'e-8');
        application.Update_Scale_PSMC_MSMC(selected_function, mu, s);
    });

    $('#input-slider-value-mu').on('change', function (e) {
        $('#save').css('color', 'white');

        if (!Application_Utilities.Valid_Euler_Number($(this).val(), 0, 3)) {
            $(this).val(old_value);
            e.preventDefault();
        }

        document.getElementById("slider-mu").noUiSlider.set($(this).val() / 1e-8);
        application.Update_Scale_PSMC_MSMC(selected_function, parseFloat($(this).val() / 1e-8), parseInt(selected_function.S));
        old_value = parseFloat($(this).val());
    });

    $('#input-slider-value-s').on('change', function (e) {
        $('#save').css('color', 'white');
        if (!Application_Utilities.Valid_Number($(this).val())) {
            $(this).val(old_value);
            e.preventDefault();
        }

        application.Update_Scale_PSMC_MSMC(selected_function, parseFloat($('#input-slider-value-mu').val() / 1e-8), parseInt($(this).val()));
        old_value = parseInt($(this).val());
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

    $('#input-slider-value-nref').on('change', function (e) {
        $('#save').css('color', 'white');
        if (!Application_Utilities.Valid_NREF(parseInt($(this).val()))) {
            $(this).val(old_value);
            e.preventDefault();
        }
        document.getElementById("slider-nref").noUiSlider.set($(this).val());
        application.Update_Scale_NSSC(selected_function, $('#input-slider-value-nref').val());
        old_value = parseInt($(this).val());
    });

    slider_nref.noUiSlider.on('slide', function (a, b) {
        $('#save').css('color', 'white');
        $('#input-slider-value-nref').val(a[b]);
        application.Update_Scale_NSSC(selected_function, a[b]);
    });

    slider_nref.noUiSlider.on('set', function (a, b) {
        if (compute_distance) application.Show_Distance();
    });
    //finish N_ref-------------------

    $('#reset-scales').on('click', function () {
        application.Reset_Scales(application.logic_application.Get_Function(selected_function.name));
    });

    $('#reset-all-scales').on('click', function () {
        application.Reset_All_Scales();
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

    $('#open-nssc-state').on('click', function () {
        var options = {
            filters: [
                { name: 'File', extensions: ['snssc'] }
            ],
        }

        dialog.showOpenDialog(main_Window, options, function (arrPath) {
            if (arrPath) {
                var name = Application_Utilities.Get_Model_Name(arrPath[0]);
                var extension = Application_Utilities.Get_Model_Selected(arrPath[0]);

                if (extension == 'snssc') {
                    Application.Load_File(arrPath[0], function (scenario) {
                        nssc_scenario = scenario;

                        var path_split = arrPath[0].split('/');
                        var file_name = path_split[path_split.length - 1].slice(0, -6);

                        application.Load_Principal_Window_Data(file_name, nssc_scenario, function () {
                            $('#open-scenario-editor').trigger('click');
                        });
                    });
                }

                else application.Show_Error_Window('Invalid file: ' + name + '.' + extension);
            }
        });
    });

    $('#demes-sv').on('change', function () {
        $('#save').css('color', 'white');
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

    ipc.on('save', function () {
        if (selected_function) {
            if (selected_function.path) {
                $('#save').css('color', 'gray');
                var function_save = JSON.stringify(selected_function);
                Application.Save_File(selected_function.path, function_save);

                $.notify('<strong>Saving...</strong> Do not close this page', {
                    allow_dismiss: false,
                    showProgressbar: true,
                    delay: 1000,
                    type: 'primary',
                    placement: {
                        align: "center",
                        from: "bottom"
                    }
                });
            }

            else ipc.send('save-as');
        }

        else if (application.logic_application.functions_collection.length > 0) ipc.send('save-application');
        // else dialog.showMessageBox(main_Window, { type: 'error', message: 'NSSC model not selected', buttons: ['Accept'] });
    });

    ipc.on('save-as', function () {
        if (selected_function) {
            var extension = selected_function.model;
            if (extension == 'psmc') extension = 'psmcp';
            else if (extension == 'msmc' || extension == 'txt') extension = 'msmcp'

            var options = {
                title: 'Save...',
                defaultPath: selected_function.name,

                filters: [
                    { name: 'File', extensions: [extension] }
                ],
            }

            dialog.showSaveDialog(main_Window, options, function (filename) {
                if (typeof filename != 'undefined') {
                    $('#save').css('color', 'gray');
                    var new_name;
                    if (extension.length == 4) new_name = Application_Utilities.Get_Name_Of_Path(filename, 5);
                    else new_name = Application_Utilities.Get_Name_Of_Path(filename, 6);

                    selected_function.path = filename;
                    var function_clone_to_save = selected_function.Clone();
                    function_clone_to_save.name = new_name;
                    var function_save = JSON.stringify(function_clone_to_save);

                    Application.Save_File(filename, function_save);
                }
            });
        }

        else if (application.logic_application.functions_collection.length > 0) ipc.send('save-application-as');
        // else dialog.showMessageBox(main_Window, { type: 'error', message: 'No function selected', buttons: ['Accept'] });
    });

    ipc.on('save-application', function () {
        // if (selected_function) {
        if (application.logic_application.path) {
            var application_save = {
                functions_collection: application.logic_application.functions_collection,
            }

            var application_to_save = JSON.stringify(application_save);
            Application.Save_File(application.logic_application.path, application_to_save);

            $.notify('<strong>Saving...</strong> Do not close this page', {
                allow_dismiss: false,
                showProgressbar: true,
                delay: 1000,
                type: 'primary',
                placement: {
                    align: "center",
                    from: "bottom"
                }
            });
        }

        else ipc.send('save-application-as');
        // }

        // else if (application.logic_application.functions_collection.length > 0) ipc.send('save-application');
        // else dialog.showMessageBox(main_Window, { type: 'error', message: 'NSSC model not selected', buttons: ['Accept'] });
    });

    ipc.on('save-application-as', function () {
        // var nssc_funtion = application.logic_application.Get_Function($('#nssc-model').val());
        // var psmc_msmc_function = application.logic_application.Get_Function($('#psmc-msmc-model').val());
        // var name_curve_fiting = nssc_funtion.name + '_' + psmc_msmc_function.name;
        var application_save = {
            functions_collection: application.logic_application.functions_collection,
        }

        var options = {
            title: 'Save...',
            defaultPath: 'myAdhos',

            filters: [
                { name: 'File', extensions: ['adhos'] }
            ],
        }

        var application_to_save = JSON.stringify(application_save);

        dialog.showSaveDialog(main_Window, options, function (filename) {
            // $('#save').css('color', 'gray');
            // var new_name;
            // if (extension.length == 4) new_name = Application_Utilities.Get_Name_Of_Path(filename, 5);
            // else new_name = Application_Utilities.Get_Name_Of_Path(filename, 6);

            // var function_clone_to_save = selected_function.Clone();
            // function_clone_to_save.name = new_name;
            // var function_save = JSON.stringify(function_clone_to_save);

            // Application.Save_File(filename, function_save);
            application.logic_application.path = filename;
            if (typeof filename != 'undefined') {
                Application.Save_File(filename, application_to_save);
            }
        });
    });

    $('#save-fit').on('click', function () {
        selected_function = null;
        $('.custom-control-input').prop('checked', false);

        ipc.send('save-application');
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
            $('#start_metaheuristic').removeAttr('disabled');
            // $('#save-fit').removeAttr('disabled');
        }
        else {
            application.Hide_Panel_Distance();

            $('#start_metaheuristic').attr('disabled', 'disabled');
            $('#save-fit').attr('disabled', 'disabled');
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
            $('#start_metaheuristic').removeAttr('disabled');
            // $('#save-fit').removeAttr('disabled');
        }
        else {
            application.Hide_Panel_Distance();

            $('#start_metaheuristic').attr('disabled', 'disabled');
            $('#save-fit').attr('disabled', 'disabled');
        }
    });

    var metaheuristic_scenario_result;
    var metaheuristic_n_ref_result;
    var metaheuristic_distance_result;
    var metaheuristic_vectors_result;
    var metaheuristic_process_interrupted;
    $('#start_metaheuristic').on('click', function () {
        metaheuristic_process_interrupted = false;
        if ($('#nssc-model').val() != '... NSSC ...' && $('#psmc-msmc-model').val() != '... PSMC / MSMC ...') {
            $('#modal-default').modal({
                backdrop: 'static',
                keyboard: false
            });
            application.Show_Optimal_Values_Metaheuristics(function (metaheuristic_results) {
                // $('#modal-default').modal('hide');
                if (!metaheuristic_process_interrupted) {
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
                }
            });
        }
    });

    $('#stop-yes').on('click', function () {
        if ($(this).html() == 'Yes') {
            // $('#distance-value').text(metaheuristic_distance_result);
            $('#save-fit').removeAttr('disabled');
            application.logic_application.Update_NSSC(selected_function, metaheuristic_scenario_result, metaheuristic_vectors_result);
            selected_function.N_ref = metaheuristic_n_ref_result;
            application.Update_NSSC(selected_function);
            $('#input-slider-value-nref').val(selected_function.N_ref);
            document.getElementById("slider-nref").noUiSlider.set(selected_function.N_ref);
            $('#no').trigger('click');
        }

        else {
            application.Show_Information_Window('The process was interrupted for a user');
            metaheuristic_process_interrupted = true;
            application.logic_application.Stop_Python_Communicator();
        }
    });

    $('#no').on('click', function () {
        $('.solution').fadeOut(function () {
            $('#stop-yes').html('Stop');
            $('#no').hide();
            $('#function_processing').show();
        });
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
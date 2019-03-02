'use strict'

const Application_Utilities = require('../Utilities/Application_Utilities');
const Application = require('../Model/Logic_Application');


class Visual_Application {
    constructor(canvas, logic_application) {
        this.canvas = canvas;
        this.logic_application = logic_application;
        this.chart = new Chart(this.canvas, {
            type: 'line',
            data: {
                datasets: [],
            },
            scaleFontColor: 'red',
            options: {
                tooltips: {
                    enabled: false
                },
                hover: {
                    mode: null
                },
                animation: {
                    duration: 100
                },
                scales: {
                    xAxes: [{
                        type: 'logarithmic',

                        ticks: {
                            fontColor: "white",
                            // beginAtZero: false,

                            // autoSkip: true,
                            maxTicksLimit: 5,
                            // stepSize: 10000,

                            callback: function (value) {
                                if (value != 0) return Application_Utilities.Convert_Positive_Number_Scientific_Notation(value.toString());
                            },
                        },

                        gridLines: {
                            display: false,
                            color: "white"
                        },

                        scaleLabel: {
                            display: true,
                            labelString: 'Years',
                            fontColor: 'white'
                        }
                    }],

                    yAxes: [{
                        type: 'linear',

                        ticks: {
                            fontColor: "white",
                            beginAtZero: true,

                            callback: function (value) {
                                return (Math.round(value * 100) / 100).toString();
                            },
                        },

                        gridLines: {
                            display: false,
                            color: "white"
                        },

                        scaleLabel: {
                            display: true,
                            labelString: 'Effective population size',
                            fontColor: 'white'
                        }
                    }],
                },

                pan: {
                    // Boolean to enable panning
                    enabled: true,

                    // Panning directions. Remove the appropriate direction to disable 
                    // Eg. 'y' would only allow panning in the y direction
                    mode: 'xy'
                },

                // Container for zoom options
                zoom: {
                    // Boolean to enable zooming
                    enabled: true,

                    // Zooming directions. Remove the appropriate direction to disable 
                    // Eg. 'y' would only allow zooming in the y direction
                    mode: 'xy',

                    rangeMin: {
                        // Format of min zoom range depends on scale type
                        x: 0,
                        y: 0
                    },
                    rangeMax: {
                        // Format of max zoom range depends on scale type
                        x: null,
                        y: null
                    },
                },

                elements: {
                    line: {
                        tension: 0,
                    },

                    point: {
                        radius: 0,
                    }
                },

                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                        fontColor: 'white',
                        fill: true,
                        boxWidth: 10,
                    },
                    position: 'bottom'
                },

                title: {
                    display: true,
                    text: '',
                    fontColor: 'white',
                    fontFamily: 'Nunito,sans-serif'
                }
            },
        });
    }

    Index_Of(name_graphic) {
        for (let index = 0; index < this.chart.data.datasets.length; index++) {
            const element = this.chart.data.datasets[index];

            if (element.label == name_graphic) return index;
        }

        return -1;
    }

    Get_Graphic(name_graphic) {
        for (const element of this.chart.data.datasets) {
            if (name_graphic == element.label) return element;
        }

        return null;
    }

    Get_Random_Color() {
        var color = Math.floor(Math.random() * Math.pow(256, 3)).toString(16);

        while (color.length < 6) {
            color = "0" + color;
        }

        return "#" + color;
    }

    Visualize_PSMC_MSMC() {
        var element_scale_by_default;
        var IICR;

        for (const element of this.logic_application.functions_collection) {
            if (element.model != 'nssc' && this.Get_Graphic(element.name) == null) {

                element_scale_by_default = element.Clone();
                element.Mu = 1.25;

                if (element.model == 'psmc') {
                    this.logic_application.Scale_Psmc_Function(element_scale_by_default);
                    IICR = element_scale_by_default.IICR_2;
                    element.S = 100;
                }

                else {
                    this.logic_application.Scale_Msmc_Function(element_scale_by_default);
                    IICR = element_scale_by_default.IICR_k;
                }

                var color = this.Get_Random_Color();

                var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element_scale_by_default.time, IICR), 'label': element_scale_by_default.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 2, 'steppedLine': 'true' };

                this.chart.data.datasets.push(graphic);

                this.Visualize_element_of_list(element.name, element.model, color);
                this.Add_model_compute_distance($('#psmc-msmc-model'), element.name);
            }
        }

        this.chart.update();
    }

    Add_model_compute_distance(control, name) {
        control.append('<option>' + name + '</option>')
    }

    Visualize_NSSC_Saved() {
        for (const element of this.logic_application.functions_collection) {
            if (element.model == 'nssc' && this.Get_Graphic(element.name) == null) {

                var element_scale_by_default = element.Clone();

                this.logic_application.Scale_NSSC_Function(element_scale_by_default);

                var color = this.Get_Random_Color();

                var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element_scale_by_default.x_vector, element_scale_by_default.IICR_specie), 'label': element_scale_by_default.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 2, 'borderDash': [10, 5], 'steppedLine': 'true' };

                this.chart.data.datasets.push(graphic);

                this.Visualize_element_of_list(element.name, element.model, color);
                this.Add_model_compute_distance($('#nssc-model'), element.name);
            }
        }

        this.chart.update();
    }

    Visualize_element_of_list(name, model, color) {
        var html = '<div class="pb-4 listview__item"><label class="pl-0 pr-4 custom-control custom-control--char"><input class="custom-control-input" type="checkbox"><span class="custom-control--char__helper" style="background-color:' + color + '"><i></i></span></label><div class="listview__content"><div class="listview__heading">' + name + '</div><p>' + model + ' model</p></div><label class="custom-control custom-checkbox align-self-start"><i class="zmdi zmdi-edit zmdi-hc-2x"></i></span></label><label class="custom-control custom-checkbox align-self-start"><i class="zmdi zmdi-delete zmdi-hc-2x"></i></span></label></div>';
        $('#list-graphics').append(html);
    }

    Visualize_NSSC() {
        $('#canvas-container').removeClass('disabled');

        $('#tab-graphics').trigger('click');
        var color = this.Get_Random_Color();
        var nssc = this.logic_application.Get_Last_NSSC_Function();

        var nssc_scale_by_default = nssc.Clone();
        this.logic_application.Scale_NSSC_Function(nssc_scale_by_default);

        var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(nssc_scale_by_default.x_vector, nssc_scale_by_default.IICR_specie), 'label': nssc_scale_by_default.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 2, 'borderDash': [10, 5], 'steppedLine': 'true' };

        this.chart.data.datasets.push(graphic);

        this.Visualize_element_of_list(nssc.name, nssc.model, color);
        this.Add_model_compute_distance($('#nssc-model'), nssc.name);

        this.chart.update();
    }

    Update_NSSC(nssc_function) {
        var graphic = this.Get_Graphic(nssc_function.name);

        graphic.data = Application_Utilities.Generate_Data_To_Chart(nssc_function.x_vector, nssc_function.IICR_specie);

        this.chart.update();
    }

    Update_Colors(funct, color, legend_color) {
        var graphic = this.Get_Graphic(funct.name)
        graphic.borderColor = color;
        graphic.backgroundColor = color;
        legend_color.css('background-color', color);

        this.chart.update();
    }

    Update_Scale_PSMC_MSMC(original_function, mu, s) {
        var IICR;
        var clone_function = original_function.Clone();
        var graphic = this.Get_Graphic(original_function.name);

        if (original_function.model != 'nssc') {
            if (original_function.model == 'psmc') {
                this.logic_application.Scale_Psmc_Function(clone_function, mu, s);

                IICR = clone_function.IICR_2;
                original_function.Mu = mu * Math.pow(10, 8);
                original_function.S = s;
            }

            else {
                this.logic_application.Scale_Msmc_Function(clone_function, mu);

                IICR = clone_function.IICR_k;
                original_function.Mu = mu * Math.pow(10, 8);
            }
        }

        graphic.data = Application_Utilities.Generate_Data_To_Chart(clone_function.time, IICR);

        this.chart.update();
    }

    Update_Scale_NSSC(original_function, n_ref) {
        var clone_function = original_function.Clone();
        var graphic = this.Get_Graphic(original_function.name);

        this.logic_application.Scale_NSSC_Function(clone_function, n_ref);

        graphic.data = Application_Utilities.Generate_Data_To_Chart(clone_function.x_vector, clone_function.IICR_specie);

        this.chart.update();
    }

    Reset_Scales(funct) {
        if (funct.model != 'nssc') this.Update_Scale_PSMC_MSMC(funct.name, this.logic_application.Mu, this.logic_application.S);
        else this.Update_Scale_NSSC(funct.name, this.logic_application.n_ref);

        this.chart.update();
    }

    Reset_All_Scales() {
        for (const funct of this.logic_application.functions_collection) {
            if (funct.model != 'nssc') this.Update_Scale_PSMC_MSMC(funct.name, this.logic_application.Mu, this.logic_application.S);
            else this.Update_Scale_NSSC(funct.name, this.logic_application.n_ref);
        }

        this.chart.update();
    }

    Restart_NSSC_Options() {
        $('#count-events').val(1);
        $('#order-n').val(1);
        $('#nssc-name').val('NSSC new model');

        $('#type-nssc-model').val('General');
        $('#type-nssc-model').change();
    }

    Get_Parametters(name) {
        for (const element of this.logic_application.functions_collection) {
            if (element.name == name) {
                if (element.model == 'psmc') {
                    return [element.theta, element.rho, 'Pairwise Sequentially Markovian Coalescent'];
                }

                else if (element.model == 'nssc') return ['-', '-', 'The Non-Stationary Structured Coalescent']
                else return ['-', '-', 'Multiple Sequentially Markovian Coalescent'];
            }
        }

        return 'not found';
    }

    Change_Axis_Scale(new_scale, axis) {

        if (axis == 'x') this.chart.options.scales.xAxes[0] = {
            type: new_scale,

            ticks: {
                fontColor: "white"
            },

            gridLines: {
                display: false,
                color: "white"
            },

            scaleLabel: {
                display: true,
                labelString: 'Years',
                fontColor: 'white'
            }
        }

        else if (axis == 'y') this.chart.options.scales.yAxes[0] = {
            type: new_scale,

            ticks: {
                fontColor: "white"
            },

            gridLines: {
                display: false,
                color: "white"
            },

            scaleLabel: {
                display: true,
                labelString: 'Effective population size',
                fontColor: 'white'
            }
        }

        this.chart.update();
    }

    Reset_Zoom() {
        this.chart.resetZoom();
    }

    Visualize_Information_Of_Functions(funct, name, theta, rho, model) {
        var parametters = this.Get_Parametters(funct.name);

        name.html(funct.name);
        theta.html(parametters[0]);
        rho.html(parametters[1]);
        model.html(parametters[2]);

    }

    Initialize_Information_Of_Functions(name, theta, rho, model) {
        name.text('There is not graph selected by the user')
        theta.text('-');
        rho.text('-');
        model.text('-');
    }

    Load_Principal_Window_Data(name, scenario, callback) {
        $('#nssc-name').val(name)

        if (Object.keys(scenario.scenario[0]).length == 4) {
            $('#type-nssc-model').val('Symmetrical');
            $('#type-nssc-model').change();

            $('#order-n').val(scenario.scenario[0].n);
        }
        else {
            $('#type-nssc-model').val('General');
            $('#type-nssc-model').change();

            $('#order-n').val(scenario.scenario[0].migMatrix.length);
        }

        $('#count-events').val(scenario.scenario.length - 1);

        setTimeout(function () { callback(); }, 100);
    }

    Delete_Function(event_target) {
        var name_item_clicked = (event_target.parents('.custom-control').siblings('.listview__content').children('.listview__heading')).text();
        var index = this.Index_Of(name_item_clicked);
        this.chart.data.datasets.splice(index, 1);
        this.logic_application.functions_collection.splice(index, 1);
        event_target.parents('.listview__item').remove();
        this.chart.update()
    }

    static Fill_Initial_Data_Vector(value, type, order = 0) {
        var data = new Array([[value]]);
        var i = 0;

        if (type == 'deme_sizes') i = 1;

        for (let index = i; index < order; index++) {
            data[0].push(value);
        }

        return data;
    }

    static Fill_Initial_Data_Matrix(value, order) {
        var data = new Array();

        for (let index_i = 0; index_i < order; index_i++) {
            var row = new Array();
            for (let index_j = 0; index_j < order; index_j++) {
                row.push(value);
            }

            data.push(row);
        }

        return data;
    }

    static Initialize_Matrix(matrix, data) {
        matrix.jexcel(
            {
                data: data,
                allowManualInsertColumn: false,
            });
    }

    static Configuration_Vector() {
        $('.1xn thead.jexcel_label').remove();
        $('.1xn td.jexcel_label').text('Values:');
        $('.1xn td.jexcel_label').css("width", "60px");
        // $('.1xn .jexcel_label').hide()

        $('.1xn').bind('contextmenu', function (e) {
            return false;
        });
    }

    static Configuration_Matrix(matrix, order) {

        for (let index = 0; index < order; index++) {
            matrix.jexcel('setHeader', index, (index + 1).toString());
        }


        $('.matrix').bind('contextmenu', function (e) {
            return false;
        });
    }

    static Add_Show_Time_Deme_Sizes(html, order, matrix_collection, id) {
        this.Add_Matrix(html, $('#list-scenario'), order, matrix_collection, id, true);
    }

    static Add_Matrix(html, html_append, order, matrix_collection, id, vector) {
        html_append.append(html);

        var matrix = $(id + matrix_collection.length);

        if (vector) this.Initialize_Matrix(matrix, this.Fill_Initial_Data_Vector('1', 'deme_sizes', order));

        else this.Initialize_Matrix(matrix, this.Fill_Initial_Data_Matrix('', order));

        matrix_collection.push(matrix);
        this.Configuration_Matrix(matrix, order);
    }

    static Build_Visual_Scenario(time_size, nssc_scenario, matrix_collection, deme_vector_collection, sampling_vector, order, type, number_of_events) {
        this.Initialize_Matrix(sampling_vector, Visual_Application.Fill_Initial_Data_Vector(0, 'sampling_vector', order - 1));

        for (let index = 0; index < number_of_events + 1; index++) {
            if (type == 'General') {
                if (index == 0) {
                    var html_time_dime_sizes = '<li id = "scen' + index + '"><div class="row pt-4"><div class="col-sm-' + time_size + '"><div class="form-group"><span>Time of change:</span><input id="time0" value="0" disabled type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-' + (12 - time_size) + '"><span>Deme Sizes:</span><div class="matrix 1xn" id="deme0"></div>';
                    this.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');
                }

                else {
                    var html_time_dime_sizes = '<li id = "scen' + index + '"><div class="row pt-4"><div class="col-sm-' + time_size + '"><div class="form-group"><span>Time of change:</span><input id="time' + index + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-' + (12 - time_size) + '"><span>Deme Sizes:</span><div class="matrix 1xn" id="deme' + index + '"></div>';
                    this.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');
                }

                var html_matrix = '<div class="matrix" id="matrix' + index + '"></div>';
                this.Add_Matrix(html_matrix, $('#scen' + index), order, matrix_collection, '#matrix', false);
            }

            else if (type == 'Symmetrical') {
                $('#matrix-collection').attr("style", "overflow-x: none");
                var html;
                if (index == 0) {
                    html = '<li class="pt-4"><div class="row"><div class="col-sm-4"><div class="form-group"><span>Time of change:</span><input id="time0" value="0" disabled type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>M:</span><input id="M0" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>c:</span><input id="c0" class="form-control input-mask"><i class="form-group__bar"></i></div></div></div></li>';
                    $('#matrix-collection>ul').append(html);
                }

                else {
                    html = '<li class="pt-4"><div class="row"><div class="col-sm-4"><div class="form-group"><span>Time of change:</span><input id="time' + index + '" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>M:</span><input id="M' + index + '" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>c:</span><input id="c' + index + '" class="form-control input-mask"><i class="form-group__bar"></i></div></div></div></li>';
                    $('#matrix-collection>ul').append(html);
                }
            }
        }

        if (nssc_scenario) {
            if (type == 'General') Application.Load_General_Scenario(nssc_scenario, sampling_vector, matrix_collection, deme_vector_collection);
            else if (type == 'Symmetrical') Application.Load_Symmetrical_Scenario(nssc_scenario, sampling_vector);
        }

        Visual_Application.Configuration_Vector();
    }
}

module.exports = Visual_Application
'use strict'

const Application_Utilities = require('../Utilities/Application_Utilities');

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
                            beginAtZero: true,

                            callback: function (value) {
                                return Application_Utilities.Convert_Positive_Number_Scientific_Notation(value.toString());
                            },
                            // suggestedMin: 0,
                            // suggestedMax: 1000
                            // min = 0,
                            // max = 5e+2
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

                            // min: 0,
                            // max: 5000
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

                var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element_scale_by_default.time, IICR), 'label': element_scale_by_default.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 3, 'steppedLine': 'true' };

                this.chart.data.datasets.push(graphic);

                this.Visualize_element_of_list(element.name, element.model, color);
            }
        }

        this.chart.update();
    }

    Visualize_NSSC_Saved() {
        for (const element of this.logic_application.functions_collection) {
            if (element.model == 'nssc' && this.Get_Graphic(element.name) == null) {

                var element_scale_by_default = element.Clone();

                this.logic_application.Scale_NSSC_Function(element_scale_by_default);

                var color = this.Get_Random_Color();

                var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element_scale_by_default.x_vector, element_scale_by_default.IICR_specie), 'label': element_scale_by_default.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 3, 'steppedLine': 'true' };

                this.chart.data.datasets.push(graphic);

                this.Visualize_element_of_list(element.name, element.model, color);
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

        var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(nssc_scale_by_default.x_vector, nssc_scale_by_default.IICR_specie), 'label': nssc_scale_by_default.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 3, 'steppedLine': 'true' };

        this.chart.data.datasets.push(graphic);

        this.Visualize_element_of_list(nssc.name, nssc.model, color);
        
        this.chart.update();
    }

    Update_NSSC(nssc_function) {
        var graphic = this.Get_Graphic(nssc_function.name);

        graphic.data = Application_Utilities.Generate_Data_To_Chart(nssc_function.x_vector, nssc_function.IICR_specie);

        this.chart.update();
    }

    Update_Colors(function_name, color, legend_color) {
        this.chart.data.datasets.forEach(function (element) {
            if (element.label == function_name) {
                element.borderColor = color;
                element.backgroundColor = color;
                legend_color.css('background-color', color);
                // function_target.children('.album').css('color', color);
            }
        });

        this.chart.update();
    }

    Update_Scale(name_graphic, mu, s) {
        var IICR;
        var original_function = this.logic_application.Get_Function(name_graphic);
        var clone_function = original_function.Clone();
        var graphic = this.Get_Graphic(name_graphic);

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

        // for (let index = 0; index < this.chart.data.datasets.length; index++) {
        //     const element = this.chart.data.datasets[index];

        //     if (element.label == funct.name) {
        //         this.chart.data.datasets[index].data = Application_Utilities.Generate_Data_To_Chart(funct.time, IICR);
        //         this.logic_application.functions_collection[index].Mu = mu * Math.pow(10, 8);
        //         this.logic_application.functions_collection[index].S = s;
        //     }
        // }

        this.chart.update();

    }

    Reset_Scales(funct) {
        // for (const element of this.logic_application.functions_collection) {
        this.Update_Scale(funct.name, this.logic_application.Mu, this.logic_application.S);
        // }

        this.chart.update();
    }

    Reset_All_Scales() {
        for (const element of this.logic_application.functions_collection) {
            this.Update_Scale(element.name, this.logic_application.Mu, this.logic_application.S);
        }

        this.chart.update();
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

    Visualize_Information_Of_Functions(items_selecteds, name, theta, rho, model) {
        if (items_selecteds.length == 1) {
            var parametters = this.Get_Parametters(items_selecteds[0], this.logic_application);

            name.html(items_selecteds[0]);
            theta.html(parametters[0]);
            rho.html(parametters[1]);
            model.html(parametters[2]);
        }

        else {
            this.Initialize_Information_Of_Functions(name, theta, rho, model);
            if (items_selecteds.length > 1) name.text('Some function are selected');
        }

    }

    Initialize_Information_Of_Functions(name, theta, rho, model) {
        name.text('There is not graph selected by the user')
        theta.text('-');
        rho.text('-');
        model.text('-');
    }

    Load_Principal_Window_Data(name, scenario, callback) {

        $('#nssc-name').val(name)

        var order = scenario.scenario[0].migMatrix.length;
        $('#order-n').val(order);

        $('#count-matrix').val(scenario.scenario.length);

        setTimeout(function () { callback(); }, 0 | Math.random() * 100);
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
}

module.exports = Visual_Application
'use strict'

const Application_Utilities = require('../Utilities/Application_Utilities');

class Visual_Application {
    constructor(canvas, logic_application) {
        this.canvas;
        this.logic_application = logic_application;
        this.chart = new Chart(canvas, {
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
                            beginAtZero: true
                            // suggestedMin: 0,
                            // suggestedMax: 1000
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
                            beginAtZero: true
                            // min: 20000,
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
                // var element_clone = element.Clone();
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

    Visualize_element_of_list(name, model, color) {
        var html = '<div class="pb-4 listview__item"><label class="pl-0 pr-4 custom-control custom-control--char"><input class="custom-control-input" type="checkbox"><span class="custom-control--char__helper" style="background-color:' + color + '"><i></i></span></label><div class="listview__content"><div class="listview__heading">' + name + '</div><p>' + model + ' model</p></div><label class="custom-control custom-checkbox align-self-start"><i class="zmdi zmdi-edit zmdi-hc-2x"></i></span></label><label class="custom-control custom-checkbox align-self-start"><i class="zmdi zmdi-delete zmdi-hc-2x"></i></span></label></div>';
        $('#list-graphics').append(html);
    }

    Visualize_NSSC() {
        $('#tab-graphics').trigger('click');
        var color = this.Get_Random_Color();
        var nssc = this.logic_application.Get_Last_NSSC_Function();
        var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(nssc.x_vector, nssc.IICR_specie), 'label': nssc.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 3, 'steppedLine': 'true' };

        this.Visualize_element_of_list(nssc.name, nssc.model, color);
        this.chart.data.datasets.push(graphic);


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

    Reset_Scales() {
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
        name.text('There is no graph selected by the user')
        theta.text('-');
        rho.text('-');
        model.text('-');
    }


    static Initialize_Matrix(matrix) {
        var data = new Array([''])

        matrix.jexcel(
            {
                data: data,
                allowManualInsertColumn: false,
            });
    }

    static Configuration_Sampling_Vector() {
        $('thead.jexcel_label').remove();
        $('td.jexcel_label').text('Values:');
        $('td.jexcel_label').css("width", "60px");
    }

    static Configuration_Matrix_Collection(matrix, order, matrix_collection) {
        for (let index = 1; index < order; index++) {
            matrix.jexcel('insertColumn');
            matrix.jexcel('insertRow');
        }

        for (let index = 0; index < order; index++) {
            matrix.jexcel('setHeader', index, (index + 1).toString());
        }

        $('.matrix').bind('contextmenu', function (e) {
            return false;
        });

        matrix_collection.push(matrix);
    }


    static Add_First_Show_Time_Deme_Sizes(){
        $('#matrix-collection').append('<div class="form-group"><span>Deme sizes:</span><input id="deme0" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div></div>');
    }

    static Add_Show_Time_Deme_Sizes(id){
        $('#matrix-collection').append('<div class="row"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time' + id + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>Deme sizes:</span><input id="deme' + id + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div></div>');
    }

    static Add_Matrix(order, matrix_collection) {
        var id = matrix_collection.length;
        $('#matrix-collection').append('<div class="matrix" style="padding:20px 0 40px 0" id="matrix' + id + '"></div>');

        var matrix = $('#matrix' + id);

        this.Initialize_Matrix(matrix);
        this.Configuration_Matrix_Collection(matrix, order, matrix_collection);
        // var data = new Array([''])

        // matrix.jexcel(
        //     {
        //         data: data,
        //         allowManualInsertColumn: false,
        //     });


        // for (let index = 1; index < order; index++) {
        //     matrix.jexcel('insertColumn');
        //     matrix.jexcel('insertRow');
        // }

        // for (let index = 0; index < order; index++) {
        //     matrix.jexcel('setHeader', index, (index + 1).toString());
        // }

        // $('.matrix').bind('contextmenu', function (e) {
        //     return false;
        // });

        // matrix_collection.push(matrix);
    }
}

module.exports = Visual_Application
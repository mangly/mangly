'use strict'

const Application_Utilities = require('../Utilities/Application_Utilities');

class Visual_Application {
    constructor(canvas, logic_application) {
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
                    }],

                    yAxes: [{
                        type: 'linear',

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
                    }],
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

    Contain(name_graphic) {
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

    Visualize() {
        var element_scale_by_default;
        var IICR;
        for (const element of this.logic_application.psmc_msmc_collection) {
            if (this.Contain(element.name) == null) {
                var element_clone = element.Clone();
                element.Mu = 1.25;
                if (element.model == 'psmc') {
                    element_scale_by_default = this.logic_application.Scale_Psmc_Function(element_clone);
                    IICR = element_scale_by_default.IICR_2;
                    element.S = 100;
                }

                else {
                    element_scale_by_default = this.logic_application.Scale_Msmc_Function(element_clone);
                    IICR = element_scale_by_default.IICR_k;
                }

                var color = this.Get_Random_Color();

                var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element_scale_by_default.time, IICR), 'label': element_scale_by_default.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 3, 'steppedLine': 'true' };

                // var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element_scale_by_default.time, IICR), 'label': element_scale_by_default.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 3, 'steppedLine': 'true', 'Mu': 1.25, 'S': 100, 'model': element.model };
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
        for (const element of this.logic_application.nssc_collection) {
            var color = this.Get_Random_Color();
            var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element.x_vector, element.IICR_specie), 'label': element.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 3, 'steppedLine': 'true' };
            this.chart.data.datasets.push(graphic);
        }

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
        var funct;
        var IICR;

        for (let index = 0; index < this.logic_application.psmc_msmc_collection.length; index++) {
            const element = this.logic_application.psmc_msmc_collection[index];

            if (element.name == name_graphic) {
                if (element.model == 'psmc') {
                    funct = this.logic_application.Scale_Psmc_Function(element.Clone(), mu, s);
                    IICR = funct.IICR_2;
                }

                else {
                    funct = this.logic_application.Scale_Msmc_Function(element.Clone(), mu);
                    IICR = funct.IICR_k;
                }

                break;
            }
        }

        for (let index = 0; index < this.chart.data.datasets.length; index++) {
            const element = this.chart.data.datasets[index];

            if (element.label == funct.name) {
                this.chart.data.datasets[index].data = Application_Utilities.Generate_Data_To_Chart(funct.time, IICR);
                this.logic_application.psmc_msmc_collection[index].Mu = mu * Math.pow(10, 8);
                this.logic_application.psmc_msmc_collection[index].S = s;
            }
        }

        this.chart.update();
    }

    Reset_Scales(list_graphics) {
        for (const element of list_graphics) {
            this.Update_Scale(element.name, this.logic_application.Mu, this.logic_application.S);
        }

        this.chart.update();
    }

    Get_Parametters(name) {
        for (const element of this.logic_application.psmc_msmc_collection) {
            if (element.name == name) {
                if (element.model == 'psmc') {
                    return [element.theta, element.rho, 'Pairwise Sequentially Markovian Coalescent'];
                }

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

}

module.exports = Visual_Application
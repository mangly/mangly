'use strict'

const Application_Utilities = require('../Utilities/Application_Utilities');

class Visual_Application {
    constructor(canvas, application) {
        this.application = application;
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
        for (const element of this.application.psmc_msmc_collection) {
            if (this.Contain(element.name) == null) {
                if (element.model == 'psmc') {
                    element_scale_by_default = this.application.Scale_Psmc_Function(element.Clone());
                    IICR = element_scale_by_default.IICR_2;
                }

                else {
                    element_scale_by_default = this.application.Scale_Msmc_Function(element.Clone());
                    IICR = element_scale_by_default.IICR_k;
                }

                var color = this.Get_Random_Color();
                var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element_scale_by_default.time, IICR), 'label': element_scale_by_default.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 3, 'steppedLine': 'true', 'Mu': 1.25, 'S': 100, 'model': element.model };
                this.chart.data.datasets.push(graphic);
            }
        }

        this.chart.update();
    }

    Visualize_NSSC() {
        for (const element of this.application.nssc_collection) {
            var color = this.Get_Random_Color();
            var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element.x_vector, element.IICR_specie), 'label': element.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': 3, 'steppedLine': 'true' };
            this.chart.data.datasets.push(graphic);
        }

        this.chart.update();
    }

    Update_Colors(function_target, color) {

        this.chart.data.datasets.forEach(function (element) {
            if (element.label == function_target.text().trim()) {
                element.borderColor = color;
                element.backgroundColor = color;
                function_target.children('.album').css('color', color);
            }
        });

        this.chart.update();
    }

    Update_Scale(name_graphic, model, mu, s) {
        var funct;
        var IICR;

        for (let index = 0; index < this.application.psmc_msmc_collection.length; index++) {
            const element = this.application.psmc_msmc_collection[index];

            if (element.name == name_graphic) {
                if (model == 'Pairwise Sequentially Markovian Coalescent') {
                    funct = this.application.Scale_Psmc_Function(element.Clone(), mu, s);
                    IICR = funct.IICR_2;
                }

                else {
                    funct = this.application.Scale_Msmc_Function(element.Clone(), mu);
                    IICR = funct.IICR_k;
                }

                break;
            }
        }

        for (let index = 0; index < this.chart.data.datasets.length; index++) {
            const element = this.chart.data.datasets[index];

            if (element.label == funct.name) {
                this.chart.data.datasets[index].data = Application_Utilities.Generate_Data_To_Chart(funct.time, IICR);
                this.chart.data.datasets[index].Mu = mu * Math.pow(10, 8);
                this.chart.data.datasets[index].S = s;
            }
        }

        this.chart.update();
    }

    Get_Parametters(name) {
        for (const element of this.application.psmc_msmc_collection) {
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

    Visualize_Information_Of_Functions(name_function, name, theta, rho, model) {
        var parametters = this.Get_Parametters(name_function, this.application);

        name.html(name_function);
        theta.html(parametters[0]);
        rho.html(parametters[1]);
        model.html(parametters[2]);
    }

}

module.exports = Visual_Application
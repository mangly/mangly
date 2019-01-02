'use strict'

const Application_Utilities = require('../Utilities/Application_Utilities');

class Visual_Application {
    constructor(application) {
        this.application = application;
        this.chart = new Chart(document.getElementById("mycanvas"), {
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

    Get_Random_Color() {
        var color = Math.floor(Math.random() * Math.pow(256, 3)).toString(16);

        while (color.length < 6) {
            color = "0" + color;
        }

        return "#" + color;
    }

    Visualize_App() {
        var IICR = [];
        var scale_function = this.application.Scale_Functions();

        for (const element of scale_function) {
            if (!Application_Utilities.Contain_Graphic(element.name, this.chart)) {

                if (element.model == 'psmc') IICR = element.IICR_2;
                else IICR = element.IICR_k;

                var color = this.Get_Random_Color();
                var graphic = { 'data': Application_Utilities.Generate_Data_To_Chart(element.time, IICR), 'label': element.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': '3', 'steppedLine': 'true' };
                this.chart.data.datasets.push(graphic);
            }
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
        var funct = '';
        var IICR = [];
        if (model == 'Pairwise Sequentially Markovian Coalescent') {
            for (const element of this.application.psmc_collection) {
                if (element.name == name_graphic) {
                    funct = element.Clone();
                    this.application.Scale_Psmc_Function(funct, mu, s);
                    IICR = funct.IICR_2;
                    break;
                }
            }
        }

        else {
            for (const element of this.application.msmc_collection) {
                if (element.name == name_graphic) {
                    funct = element.Clone();
                    this.application.Scale_Msmc_Function(funct, mu);
                    IICR = funct.IICR_k;
                    break;
                }
            }
        }

        for (let index = 0; index < this.chart.data.datasets.length; index++) {
            const element = this.chart.data.datasets[index];

            if (element.label == funct.name) {
                this.chart.data.datasets[index].data = Application_Utilities.Generate_Data_To_Chart(funct.time, IICR);
            }
        }

        this.chart.update();
    }

    Get_Parametters(name) {
        var collection = $.merge(this.application.psmc_collection, this.application.msmc_collection);

        for (const element of collection) {
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
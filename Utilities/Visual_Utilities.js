'use strict'

const Application_Utilities = require('./Application_Utilities');

class Visual_Utilities {

    static Get_Random_Color() {
        var color = Math.floor(Math.random() * Math.pow(256, 3)).toString(16);

        while (color.length < 6) {
            color = "0" + color;
        }

        return "#" + color;
    }

    static Visualize_App(application, chart) {
        var IICR = [];
        for (const element of application.Scale_Functions()) {
            if (element.type == 'psmc') IICR = element.IICR_2;
            else IICR = element.IICR_k;

            var color = this.Get_Random_Color();
            var graph = { 'data': Application_Utilities.Generate_Data_To_Chart(element.time, IICR), 'label': element.name, 'fill': 'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': '3', 'steppedLine': 'true' };

            if (!Application_Utilities.Contain_Graph(graph, chart)) chart.data.datasets.push(graph);

        }

        chart.update();
    }

    static Update_Colors(general_chart, function_target, color) {

        general_chart.data.datasets.forEach(function (element) {
            if (element.label == function_target.text().trim()) {
                element.borderColor = color;
                element.backgroundColor = color;
                function_target.children('.album').css('color', color);
            }
        });

        general_chart.update();
    }

    static Update_Scale(chart, application, name_graphic, type, s) {
        var funct = '';

        if (type == 'Pairwise Sequentially Markovian Coalescent') {
            for (const element of application.psmc_collection) {
                if (element.name == name_graphic) {
                    funct = element.Clone();
                    application.Scale_Psmc_Function(funct, 1.25e-8, s);
                    break;
                }
            }
        }

        else {
            for (const element of application.msmc_collection) {
                if (element.name == name_graphic) {
                    funct = element;
                    application.Scale_Msmc_Function(funct);
                    break;
                }
            }
        }

        for (let index = 0; index < chart.data.datasets.length; index++) {
            const element = chart.data.datasets[index];

            if (element.label == funct.name) {
                chart.data.datasets[index].data = Application_Utilities.Generate_Data_To_Chart(funct.time, funct.IICR_2);
            }
        }

        chart.update();
    }

    static Get_Parametters(name, application) {
        for (var element of application.psmc_collection) {
            if (element.name == name) return [element.theta, element.rho, 'Pairwise Sequentially Markovian Coalescent'];
        }

        for (var element of application.msmc_collection) {
            if (element.name == name) return ['-', '-', 'Multiple Sequentially Markovian Coalescent'];
        }
    }

    static Change_Axis_Scale(chart, new_scale, axis) {

        if (axis == 'x') chart.options.scales.xAxes[0] = {
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

        else if (axis == 'y') chart.options.scales.yAxes[0] = {
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

        chart.update();
    }

}

module.exports = Visual_Utilities
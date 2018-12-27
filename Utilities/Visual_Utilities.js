'use strict'

const Application_Utilities = require('./Application_Utilities');

class Visual_Utilities {

    static Visualize_App(application, chart)
    {
        var graph = {'data':'', 'label':'','fill':'false', 'borderColor': 'white', 'backgroundColor': '', 'borderWidth': '1', 'steppedLine': 'true'}

        for (const element of application.psmc_collection) {
            var data = Application_Utilities.Generate_Data_To_Chart(element.time, element.IICR_2);
            
            graph.data = data;
            graph.label = element.name;
            chart.data.datasets.push(graph);

            
        }

console.log(chart.data.datasets)

        // chart.data.datasets=[];
        // application.psmc_collection.forEach(element => {
        //     chart.data.datasets.push(element.x_y);
        // });

        // application.msmc_collection.forEach(element => {
        //     chart.data.datasets.push(element.x_y);
        // });

        chart.update();
    }

    static Update_Colors(general_chart, function_target, color){

        general_chart.data.datasets.forEach(function(element) {
            if(element.label==function_target.text().trim()){
                element.borderColor=color;
                element.backgroundColor=color;
                function_target.children('.album').css('color', color);
            }
        });

        // for (let index = 0; index < time_chart.data.datasets[0].backgroundColor.length; index++) {
        //     time_chart.data.datasets[0].backgroundColor[index] = color;
        // }

        // for (let index = 0; index < IICR_chart.data.datasets[0].backgroundColor.length; index++) {
        //     IICR_chart.data.datasets[0].backgroundColor[index] = color;
        // }

        general_chart.update();
        // time_chart.update();
        // IICR_chart.update();
    }

    // static Show_Graph_Time_IICR(name_graph, collection, chart, axis)
    // {
    //     chart.data.labels=[];
    //     chart.data.datasets[0].data=[];
    //     chart.data.datasets[0].backgroundColor=[];
    //     for(var element of collection.datasets)
    //     {
    //         var count = 1;
    //         if(element.label == name_graph){
    //             for(var element2 of element.data)
    //             {
    //                 if(axis=='x'){
    //                     chart.data.labels.push('x'+count);
    //                     chart.data.datasets[0].data.push(element2.x);
    //                 }

    //                 else{
    //                     chart.data.labels.push('y'+count);
    //                     chart.data.datasets[0].data.push(element2.y);
    //                 }
              
    //                 chart.data.datasets[0].backgroundColor.push(element.backgroundColor);
    //                 count++;
    //             }
    //             break;
    //         }
    //     }
    //     chart.update();
    // }

    static getParametters(name, application)
    {
        for(var element of application.psmc_collection)
        {
            if(element.name==name) return [element.theta, element.rho, 'Pairwise Sequentially Markovian Coalescent'];
        }

        for(var element of application.msmc_collection)
        {
            if(element.name==name) return ['-', '-', 'Multiple Sequentially Markovian Coalescent'];
        }
    }


}

module.exports = Visual_Utilities
'use strict'

const Application_Utilities = require('./Application_Utilities');

class Visual_Utilities {

    static Visualize_App(application, chart)
    {
        for (const element of application.psmc_collection) {
                    
            var graph = {'data': Application_Utilities.Generate_Data_To_Chart(element.time, element.IICR_2), 'label':element.name,'fill':'false', 'borderColor': 'white', 'backgroundColor': '', 'borderWidth': '1', 'steppedLine': 'true'};
            
            if(!Application_Utilities.Contain_Graph(graph, chart)) chart.data.datasets.push(graph); 
            
        }

        for (const element of application.msmc_collection) {
                    
            var graph = {'data': Application_Utilities.Generate_Data_To_Chart(element.time, element.IICR_k), 'label':element.name,'fill':'false', 'borderColor': 'white', 'backgroundColor': '', 'borderWidth': '1', 'steppedLine': 'true'};
            
            if(!Application_Utilities.Contain_Graph(graph, chart)) chart.data.datasets.push(graph); 
            
        }

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

        general_chart.update();
    }


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
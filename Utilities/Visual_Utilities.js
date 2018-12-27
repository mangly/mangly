'use strict'

const Application_Utilities = require('./Application_Utilities');

class Visual_Utilities {

    static Get_Random_Color()
    {
        var color = Math.floor(Math.random() * Math.pow(256, 3)).toString(16);

        while (color.length < 6) {
            color = "0" + color;
        }

        return "#" + color;
    }

    static Visualize_App(application, chart)
    {
        for (const element of application.psmc_collection) {

            var color = this.Get_Random_Color();     
            var graph = {'data': Application_Utilities.Generate_Data_To_Chart(element.time, element.IICR_2), 'label':element.name,'fill':'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': '3', 'steppedLine': 'true'};
            
            if(!Application_Utilities.Contain_Graph(graph, chart)) chart.data.datasets.push(graph); 
            
        }

        for (const element of application.msmc_collection) {

            var color =  this.Get_Random_Color();       
            var graph = {'data': Application_Utilities.Generate_Data_To_Chart(element.time, element.IICR_k), 'label':element.name,'fill':'false', 'borderColor': color, 'backgroundColor': color, 'borderWidth': '2', 'steppedLine': 'true'};
            
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


    static Get_Parametters(name, application)
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
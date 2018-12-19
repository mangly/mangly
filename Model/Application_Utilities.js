'use strict'

class Application_Utilities {

    static Contain(element_name, app_collection){
        for (let index = 0; index < app_collection.length; index++) {
            const element = app_collection[index];

            if(element.name && (element.name==element_name)) return true;
        }

        return false;
    }

    static Visualize_App(application, chart)
    {
        chart.data.datasets=[];
        application.psmc_collection.forEach(element => {
            chart.data.datasets.push(element.x_y);
        });

        application.msmc_collection.forEach(element => {
            chart.data.datasets.push(element.x_y);
        });

        chart.update();
    }

    static Update_Colors(general_chart, time_chart, IICR_chart, function_target, color){

        general_chart.data.datasets.forEach(function(element) {
            if(element.label==function_target.text().trim()){
                element.borderColor=color;
                element.backgroundColor=color;
                function_target.children('.album').css('color', color);
            }
        });

        for (let index = 0; index < time_chart.data.datasets[0].backgroundColor.length; index++) {
            time_chart.data.datasets[0].backgroundColor[index] = color;
        }

        for (let index = 0; index < IICR_chart.data.datasets[0].backgroundColor.length; index++) {
            IICR_chart.data.datasets[0].backgroundColor[index] = color;
        }

        general_chart.update();
        time_chart.update();
        IICR_chart.update();
    }

    static Show_time(name_graph, collection, chart, axis)
    {
        chart.data.labels=[];
        chart.data.datasets[0].data=[];
        chart.data.datasets[0].backgroundColor=[];
        for(var element of collection.datasets)
        {
            var count = 1;
            if(element.label == name_graph){
                for(var element2 of element.data)
                {
                    if(axis=='x'){
                        chart.data.labels.push('x'+count);
                        chart.data.datasets[0].data.push(element2.x);
                    }

                    else{
                        chart.data.labels.push('y'+count);
                        chart.data.datasets[0].data.push(element2.y);
                    }
              
                    chart.data.datasets[0].backgroundColor.push(element.backgroundColor);
                    count++;
                }
                break;
            }
        }
        chart.update();
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

module.exports = Application_Utilities
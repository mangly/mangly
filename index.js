const remote = require('electron').remote

const main = remote.require('./main.js')

const {dialog} = require('electron').remote;

var application = require('./controller.js')


//start -functions of JavaScript-


// function plot(data, chart)
// {

// let options = {
//   mode: 'text',
//   args: ['hector']
// };

// ps.PythonShell.run('get_Psmc_Results.py', options, function (err, results) {
//   if (err) throw err;

//   else{
//     var json = JSON.parse(results)
//     data.data.datasets.push(json)
//     chart.update() 
//   }
// });
// }

//end -functions of JavaScript-


$(document).ready(function () {

    var ctx = document.getElementById("mycanvas").getContext('2d');

    var data = {
        type: 'line',
        data: {
            datasets:[],
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'logarithmic',
                    //position: 'bottom',
                    //                 ticks: {
                    //     suggestedMin: 5,
                    //     suggestedMax: 0.2
                    // }
                }],

                yAxes: [{
                    type: 'logarithmic',
                    //position: 'bottom',
                    //                 ticks: {
                    //     suggestedMin: 5,
                    //     suggestedMax: 0.2
                    // }
                }],
            },

                    elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            },
            
            legend: {
                usePointStyle:true,

                display: true,
                labels: {
                  fontColor: 'rgb(255, 99, 132)'
                },
                position: 'right'
                },

                title: {
                    display: true,
                    text: 'Título del gráfico'
                  }
        },
    }

    var myChart = new Chart(ctx, data)
    
    //plot(data, myChart)

    var app = new application.Application();

    app.Add_Psmc_Data('','get_Psmc_Results.py', function(){
        app.Plot(data, myChart);
    });
})
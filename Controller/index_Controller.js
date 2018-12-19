'use strict'
// const electron = require('electron').remote

//const remote = require('electron').remote

//const main = remote.require('./main.js')
const {dialog} = require('electron').remote;

//import Application from '../Model/Application';

var Application = require('../Model/Application');
var Application_Utilities =require('../Model/Application_Utilities');


$(document).ready(function () {
    // Instance of Application
    var application = new Application();


    //Data of PSMC's and MSMC's functions
    var myChart = new Chart(document.getElementById("mycanvas"), {
        type: 'line',
        data: {
            datasets:[],
        },
        scaleFontColor:'red',
        options: {            
            tooltips:{
                enabled:false
            },
            hover:{
                mode:null
            },
            animation:{
                duration:100
            },
            scales: {
                xAxes: [{
                    ticks:{
                        fontColor:"white"
                    },
                    type: 'logarithmic',
                    gridLines:{
                        display:false,
                        color:"white"
                    },
                   
                    scaleLabel: {
                        display: true,
                        labelString: 'Years',
                        fontColor: 'white'
                    }
                }],

                yAxes: [{
                    ticks:{
                        fontColor:"white"
                    },
                    type: 'logarithmic',
                    gridLines:{
                        display:false,
                        color:"white"
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

                point:{
                    radius:0,
                }
            },
            
            legend: {
                display: true,
                labels: {
                  usePointStyle:true,
                  fontColor: 'white',
                  fill: true,
                  boxWidth: 10,
                },
                position: 'bottom'
                },

                title: {
                    display: true,
                    text: 'Título del gráfico',
                    fontColor:'white',
                    fontFamily:'Nunito,sans-serif'
                  }
        },
    });

    var time = new Chart(document.getElementById("mycanvas2"), {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: [],
              data: []
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
    });

    var IICR = new Chart(document.getElementById("mycanvas3"), {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: [],
              data: []
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
    });

    var edit_collection_control = [];
    $('#open_file').on('click', function () {
        
        var options = {
            filters:[
                {name:'PSMC', extensions:['psmc']}
            ],

            properties: ['multiSelections'],
        }


       // Open a File or Files selected for user
        dialog.showOpenDialog(options, function (arrPath) {
            application.Add_File(arrPath, function(){
                Application_Utilities.Visualize_App(application, myChart);
                
                myChart.data.datasets.forEach(function(element){
                   if(!edit_collection_control.includes(element.label)){
                        $('#nameGraph').append('<li class="@@carouselactive"><a href="#" class="item_Color pl-4"><i class="zmdi zmdi-album pr-4 album" style="color:'+element.backgroundColor+'"></i>'+element.label+'</a></li>'); 
                        edit_collection_control.push(element.label);
                        $('#nameGraph').removeAttr('hidden');
                   }
                })
            })
        })
    })

    var itemTarget='';
    $('#nameGraph').on('click', function(){
        if ($(event.target).is('.item_Color'))
        {
                var list = $('.item_Color')
                list.css('background-color','black');
                list.css('color','white');

                //For select the graphics
                $(event.target).css('background-color', '#ffffff');
                $(event.target).css('color', 'black');

                //Element clicked
                itemTarget= $(event.target);

                Application_Utilities.Show_time(itemTarget.text(), myChart.data, time, 'x');
                Application_Utilities.Show_time(itemTarget.text(), myChart.data, IICR, 'y');

                $('#graphic').html(itemTarget.text());

                var parametters = Application_Utilities.getParametters(itemTarget.text(), application);
                if(parametters.length!=1){
                    $('#theta').html(parametters[0]);
                    $('#rho').html(parametters[1]);
                    $('#model').html(parametters[2]);
                }

                else $('#model').html(parametters[0]);
        }
    })

    $(".colorpicker-element").on("change", function () {
        var color = $(this).val();
        Application_Utilities.Update_Colors(myChart,time,IICR, itemTarget,color);
      });

      $('#edit').on('click', function(){
            itemTarget.parent().html('<input type="text" class="form-control" placeholder="">')
      });
})
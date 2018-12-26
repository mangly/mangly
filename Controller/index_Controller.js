'use strict'
// const electron = require('electron').remote

//const remote = require('electron').remote

//const main = remote.require('./main.js')
const {dialog} = require('electron').remote;

//import Application from '../Model/Application';

var Application = require('../Model/Application');
var Visual_Utilities =require('../Utilities/Visual_Utilities');


$(document).ready(function () {
    // Instance of Application
    var application = new Application();


    //Data for all functions
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
                    text: 'Graph of models',
                    fontColor:'white',
                    fontFamily:'Nunito,sans-serif'
                  }
        },
    });

    // var time = new Chart(document.getElementById("mycanvas2"), {
    //     type: 'bar',
    //     data: {
    //       labels: [],
    //       datasets: [
    //         {
    //           label: "Population (millions)",
    //           backgroundColor: [],
    //           data: []
    //         }
    //       ]
    //     },
    //     options: {
    //       legend: { display: false },
    //       title: {
    //         display: true,
    //         text: 'Predicted world population (millions) in 2050'
    //       }
    //     }
    // });

    // var IICR = new Chart(document.getElementById("mycanvas3"), {
    //     type: 'bar',
    //     data: {
    //       labels: [],
    //       datasets: [
    //         {
    //           label: "Population (millions)",
    //           backgroundColor: [],
    //           data: []
    //         }
    //       ]
    //     },
    //     options: {
    //       legend: { display: false },
    //       title: {
    //         display: true,
    //         text: 'Predicted world population (millions) in 2050'
    //       }
    //     }
    // });

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
                Visual_Utilities.Visualize_App(application, myChart);
                
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
            //Element clicked
            itemTarget= $(event.target);

            var list = $('.item_Color')
            list.css('background-color','black');
            list.css('color','white');

            //For select the graphics
            itemTarget.css('background-color', '#ffffff');
            itemTarget.css('color', 'black');

            // Visual_Utilities.Show_Graph_Time_IICR(itemTarget.text(), myChart.data, time, 'x');
            // Visual_Utilities.Show_Graph_Time_IICR(itemTarget.text(), myChart.data, IICR, 'y');

            $('#graphic').html(itemTarget.text());

            var parametters = Visual_Utilities.getParametters(itemTarget.text(), application);

            if(parametters.length!=1){
                $('#theta').html(parametters[0]);
                $('#rho').html(parametters[1]);
                $('#model').html(parametters[2]);
            }

            else $('#model').html(parametters[0]);
        }
    })

    $('#nameGraph').on('focusout', function(){
        if($(event.target).is('.edit-text'))
        {
            //console.log(itemTarget.parent())
            $(event.target).parent().html('<a href="#" class="item_Color pl-4"><i class="zmdi zmdi-album pr-4 album" style="color:'+itemTarget.children('i')[0].style.color+'"></i>'+$(event.target)[0].value+'</a>')
        }
    });

    $(".colorpicker-element").on("change", function () {
        var color = $(this).val();
        Visual_Utilities.Update_Colors(myChart, itemTarget, color);
      });

      $('#edit').on('click', function(){
        //console.log(itemTarget.parent())
            itemTarget.parent().html('<input type="text" class="form-control edit-text" placeholder="">')
      });
})
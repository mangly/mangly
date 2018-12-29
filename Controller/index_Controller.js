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
                    type: 'logarithmic',

                    ticks:{
                        fontColor:"white"
                    },
                    
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
                    type: 'linear',

                    ticks:{
                        fontColor:"white"
                    },
                    
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
                    text: '',
                    fontColor:'white',
                    fontFamily:'Nunito,sans-serif'
                  }
        },
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
                application.Scale_Psmc_Graph();
                application.Scale_Msmc_Graph();
                Visual_Utilities.Visualize_App(application, myChart);
                
                myChart.data.datasets.forEach(function(element){
                   if(!edit_collection_control.includes(element.label)){
                        $('#list-graphics').append('<li class="@@carouselactive"><a href="#" class="graph"><i class="zmdi zmdi-album pr-4 album" style="color:'+element.backgroundColor+'"></i>'+element.label+'</a></li>'); 
                        edit_collection_control.push(element.label);
                        // $('#list-graphics').removeAttr('hidden');
                   }
                })
            })
        })
    })

    var itemTarget='';
    $('#list-graphics').on('click', function(){
        if ($(event.target).is('.graph'))
        {      
            //Element clicked
            itemTarget= $(event.target);

            var list = $('.graph')
            list.css('background-color','black');
            list.css('color','white');

            //For select the graph
            itemTarget.css('background-color', '#ffffff');
            itemTarget.css('color', 'black');
            $('#change-color').removeAttr('disabled');


            $('#graphic').html(itemTarget.text());

            var parametters = Visual_Utilities.Get_Parametters(itemTarget.text(), application);

            if(parametters.length!=1){
                $('#theta').html(parametters[0]);
                $('#rho').html(parametters[1]);
                $('#model').html(parametters[2]);
            }

            else $('#model').html(parametters[0]);
        }
    })

    $('#list-graphics').on('focusout', function(){
        if($(event.target).is('.edit-text'))
        {
            //console.log(itemTarget.parent())
            $(event.target).parent().html('<a href="#" class="graph pl-4"><i class="zmdi zmdi-album pr-4 album" style="color:'+itemTarget.children('i')[0].style.color+'"></i>'+$(event.target)[0].value+'</a>')
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

      $('#scaleX').on('change', function () {
        Visual_Utilities.Change_Axis_Scale(myChart, $(this).val().toLowerCase(), 'x');
        console.log('x es ' +myChart.options.scales.xAxes[0].type);
        // console.log(myChart.options.scales.xAxes[0].type)
        //  console.log('ok'); 
        //  console.log($(this).val().toLowerCase())
      });

      $('#scaleY').on('change', function () {
        Visual_Utilities.Change_Axis_Scale(myChart, $(this).val().toLowerCase(), 'y');
        console.log(myChart.options.scales.yAxes[0].type);
        // console.log(myChart.options.scales.xAxes[0].type)
        //  console.log('ok'); 
        //  console.log($(this).val().toLowerCase())
      });
})
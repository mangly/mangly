'use strict'
// const electron = require('electron').remote

//const remote = require('electron').remote

//const main = remote.require('./main.js')
const { dialog } = require('electron').remote;

//import Application from '../Model/Application';

var Application = require('../Model/Application');
var Visual_Utilities = require('../Utilities/Visual_Utilities');
var Application_Utilities = require('../Utilities/Application_Utilities');

$(document).ready(function () {
    $('#psmc-msmc-options *').attr('disabled', 'disabled');

    // Instance of Application
    var application = new Application();


    //Data for all functions
    var myChart = new Chart(document.getElementById("mycanvas"), {
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

    var edit_collection_control = [];
    $('#open_file').on('click', function () {

        var options = {
            filters: [
                { name: 'PSMC', extensions: ['psmc', 'txt', 'msmc'] }
            ],

            properties: ['multiSelections'],
        }


        // Open a File or Files selected for user
        dialog.showOpenDialog(options, function (arrPath) {
            application.Add_File(arrPath, function () {

                Visual_Utilities.Visualize_App(application, myChart);

                myChart.data.datasets.forEach(function (element) {
                    if (!edit_collection_control.includes(element.label)) {
                        $('#list-graphics').append('<li class="@@carouselactive"><a href="#" class="graph"><i class="zmdi zmdi-album pr-4 album" style="color:' + element.backgroundColor + '"></i>' + element.label + '</a></li>');
                        edit_collection_control.push(element.label);
                        // $('#list-graphics').removeAttr('hidden');
                    }
                })
            })
        })
    })

    var itemTarget = '';
    $('#list-graphics').on('click', function () {
        if ($(event.target).is('.graph')) {
            //Element clicked
            itemTarget = $(event.target);

            var list = $('.graph')
            list.css('background-color', 'black');
            list.css('color', 'white');

            //For select the graph
            itemTarget.css('background-color', '#ffffff');
            itemTarget.css('color', 'black');
            $('#psmc-msmc-options *').removeAttr('disabled');


            $('#graphic').html(itemTarget.text());

            var parametters = Visual_Utilities.Get_Parametters(itemTarget.text(), application);

            $('#theta').html(parametters[0]);
            $('#rho').html(parametters[1]);
            $('#model').html(parametters[2]);
        }
    })

    // $('#list-graphics').on('focusout', function () {
    //     if ($(event.target).is('.edit-text')) {
    //         $(event.target).parent().html('<a href="#" class="graph pl-4"><i class="zmdi zmdi-album pr-4 album" style="color:' + itemTarget.children('i')[0].style.color + '"></i>' + $(event.target)[0].value + '</a>')
    //     }
    // });

    $(".colorpicker-element").on("change", function () {
        var color = $(this).val();
        Visual_Utilities.Update_Colors(myChart, itemTarget, color);
    });

    $('#edit').on('click', function () {
        itemTarget.parent().html('<input type="text" class="form-control edit-text" placeholder="">')
    });

    $('#scaleX').on('change', function () {
        Visual_Utilities.Change_Axis_Scale(myChart, $(this).val().toLowerCase(), 'x');
    });

    $('#scaleY').on('change', function () {
        Visual_Utilities.Change_Axis_Scale(myChart, $(this).val().toLowerCase(), 'y');
    });

    $('#psmc-msmc-options').on('click', function () {
        if ($('#psmc-msmc-options *').attr('disabled') == 'disabled') $('#modal-default').modal('show');
    });

    var expand_file = false;

    $('#modal-default').on('hidden.bs.modal', function () {
        $('#open-menu').trigger('click');

        if (!expand_file) {
            $('#expand-file').trigger('click');
            expand_file = true;
        }
    });

    var slider_mu = document.getElementById("slider-mu");

    noUiSlider.create(slider_mu, {
        start: [1.25],
        connect: "lower",
        range: { min: 1, max: 3 },

        format: wNumb({
            decimals: 10,
            // postfix:'e-8',

            encoder: function (a) {
                return a * 1e-8;
            }
        })
    })

    slider_mu.noUiSlider.on("update", function (a, b) {
        document.getElementById("input-slider-value-mu").value = a[b];
    });

    $('#input-slider-value-mu').val(Application_Utilities.Convert_Decimal_Scientific_Notation($('#input-slider-value-mu').val()))
    slider_mu.noUiSlider.on('slide', function () {
        Visual_Utilities.Update_Scale(myChart, application, itemTarget.text(), $('#model').html(), $('#input-slider-value-mu').val());
        $('#input-slider-value-mu').val(Application_Utilities.Convert_Decimal_Scientific_Notation($('#input-slider-value-mu').val()))
    })

    var slider_s = document.getElementById("slider-s");

    noUiSlider.create(slider_s, {
        start: [100],
        connect: "lower",
        range: { min: 1, max: 1000 },

        format: wNumb({
            decimals: 0,
        })
    })

    slider_s.noUiSlider.on("update", function (a, b) {
        document.getElementById("input-slider-value-s").value = a[b];
    });

    slider_s.noUiSlider.on('slide', function () {
        Visual_Utilities.Update_Scale(myChart, application, itemTarget.text(), $('#model').html(), $('#input-slider-value-mu').val(), $('#input-slider-value-s').val());
    })
})
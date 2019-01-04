'use strict'
// const electron = require('electron').remote

//const remote = require('electron').remote

//const main = remote.require('./main.js')
const { dialog } = require('electron').remote;

//import Application from '../Model/Application';

var Application = require('../Model/Logic_Application');
var Application_Utilities = require('../Utilities/Application_Utilities');
var Visual_Application = require('../GUI/Visual_Application')

$(document).ready(function () {
    $('#options-color-edit-remove *').attr('disabled', 'disabled');
    $('#options-scale-axis *').attr('disabled', 'disabled');
    $('#option-mu *').attr('disabled', 'disabled');
    $('#option-s *').attr('disabled', 'disabled');


    // Instance Visual Application

    var application = new Visual_Application($('#mycanvas'), new Application());

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
            application.application.Add_File(arrPath, function () {

                application.Visualize();

                application.chart.data.datasets.forEach(function (element) {
                    if (!edit_collection_control.includes(element.label)) {
                        $('#list-graphics').append('<li class="@@carouselactive"><a href="#" class="graph"><i class="zmdi zmdi-album pr-4 album" style="color:' + element.backgroundColor + '"></i>' + element.label + '</a></li>');
                        edit_collection_control.push(element.label);
                        // $('#list-graphics').removeAttr('hidden');
                    }
                })

                $('#options-scale-axis *').removeAttr('disabled');
            })
        })
    })

    var itemTarget;
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

            $('#options-color-edit-remove *').removeAttr('disabled');
            $('#option-mu *').removeAttr('disabled');

            var graphic = application.Contain(itemTarget.text());
            if (application.Get_Parametters(itemTarget.text())[2] == 'Pairwise Sequentially Markovian Coalescent') {
                $('#option-s *').removeAttr('disabled');

                slider_s.noUiSlider.set(graphic.S);
                slider_mu.noUiSlider.set(graphic.Mu);
            }

            else {
                $('#option-s *').attr('disabled', 'disabled');
                slider_s.noUiSlider.set(100);
                slider_mu.noUiSlider.set(graphic.Mu);
            }

            application.Visualize_Information_Of_Functions(itemTarget.text(), $('#graphic'), $('#theta'), $('#rho'), $('#model'));
        }
    })

    $(".colorpicker-element").on("change", function () {
        var color = $(this).val();
        application.Update_Colors(itemTarget, color);
    });

    $('#edit').on('click', function () {
        itemTarget.parent().html('<input type="text" class="form-control edit-text" placeholder="">')
    });

    $('#scaleX').on('change', function () {
        application.Change_Axis_Scale($(this).val().toLowerCase(), 'x');
    });

    $('#scaleY').on('change', function () {
        application.Change_Axis_Scale($(this).val().toLowerCase(), 'y');
    });

    $('#options').on('click', function () {
        if ($('#options-scale-axis *').attr('disabled') == 'disabled') $('#modal-default').modal('show');

        else if (!$(event.target).is('#options-scale-axis *')) if (!itemTarget) $('#modal-default').modal('show');
        // if (!$(event.target).is('#options-scale-axis *') && $('#options #option-mu *').attr('disabled') == 'disabled') $('#modal-default').modal('show');
    });

    var expand_file = false;

    $('#modal-default').on('hidden.bs.modal', function () {
        $('#open-menu').trigger('click');

        if (!expand_file) {
            $('#expand-file').trigger('click');
            expand_file = true;
        }
    });


    // Sliders configurations
    var slider_mu = document.getElementById("slider-mu");

    noUiSlider.create(slider_mu, {
        start: [1.25],
        connect: "lower",
        range: { min: 1, max: 3 },

        format: wNumb({
            decimals: 10,

            encoder: function (a) {
                return a * 1e-8;
            }
        })
    })

    if ($('#option-mu *').attr('disabled') == 'disabled') {
        slider_mu.noUiSlider.on("update", function (a, b) {
            $('#input-slider-value-mu').val(Application_Utilities.Convert_Decimal_Scientific_Notation(a[b]));
        });
    }

    slider_mu.noUiSlider.on('slide', function (a, b) {
        application.Update_Scale(itemTarget.text(), $('#model').html(), a[b], $('#input-slider-value-s').val());
        $('#input-slider-value-mu').val(Application_Utilities.Convert_Decimal_Scientific_Notation(a[b]));
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

    if ($('#options #option-s *').attr('disabled') == 'disabled') {
        slider_s.noUiSlider.on("update", function (a, b) {
            document.getElementById("input-slider-value-s").value = a[b];
        });
    }

    slider_s.noUiSlider.on('slide', function (a, b) {
        application.Update_Scale(itemTarget.text(), $('#model').html(), $('#input-slider-value-mu').val(), a[b]);
    })

    $('#test').on('click', function () {
        application.application.Get_NSSC_Vectors(function () {
            application.Visualize_NSSC();
            console.log('done!!!!!!!')
        });
    });

})
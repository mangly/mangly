const electron = require('electron');
const ipc = electron.ipcRenderer;
var Visual_Application = require('../GUI/Visual_Application');

var matrix_collection = [];
var number_of_loci;
var sampling_vector;
var order;

$(document).ready(function () {
  ipc.on('parametters-nssc', function (event, arg) {
    number_of_loci = arg.number_of_loci;
    sampling_vector = arg.sampling_vector;
    order = arg.order;

    for (let index = 0; index < arg.number_of_matrix; index++) {
      Visual_Application.Add_Matrix(order, matrix_collection)
    }
     
  })

  $('#add-matrix').on('click', function () {
      Visual_Application.Add_Matrix(order, matrix_collection);
  })

  $('#increment-order').on('click', function () {
    for (const matrix of matrix_collection) {
      matrix.jexcel('insertColumn');
      matrix.jexcel('insertRow');
    }

    order++;

    for (const matrix of matrix_collection) {
      for (let index = 0; index < order; index++) {
        matrix.jexcel('setHeader', index, (index + 1).toString());
      }
    }
  })

  $('#ok').on('click', function () {
    var scenario = [];

    for (let index = 0; index < matrix_collection.length; index++) {
      var content_of_scenario = { "time": 0, "demeSizes": [], "migMatrix": [] };
      const matrix = matrix_collection[index];

      var time_of_change = parseFloat($('#time' + index).val());
      var deme_sizes_text = $('#deme' + index).val();


      content_of_scenario.migMatrix = matrix.jexcel('getData', false);
      content_of_scenario.time = time_of_change;

      var list = deme_sizes_text.split(' ')
      var deme_sizes = [];

      for (const element of list) {
        deme_sizes.push(parseFloat(element))
      }

      content_of_scenario.demeSizes = deme_sizes;

      scenario.push(content_of_scenario);
    }


    var json_result = { "nbLoci": number_of_loci, "samplingVector": sampling_vector, "scenario": scenario };


    // console.log(json_result);
    ipc.send('nssc-json-result', json_result);
  });
});

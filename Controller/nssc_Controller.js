const electron = require('electron');
const ipc = electron.ipcRenderer;
// var fs = require('fs');
var Visual_Application = require('../GUI/Visual_Application');

var matrix_collection = [];
var deme_vector_collection = [];
var sampling_vector;
var order;

$(document).ready(function () {
  ipc.on('parametters-nssc', function (event, arg) {
    sampling_vector = arg.sampling_vector;
    order = arg.order;

    for (let index = 0; index < arg.number_of_matrix; index++) {
      if (index == 0) {
        var html_time_dime_sizes = '<span>Deme Sizes:</span><div class="matrix 1xn" style="padding:20px 0 40px 0 0" id="deme' + index + '"></div>';
        Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');
      }

      else {
        var html_time_dime_sizes = '<div class="row"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time' + index + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><span>Deme Sizes:</span><div class="matrix 1xn" style="padding:20px 0 40px 0 0" id="deme' + index + '"></div>';
        Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');
      }

      var html_matrix = '<div class="matrix" style="padding:20px 0 40px 0" id="matrix' + index + '"></div>';
      Visual_Application.Add_Matrix(html_matrix, order, matrix_collection, '#matrix', false);
    }
  })

  $('#add-matrix').on('click', function () {
    var html_time_dime_sizes = '<div class="row"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time' + matrix_collection.length + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><span>Deme Sizes:</span><div class="matrix 1xn" style="padding:20px 0 40px 0 0" id="deme' + matrix_collection.length + '"></div>';
    Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');

    var html = '<div class="matrix" style="padding:20px 0 40px 0" id="matrix' + matrix_collection.length + '"></div>';
    Visual_Application.Add_Matrix(html, order, matrix_collection, '#matrix', false);
  })

  // $('#increment-order').on('click', function () {
  //   for (const deme of deme_vector_collection) {
  //     deme.jexcel('insertColumn');
  //   }

  //   for (const matrix of matrix_collection) {
  //     matrix.jexcel('insertColumn');
  //     matrix.jexcel('insertRow');
      
  //     for (let index = 0; index < order + 1; index++) {
  //       matrix.jexcel('setHeader', index, (index + 1).toString());
  //     }
  //   }

  //   $('.1xn td.jexcel_label').text('Values:');

  //   order++;

  // })

  $('#ok').on('click', function () {
    var scenario = [];
    var time_of_change = 0;

    for (let index = 0; index < matrix_collection.length; index++) {
      var content_of_scenario = { "time": 0, "demeSizes": [], "migMatrix": [] };
      const matrix = matrix_collection[index];
      const deme_sizes = deme_vector_collection[index];

      if (index != 0) time_of_change = parseFloat($('#time' + index).val());

      content_of_scenario.migMatrix = matrix.jexcel('getData', false);
      content_of_scenario.time = time_of_change;

      content_of_scenario.demeSizes = deme_sizes.jexcel('getRowData', 0);

      scenario.push(content_of_scenario);
    }

    var json_result = { "samplingVector": sampling_vector, "scenario": scenario };

    ipc.send('nssc-json-result', json_result);
  });
});

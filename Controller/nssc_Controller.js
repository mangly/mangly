const electron = require('electron');
const { dialog } = require('electron').remote;
const ipc = electron.ipcRenderer;

var Visual_Application = require('../GUI/Visual_Application');
var Application = require('../Model/Logic_Application');

var nssc_scenario;
var matrix_collection = [];
var deme_vector_collection = [];
var sampling_vector;
var order;
var name;

$(document).ready(function () {
  ipc.on('parametters-nssc', function (event, arg) {
    nssc_scenario = arg.nssc_scenario;
    name = arg.name;
    sampling_vector = $('#sampling-vector');
    order = arg.order;

    Visual_Application.Initialize_Matrix(sampling_vector, Visual_Application.Fill_Initial_Data_Vector(0, 'sampling_vector', order - 1));

    for (let index = 0; index < arg.number_of_matrix; index++) {
      if (index == 0) {
        var html_time_dime_sizes = '<div class="row pt-4"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time0" value="0" disabled type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-10"><span>Deme Sizes:</span><div class="matrix 1xn" id="deme' + index + '"></div>';
        Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');
      }

      else {
        var html_time_dime_sizes = '<div class="row pt-4"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time' + index + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-10"><span>Deme Sizes:</span><div class="matrix 1xn" id="deme' + index + '"></div>';
        Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');
      }

      var html_matrix = '<div class="matrix" id="matrix' + index + '"></div>';
      Visual_Application.Add_Matrix(html_matrix, order, matrix_collection, '#matrix', false);
    }

    if (nssc_scenario) {
      Application.Load_Scenario(nssc_scenario, sampling_vector, matrix_collection, deme_vector_collection);
      Visual_Application.Configuration_Vector();
    };
  });

  $('#add-matrix').on('click', function () {
    var html_time_dime_sizes = '<div class="row pt-4"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time' + matrix_collection.length + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-10"><span>Deme Sizes:</span><div class="matrix 1xn" style="padding:20px 0 40px 0 0" id="deme' + matrix_collection.length + '"></div>';
    Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');

    var html = '<div class="matrix" id="matrix' + matrix_collection.length + '"></div>';
    Visual_Application.Add_Matrix(html, order, matrix_collection, '#matrix', false);
  });

  $('#ok').on('click', function () {
    ipc.send('nssc-json-result', Application.Build_Scenario_NSSC(name, matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0)));
  });

  $('#save-scenario').on('click', function () {
    var json_result = Application.Build_Scenario_NSSC(name, matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0));
    var json_save = JSON.stringify(json_result);

    var options = {
      title: 'Save...',
      defaultPath: json_result.name,

      filters: [
        { name: 'SNSSC', extensions: ['snssc'] }
      ],
    }

    dialog.showSaveDialog(options, function (filename) {
      Application.Save_File(filename, json_save);
    });
  });
});

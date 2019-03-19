const electron = require('electron');
const { dialog } = require('electron').remote;
const ipc = electron.ipcRenderer;

var Visual_Application = require('../GUI/Visual_Application');
var Application = require('../Model/Logic_Application');

var matrix_collection = [];
var deme_vector_collection = [];
var sampling_vector;
var order;
var name;
var type;
var number_of_events;

$(document).ready(function () {
  ipc.on('parametters-nssc', function (event, arg) {
    name = arg.name;
    sampling_vector = $('#sampling-vector');
    order = arg.order;
    type = arg.type;
    number_of_events = arg.number_of_events;

    Visual_Application.Build_Visual_Scenario(2, arg.nssc_scenario, matrix_collection, deme_vector_collection, sampling_vector, order, type, number_of_events);
  });

  $('#add-matrix').on('click', function () {
    var index = matrix_collection.length;
    var html_time_dime_sizes = '<li id = "scen' + index + '"><div class="row pt-4"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time' + matrix_collection.length + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-10"><span>Deme Sizes:</span><div class="matrix 1xn" style="padding:20px 0 40px 0 0" id="deme' + matrix_collection.length + '"></div>';
    Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');

    var html = '<div class="matrix" id="matrix' + index + '"></div>';
    Visual_Application.Add_Matrix(html, $('#scen' + index), order, matrix_collection, '#matrix', false);

    if ($('#switch-selection-pagination').prop('checked')) {
      $("div.holder").jPages("destroy");
      $("div.holder").jPages({
        containerID: "list-scenario",
        perPage: 1
      });
    }
  });

  $('#switch-selection-pagination').on('change', function () {
    /* initiate plugin */
    if ($(this).prop('checked')) {
      $("div.holder").jPages({
        containerID: "list-scenario",
        perPage: 1
      });
    }

    else $("div.holder").jPages("destroy");
  });

  $('#ok').on('click', function () {
    if (type == 'General') ipc.send('nssc-json-result', Application.Build_General_Scenario_NSSC(matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0)));
    else if (type == 'Symmetrical') ipc.send('nssc-json-result', Application.Build_Symmetrical_Scenario_NSSC(order, sampling_vector.jexcel('getRowData', 0), number_of_events + 1));
  });

  $('#save-scenario').on('click', function () {
    var json_result;

    if (type == 'General') json_result = Application.Build_General_Scenario_NSSC(matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0));
    else json_result = Application.Build_Symmetrical_Scenario_NSSC(order, sampling_vector.jexcel('getRowData', 0), number_of_events + 1)

    var json_save = JSON.stringify(json_result);

    var options = {
      title: 'Save...',
      defaultPath: name,

      filters: [
        { name: 'SNSSC', extensions: ['snssc'] }
      ],
    }

    dialog.showSaveDialog(options, function (filename) {
      Application.Save_File(filename, json_save);
    });
  });

  $('#add-deme').on('click', function () {



    sampling_vector.jexcel('insertColumn', 1);
    for (let index = 0; index < deme_vector_collection.length; index++) {
      const deme = deme_vector_collection[index];

      deme.jexcel('insertColumn', 1);
    }

    for (let index = 0; index < matrix_collection.length; index++) {
      const matrix = matrix_collection[index];
      matrix.jexcel('insertColumn');
      matrix.jexcel('insertRow');

      for (let index = 0; index < order + 1; index++) {
        matrix.jexcel('setHeader', index, (index + 1).toString());
      }
    }

    $('.1xn td.jexcel_label').text('Values:');

    order++;
  })

  $('#remove-deme').on('click', function () {
    sampling_vector.jexcel('deleteColumn', order - 1);
    for (let index = 0; index < deme_vector_collection.length; index++) {
      const deme = deme_vector_collection[index];
      deme.jexcel('deleteColumn', order - 1);
    }
    // for (const deme of deme_vector_collection) {
    //   deme.jexcel('insertColumn');
    // }

    for (let index = 0; index < matrix_collection.length; index++) {
      const matrix = matrix_collection[index];

      matrix.jexcel('deleteColumn', order - 1);
      matrix.jexcel('deleteRow');

      for (let index = 0; index < order + 1; index++) {
        matrix.jexcel('setHeader', index, (index + 1).toString());
      }
    }

    $('.1xn td.jexcel_label').text('Values:');

    order--;
  })
});

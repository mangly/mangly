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
var type;
var number_of_events;

$(document).ready(function () {
  ipc.on('parametters-nssc', function (event, arg) {
    nssc_scenario = arg.nssc_scenario;
    name = arg.name;
    sampling_vector = $('#sampling-vector');
    order = arg.order;
    type = arg.type;
    number_of_events = arg.number_of_events;

    Visual_Application.Initialize_Matrix(sampling_vector, Visual_Application.Fill_Initial_Data_Vector(0, 'sampling_vector', order - 1));

    for (let index = 0; index < number_of_events + 1; index++) {
      if (type == 'General') {
        if (index == 0) {
          var html_time_dime_sizes = '<li id = "scen' + index + '"><div class="row pt-4"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time0" value="0" disabled type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-10"><span>Deme Sizes:</span><div class="matrix 1xn" id="deme0"></div>';
          Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');
        }

        else {
          var html_time_dime_sizes = '<li id = "scen' + index + '"><div class="row pt-4"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time' + index + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-10"><span>Deme Sizes:</span><div class="matrix 1xn" id="deme' + index + '"></div>';
          Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');
        }

        var html_matrix = '<div class="matrix" id="matrix' + index + '"></div>';
        Visual_Application.Add_Matrix(html_matrix, $('#scen' + index), order, matrix_collection, '#matrix', false);
      }

      else if (type == 'Symmetrical') {
        $('#matrix-collection').attr("style", "overflow-x: none");
        var html;
        if (index == 0) {
          html = '<li class="pt-4"><div class="row"><div class="col-sm-4"><div class="form-group"><span>Time of change:</span><input id="time0" value="0" disabled type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>M:</span><input id="M0" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>c:</span><input id="c0" class="form-control input-mask"><i class="form-group__bar"></i></div></div></div></li>';
          $('#matrix-collection>ul').append(html);
        }

        else {
          html = '<li class="pt-4"><div class="row"><div class="col-sm-4"><div class="form-group"><span>Time of change:</span><input id="time' + index + '" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>M:</span><input id="M' + index + '" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>c:</span><input id="c' + index + '" class="form-control input-mask"><i class="form-group__bar"></i></div></div></div></li>';
          $('#matrix-collection>ul').append(html);
        }
      }
    }

    if (nssc_scenario) {
      if (type == 'General') Application.Load_General_Scenario(nssc_scenario, sampling_vector, matrix_collection, deme_vector_collection);
      else if (type == 'Symmetrical') Application.Load_Symmetrical_Scenario(nssc_scenario, sampling_vector);
    }

    Visual_Application.Configuration_Vector();
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

  $('#increment-order').on('click', function () {

  })
});

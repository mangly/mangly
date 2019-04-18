const electron = require('electron');
const { dialog } = require('electron').remote;
const ipc = electron.ipcRenderer;

var Application_Utilities = require('../Utilities/Application_Utilities');
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
    var index = $("#list-scenario").children().length;

    if (type == 'General') {
      var html_time_dime_sizes = '<li id = "scen' + index + '"><div class="row pt-4"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time' + matrix_collection.length + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-10"><span>Deme Sizes:</span><div class="matrix 1xn" style="padding:20px 0 40px 0 0" id="deme' + matrix_collection.length + '"></div>';
      Visual_Application.Add_Show_Time_Deme_Sizes(html_time_dime_sizes, order, deme_vector_collection, '#deme');

      var html = '<div class="matrix" id="matrix' + index + '"></div>';
      Visual_Application.Add_Matrix(html, $('#scen' + index), order, matrix_collection, '#matrix', false);
    }

    else if (type == 'Symmetrical') {
      var html = '<li class="pt-4"><div class="row"><div class="col-sm-4"><div class="form-group"><span>Time of change:</span><input id="time' + index + '" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>M:</span><input id="M' + index + '" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>c:</span><input id="c' + index + '" class="form-control input-mask"><i class="form-group__bar"></i></div></div></div></li>';
      $('#matrix-collection>ul').append(html);
    }

    if ($('#switch-selection-pagination').prop('checked')) {
      $("div.holder").jPages("destroy");
      $("div.holder").jPages({
        containerID: "list-scenario",
        perPage: 1
      });
    }
  });

  $('#remove-matrix').on('click', function () {
    var count = $('#list-scenario').children().length;

    if (count > 1) $('#list-scenario').children().eq(count - 1).remove();
    else console.log('error');

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
    else if (type == 'Symmetrical') ipc.send('nssc-json-result', Application.Build_Symmetrical_Scenario_NSSC(sampling_vector.jexcel('getRowData', 0), number_of_events + 1));
  });

  $('#save-scenario').on('click', function () {
    var json_result;

    if (type == 'General') json_result = Application.Build_General_Scenario_NSSC(matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0));
    else json_result = Application.Build_Symmetrical_Scenario_NSSC(sampling_vector.jexcel('getRowData', 0), number_of_events + 1)

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
    Visual_Application.Add_Deme(1, order, deme_vector_collection, sampling_vector, matrix_collection, type);
    order++;
  })

  $('#remove-deme').on('click', function () {
    if (order > 1) {
      order--;
      Visual_Application.Delete_Deme(1, order, deme_vector_collection, sampling_vector, matrix_collection, type);
    }

    else console.log('error');
  });

  var matrix;
  var sum = 2;
  var old_value = 0;
  $(document).on('click', 'td', function () {
    matrix = $(this).closest('.matrix');
    if (matrix.prop('id') == 'sampling-vector') {
      if (!$(this).hasClass('edition')) old_value = parseInt($(this).html());
    }
    // else if (sum != 2) dialog.showMessageBox(main_Window, { type: 'error', message: 'The sum of the sampling vector has to be 2', buttons: ['Accept'] });
  });

  $(document).on('change', 'td', function () {
    var previous_sum = sum;
    sum = Application_Utilities.Sum(sampling_vector.jexcel('getRowData', 0));
    if (sum == 2) {
      // $('#save').css('color', 'white');
      // $('#container-nref').removeClass('disabled');
      $('#container-matrices').removeClass('disabled');
      // var scenario_update = Application.Build_Scenario_Update(selected_function.type, matrix_collection, deme_vector_collection, sampling_vector.jexcel('getRowData', 0), number_of_events + 1);

      // application.logic_application.Get_NSSC_Vectors(selected_function.type, selected_function.name, scenario_update, function (nssc_function) {
      //     application.Update_NSSC(nssc_function);
      // });
    }

    else {
      if (isNaN(sum)) $(this).text(0);
      else if (sum > 2) {
        $(this).text(old_value);
        sum = previous_sum;
      }

      else {
        console.log('disabled')
        // $('#container-nref').addClass('disabled');
        $('#container-matrices').addClass('disabled');
      }

      $(this).removeClass('edition');
    }
  });

  $(document).on('keypress', '.edition', function (e) {
    if (matrix.prop('id') == 'sampling-vector') Application_Utilities.Allow_Only_Number(e, 'int');
    else Application_Utilities.Allow_Only_Number(e, 'float');
  });
});

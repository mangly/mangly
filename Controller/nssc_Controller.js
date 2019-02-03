const electron = require('electron');
const ipc = electron.ipcRenderer;

var matrix_collection = [];
var number_of_loci;
var sampling_vector;

$(document).ready(function () {
  ipc.on('parametters-nssc', function (event, arg) {
    number_of_loci = arg.number_of_loci;
    sampling_vector = arg.sampling_vector;

    for (let index = 0; index < arg.count_matrix; index++) {
      $('#matrix-collection').append('<div class="row"><div class="col-sm-2"><div class="form-group"><span>Time of change:</span><input id="time' + index + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div><div class="col-sm-4"><div class="form-group"><span>Deme sizes:</span><input id="deme' + index + '" type="text" class="form-control input-mask"><i class="form-group__bar"></i></div></div></div>')
      $('#matrix-collection').append('<div class="matrix" style="padding:20px 0 40px 0" id="matrix' + index + '"></div>')

      var matrix = $('#matrix' + index);

      var data = new Array([''])

      matrix.jexcel(
        {
          data: data,
          allowManualInsertColumn: false,
        });


      for (let index = 1; index < arg.order_n; index++) {
        matrix.jexcel('insertColumn');
        matrix.jexcel('insertRow');
      }

      for (let index = 0; index < arg.order_n; index++) {
        matrix.jexcel('setHeader', index, (index + 1).toString());
      }

      $('tr .jexcel_label').eq(0).html('nxn');

      matrix_collection.push(matrix);
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

    //$('.matrix').forEach(element => {

    //});
  });
});

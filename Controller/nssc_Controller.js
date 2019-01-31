const electron = require('electron');
const ipc = electron.ipcRenderer;

$(document).ready(function () {

  ipc.on('variable', function(event, arg){
    console.log(arg)
  })
  // var html = '<div class="row"><div class="col-sm-2"><div class="form-group"><label>Time of change</label><input type="text" class="form-control input-mask" data-mask="" placeholder=""><i class="form-group__bar"></i></div></div><div class="col-sm-8"><div class="form-group"><label>Deme sizes</label><input type="text" class="form-control input-mask" data-mask="" placeholder=""><i class="form-group__bar"></i></div></div></div>';


  //   var data = [];
  //   for (let index = 0; index < 6; index++) {

  //     var cell = new Array();
  //     for (let index = 0; index < 6; index++) {
  //       cell.push('');
  //     }

  //     data.push(cell);

  //     var container = document.getElementById('example');

  //     var hot = new Handsontable(container, {
  //       data: data,
  //       rowHeaders: false,
  //       colHeaders: false,
  //       filters: true,
  //       dropdownMenu: true,
  //     })

  //   }




  // var matrix =  $('#my');
  // for (let index = 0; index < 2; index++) {
  //   var data = new Array([''])

  //   matrix.jexcel(
  //     {
  //       data: data,
  //     });


  //   for (let index = 0; index < 10; index++) {
  //     matrix.jexcel('insertColumn');
  //     matrix.jexcel('insertRow');
  //   }

  //   $('#matrix-collection').append('<div id="'+index+'"></div>')
  //   matrix = $('#'+index);
  // }
});

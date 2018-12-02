const ps = require('python-shell')

function Psmc_Data(graphic, theta, rho){
    this.graphic = graphic;
    this.theta = theta;
    this.rho = rho;
}

exports.Application = function()
{
    this.psmc_data_collection = [];
}

exports.Application.prototype.Add_Psmc_Data = function(path, python_script){

    let options = {
        mode: 'text',
        args: [path]
      };
      
      ps.PythonShell.run(python_script, options, function (err, results) {
        if (err) throw err;
      
        else{
          var json = JSON.parse(results[0])
        }
    });
}

exports.Application.prototype.Plot = function(data, chart){
    data.data.datasets.push(json)
    chart.update() 
}
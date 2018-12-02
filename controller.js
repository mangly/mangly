const ps = require('python-shell')

function Psmc_Data(x_y, theta, rho){
    this.x_y = x_y;
    this.theta = theta;
    this.rho = rho;
}

exports.Application = function()
{
    this.psmc_data_collection = [];
}

exports.Application.prototype.Add_Psmc_Data = function(path, python_script){
    var psmc_collection = this.psmc_data_collection;
    let options = {
        mode: 'text',
        args: [path]
      };
      
      ps.PythonShell.run(python_script, options, function (err, results) {
        if (err) throw err;
      
        else{
          psmc_collection.push(new Psmc_Data(JSON.parse(results[0]), results[1], results[2]));
        }
    });
}

exports.Application.prototype.Plot = function(data, chart){
    this.psmc_data_collection.forEach(element => {
        data.data.datasets.push(element.x_y)
    });
    
    chart.update() 
}
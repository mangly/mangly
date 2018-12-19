'use strict'

const Python_Communicator = require('./Python_Communicator');
const Application_Utilities = require('./Application_Utilities');
const Psmc = require('./Psmc');
const Msmc = require('./Msmc');


class Application {
    constructor(){
        this.psmc_collection = [];
        this.msmc_collection = [];
    }
    
    Add_File(path_collection, callback){
        var psmc_collection = this.psmc_collection;
        var msmc_collection = this.msmc_collection;

        Python_Communicator.get_File_Results(path_collection, 'get_File_Results.py', function(results){
            results.file_collection.forEach(element => {

                if(element.extension == '.psmc' && !Application_Utilities.Contain(element.x_y.label, psmc_collection)){
                    var psmc = new Psmc(element.x_y.label, element.x_y, element.theta, element.rho);
                    psmc_collection.push(psmc);
                }

                else if((element.extension == '.msmc' || element.extension == '.txt') && !Application_Utilities.Contain(element.x_y.label, msmc_collection)){
                    var msmc = new Msmc(element.x_y.label, element.x_y);
                    msmc_collection.push(msmc);
                }
            });

            callback()
        })
    }
}

module.exports = Application
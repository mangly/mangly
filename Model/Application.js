'use strict'

const Python_Communicator = require('./Python_Communicator');
const Application_Utilities = require('../Utilities/Application_Utilities');
const PSMC = require('./PSMC');
const MSMC = require('./MSMC');


class Application {
    constructor(){
        this.psmc_collection = [];
        this.msmc_collection = [];
    }
    
    Add_File(path_collection, callback){
        
        var psmc_collection = this.psmc_collection;
        var msmc_collection = this.msmc_collection;

        Python_Communicator.get_File_Results(path_collection, 'get_File_Results.py', function(results){

            for (const element of results.file_collection) {
                if(element.model == 'psmc' && !Application_Utilities.Contain(element.name, psmc_collection)) psmc_collection.push(new PSMC(element.name, element.time, element.IICR_2, element.theta, element.rho));

                else if(!Application_Utilities.Contain(element.name, msmc_collection)) msmc_collection.push(new MSMC(element.name, element.time, element.IICR_k));
            }

            console.log(psmc_collection);

            callback();
        })
    }
}

module.exports = Application
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

            callback();
        })
    }

    Scale_Psmc_Graph()
    {
        var mu = 1.25e-8;
        var s = 100;

        for (const element of this.psmc_collection) {
            for (let index = 0; index < element.time.length; index++) {
                var N = element.theta / (4*mu*s);
                element.time[index] = 2 * N * element.time[index];
                element.IICR_2[index] = N * element.IICR_2[index];
            }
        }
        // psmc_time = [2 * N * t for t in psmc_time] 
        // psmc_size = [N * l for l in psmc_IICR2]
    }

    Scale_Msmc_Graph()
    {
        var mu = 1.25e-8;

        for (const element of this.msmc_collection) {
            for (let index = 0; index < element.time.length; index++) {
                element.time[index] = element.time[index] / mu;
                element.IICR_k[index] = 1 / element.IICR_k[index] / (2 * mu);
            }
        }

        // msmc_time = [t / mu for t in msmc_time]
        // msmc_size = [1. / l / (2*mu) for l in msmc_coal_rate]
    }
}

module.exports = Application
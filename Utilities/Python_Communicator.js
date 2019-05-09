'use strict'
const ps = require('python-shell');

class Python_Communicator {
    constructor(){
        this.process_metaheuristics = null;
    }
    
    kill_Process(){
        this.process_metaheuristics.childProcess.kill();
    }

    get_Model_PSMC(path, name, python_script, callback) {
        let options = {
            mode: 'text',
            args: [path, name]
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results))
        });
    }

    get_Model_MSMC(path, name, python_script, callback) {
        let options = {
            mode: 'text',
            args: [path, name]
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results))
        });
    }

    get_Model_NSSC(type, json, python_script, callback) {
        let options = {
            mode: 'text',
            args: [JSON.stringify(json), type]
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results));
        });
    }

    compute_Distance(vectors, scenario_NSSC, n_ref, python_script, callback) {
        let options = {
            mode: 'text',
            args: [JSON.stringify(vectors), JSON.stringify(scenario_NSSC), n_ref]
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results));
        });
    }

    get_Optimal_Values_Metaheuristic_DE(vectors, scenario_NSSC, n_ref, python_script, callback) {
        let options = {
            mode: 'text',
            args: [JSON.stringify(vectors), JSON.stringify(scenario_NSSC), n_ref]
        };

        this.process_metaheuristics = ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results));
        });
    }

    get_Optimal_Values_Metaheuristic_PSO(vectors, scenario_NSSC, n_ref, python_script, callback) {
        let options = {
            mode: 'text',
            args: [JSON.stringify(vectors), JSON.stringify(scenario_NSSC), n_ref]
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results));
        });
    }
}

module.exports = Python_Communicator
'use strict'
const ps = require('python-shell');

class Python_Communicator {

    static get_File_Results(path_collection, python_script, callback) {
        let options = {
            mode: 'text',
            args: path_collection,
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results))
        });
    }

    static get_Model_NSSC(type, json, python_script, callback) {
        let options = {
            mode: 'text',
            args: [JSON.stringify(json), type]
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results));
        });
    }

    static compute_Distance(vectors, scenario_NSSC, n_ref, python_script, callback) {
        let options = {
            mode: 'text',
            args: [JSON.stringify(vectors), JSON.stringify(scenario_NSSC), n_ref]
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results));
        });
    }

    static get_Optimal_Values_Metaheuristic_DE(vectors, scenario_NSSC, n_ref, python_script, callback) {
        let options = {
            mode: 'text',
            args: [JSON.stringify(vectors), JSON.stringify(scenario_NSSC), n_ref]
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results));
        });
    }

    static get_Optimal_Values_Metaheuristic_PSO(vectors, scenario_NSSC, n_ref, python_script, callback) {
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
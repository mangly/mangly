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

    static get_Model_NSSC(json, python_script, callback) {
        let options = {
            mode: 'text',
            args: JSON.stringify(json),
        };

        ps.PythonShell.run(python_script, options, function (err, results) {
            if (err) throw err;
            else callback(JSON.parse(results))
        });
    }
}

module.exports = Python_Communicator
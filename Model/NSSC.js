'use strict'

var Application_Utilities = require('../Utilities/Application_Utilities');
var Abstract_Model = require('./Model');

class NSSC extends Abstract_Model {
    constructor(name, type, x_vector, y_vector, scenario, N_ref, path) {
        super(name, x_vector, y_vector, path);
        this.scenario = scenario
        this.model = 'nssc';
        this.type = type;
        this.N_ref = N_ref;
    }

    Clone() {
        var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        clone.x_vector = this.x_vector.slice();
        clone.y_vector = this.y_vector.slice();

        return clone;
    }

    Equals(nssc) {
        return (this.name == nssc.name || (Application_Utilities.Equals(this.x_vector, nssc.x_vector) && Application_Utilities.Equals(this.y_vector, nssc.y_vector)));
    }
}

module.exports = NSSC
'use strict'

var Application_Utilities = require('../Utilities/Application_Utilities');

class NSSC {
    constructor(name, type, x_vector, IICR_specie, scenario, N_ref, path) {
        this.name = name;
        this.x_vector = x_vector;
        this.IICR_specie = IICR_specie;
        this.scenario = scenario
        this.model = 'nssc';
        this.type = type;
        this.N_ref = N_ref;
        this.path = path;
    }

    Clone() {
        var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        clone.x_vector = this.x_vector.slice();
        clone.IICR_specie = this.IICR_specie.slice();

        return clone;
    }

    Equals(nssc) {
        return (this.name == nssc.name || (Application_Utilities.Equals(this.x_vector, nssc.x_vector) && Application_Utilities.Equals(this.IICR_specie, nssc.IICR_specie)));
    }
}

module.exports = NSSC
'use strict'

var Application_Utilities = require('../Utilities/Application_Utilities');

class NSSC {
    constructor(name, type, x_vector, IICR_specie, scenario) {
        this.name = name;
        this.x_vector = x_vector;
        this.IICR_specie = IICR_specie;
        this.scenario = scenario
        this.model = 'nssc';
        this.type = type;
    }

    // Clone() {
    //     var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    //     clone.time = this.time.slice();
    //     clone.IICR_k = this.IICR_k.slice();

    //     return clone;
    // }

    Equals(nssc) {
        return (this.name == nssc.name || (Application_Utilities.Equals(this.x_vector, nssc.x_vector) && Application_Utilities.Equals(this.IICR_specie, nssc.IICR_specie)));
    }
}

module.exports = NSSC
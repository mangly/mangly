'use strict'

var Application_Utilities = require('../Utilities/Application_Utilities');
var Abstract_Model = require('../Model/Abstract_Model');

class MSMC extends Abstract_Model {
    constructor(name, x_vector, y_vector, Mu, path) {
        super(name, x_vector, y_vector, path);
        this.model = 'msmc';
        this.Mu = Mu;
    }

    Clone() {
        var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        clone.x_vector = this.x_vector.slice();
        clone.y_vector = this.y_vector.slice();

        return clone;
    }

    Equals(msmc) {
        return (this.name == msmc.name || (Application_Utilities.Equals(this.x_vector, msmc.x_vector) && Application_Utilities.Equals(this.y_vector, msmc.y_vector)));
    }
}

module.exports = MSMC
'use strict'

var Application_Utilities = require('../Utilities/Application_Utilities');
var Abstract_Model = require('../Model/Abstract_Model');

class PSMC extends Abstract_Model {
    constructor(name, x_vector, y_vector, theta, rho, Mu, S, path) {
        super(name, x_vector, y_vector, path);
        this.theta = theta;
        this.rho = rho;
        this.model = 'psmc';
        this.Mu = Mu;
        this.S = S;
    }

    Clone() {
        var clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        clone.x_vector = this.x_vector.slice();
        clone.y_vector = this.y_vector.slice();

        return clone;
    }

    Equals(psmc) {
        return (this.name == psmc.name || (Application_Utilities.Equals(this.x_vector, psmc.x_vector) && Application_Utilities.Equals(this.y_vector, psmc.y_vector)));
    }
}

module.exports = PSMC
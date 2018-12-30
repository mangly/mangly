'use strict'

class Application_Utilities {

    static Contain(element_name, app_collection) {
        for (let index = 0; index < app_collection.length; index++) {
            const element = app_collection[index];

            if (element.name && (element.name == element_name)) return true;
        }

        return false;
    }

    static Contain_Graphic(name_graphic, chart) {
        for (const element of chart.data.datasets) {
            if (name_graphic == element.label) return true;
        }

        return false;
    }

    static Generate_Data_To_Chart(vector_X, vector_Y) {
        var result = [];

        for (let index = 0; index < vector_X.length; index++) {
            result.push({ 'x': vector_X[index], 'y': vector_Y[index] });
        }

        return result;
    }
}

module.exports = Application_Utilities
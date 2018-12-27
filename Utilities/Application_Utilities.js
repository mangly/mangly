'use strict'

class Application_Utilities {

    static Contain(element_name, app_collection){
        for (let index = 0; index < app_collection.length; index++) {
            const element = app_collection[index];

            if(element.name && (element.name==element_name)) return true;
        }

        return false;
    }

    static Generate_Data_To_Chart(vector_X, vector_Y, callback)
    {
        var result = [];

        for (let index = 0; index < vector_X.length; index++) {
            result.push({'x':vector_X[index], 'y':vector_Y[index]});
        }

        return result;
    }
}

module.exports = Application_Utilities
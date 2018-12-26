'use strict'

class Application_Utilities {

    static Contain(element_name, app_collection){
        for (let index = 0; index < app_collection.length; index++) {
            const element = app_collection[index];

            if(element.name && (element.name==element_name)) return true;
        }

        return false;
    }
}

module.exports = Application_Utilities
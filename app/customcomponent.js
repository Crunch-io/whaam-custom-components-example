(function myModule() {
    /*
     * Create an Angular module that serves as the entry point
     * to all the other modules needed to make your component work
     */
    var testModule =  angular.module('testModule', []),
        myCustomComponent = angular.module('myCustomComponent', [testModule.name])

    testModule.value('testValue', { })
})()

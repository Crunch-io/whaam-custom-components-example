(function myModule() {
    /*
     * Create an Angular module that serves as the entry point
     * to all the other modules needed to make your component work
     */
    var displayDatasetMod =  angular.module('displayDataset', []),
        myCustomComponent = angular.module('myCustomComponent', [displayDatasetMod.name])


    function DisplayDatasetInfoDirective(currentDataset) {

        return {
            restrict : 'E',
            template : '<div class="dataset-name">{{dataset.name}}</div>',
            link : function(scope) {
                currentDataset.fetch().then(function(dataset) {
                    scope.dataset = dataset
                })
            }
        }
    }

    DisplayDatasetInfoDirective.$inject = [
        'currentDataset'
    ]

    //You can use all the services and directives already defined by whaam
    displayDatasetMod.directive('displayDatasetInfo', DisplayDatasetInfoDirective)

    myCustomComponent.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('app.root', {
            url : '/'
            , views : {
                workspace : {
                    template : '<datasets></datasets>'
                }
            }
        })

        $stateProvider.state('app.datasets.datasetInfo', {
            url : '/dataset-info'
            , views : {
                content : {
                    template : '<display-dataset-info></display-dataset-info>'
                }
            }
        })
    }])

    myCustomComponent.config(['statesAliasesDecoratorProvider', function(aliases) {
        aliases.addAlias({
            state : 'app.datasets.datasetInfo',
            alias : 'defaultDatasetView'
        })
    }])
})()

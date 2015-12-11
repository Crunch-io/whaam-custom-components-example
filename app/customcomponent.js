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

    function SimpleAnalysisController($scope,
        cachedHierarchicalVariables,
        Analysis,
        xtabFactory,
        displaySettings,
        filterBar) {

        this.init = function() {
            cachedHierarchicalVariables
                .waitForCachePopulation()
                .then(createAnalysis)

            $scope.$on('filter.applied', createAnalysis)
            $scope.$on('filter.removed', createAnalysis)
        }

        function createAnalysis() {
            var variables = cachedHierarchicalVariables.current,
                x = variables.byName('x'),
                y = variables.byName('y')
                ;

            $scope.analysis = Analysis.create()

            console.log($scope.analysis.state) //Displays empty

            $scope.analysis.handle('add-variable', [
                x.self,
                y.self
            ])

            $scope.analysis.on('analysis.loaded', createDisplayTable)
        }

        function createDisplayTable() {
            var filter = filterBar.eligibleFilters[0].self
                ;

            console.log('analysis generated', $scope.analysis.state)

            // if(!$scope.analysis.unfiltered) {
            //     $scope.analysis.handle('set-unfiltered')
            // }

            if(!$scope.analysis.hasCustomFilters) {
                $scope.analysis.handle('add-filter', filter)
            }

            xtabFactory.getXtab({
                analysis : $scope.analysis,
                settings : displaySettings
            }).then(function(xtab) {
                $scope.settings = displaySettings
                $scope.xtab = xtab
                console.log(xtab)
            })
        }
    }

    SimpleAnalysisController.$inject = [
        '$scope',
        'cachedHierarchicalVariables',
        'Analysis',
        'xtabFactory',
        'displaySettings',
        'filterBar'
    ]

    displayDatasetMod.controller('simpleAnalysisCtrl', SimpleAnalysisController)

    myCustomComponent.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('app.root', {
            url : '/'
            , views : {
                workspace : {
                    template : '<datasets></datasets>'
                }
            }
        })

        $stateProvider.state('app.datasets.simpleAnalysis', {
            url : '/simple-analysis'
            , views : {
                'toolbar@app' : {
                    templateUrl : '/dataset-header/dataset-header.html'
                },
                content : {
                    template : `
                        <div class="analyze" ng-controller="simpleAnalysisCtrl">
                            <analyze-table
                                ng-if="xtab"
                                settings="settings"
                                analysis="analysis"
                                xtab="xtab">
                            </analyze-table>
                        </div>`
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

    myCustomComponent.config(['navigationTabsProvider', function(navBar) {
        navBar.addNavigationRoute({
            name : 'app.root',
            tooltip : 'Select a dataset to analyze',
            display : 'datasets',
            shortName : 'datasets'
        })

        navBar.addNavigationRoute({
            name : 'app.datasets.datasetInfo',
            requiresDataset : true,
            display : 'info',
            tooltip : 'See opened dataset information',
            shortName : 'info'
        })

        navBar.addNavigationRoute({
            name : 'app.datasets.simpleAnalysis',
            requiresDataset : true,
            display : 'simple analysis',
            tooltip : 'See a simple analysis',
            shortName : 'simple analysis'
        })
    }])

    myCustomComponent.config(['statesAliasesDecoratorProvider', function(aliases) {
        aliases.addAlias({
            state : 'app.datasets.datasetInfo',
            alias : 'defaultDatasetView'
        })
    }])
})()

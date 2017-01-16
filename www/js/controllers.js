// TODO: add service on refresh to share latest data

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, sharedProperties, $ionicScrollDelegate) {
    $scope.d = "Aloha";
    $scope.lastUpdated = "Pull to Refresh";
    $scope.trains = [];
    $scope.Math = window.Math;

    $scope.trainsEmpty = function() {
        return $scope.trains.length > 0 ? false : true;
    }

    $scope.getWalkTime = function(stationName) {
        var stationsArr = sharedProperties.getObject().StationsArr;
        var stationIndex = -1;
        for (var i=0; i<stationsArr.length; i++) {
            if (stationsArr[i].Name == stationName) {
                stationIndex = i;
            }
        }
        // console.log(stationsArr);
        // console.log("getWalkTime(" + stationName + ") = " + stationsArr[stationIndex].WalkTime);
        return stationsArr[stationIndex].WalkTime;
    }

    $scope.getWalkTime0 = function(stationName) {
        var stations = sharedProperties.getObject().Stations;
        // console.log(stations);
        // console.log("getWalkTime(" + stationName + ") = " + stations[stationName].WalkTime);
        return stations[stationName].WalkTime;
    }

    $scope.walkTrainVal = function(train) {
        // console.log(train);
        // console.log("walkTrainVal(" + train + ")");
        var gwt = train.Min - $scope.getWalkTime(train.LocationName);
        if (gwt < 0) {
            gwt = gwt * -100;
        }
        if (Math.abs(gwt) < 5) {
            gwt = gwt * .01;
        }
        // console.log("walkTrainVal(" + train + ") = " + gwt);
        return gwt;
    }

    $scope.getData = function() {
        // console.log("sharedProperties.getObject()");
        // console.log(sharedProperties.getObject());

        stationsArr = sharedProperties.getObject().StationsArr;
        var stations = {};
        for (var j=0; j<stationsArr.length; j++) {
            stations[stationsArr[j].Name] = stationsArr[j];
        }

        var url = "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/All";
        $http({
                url: url,
                method: "GET",
                headers: {
                    // "api_key": "bdcf688ae9954ed79b2a7c30a4e99d27"
                    "api_key": sharedProperties.getApi()
                }
            })
            .then(function success(data) {
                var trains0 = data.data.Trains;
                var trains = [];
                for (var i = 0; i < trains0.length; i++) {
                    var train = trains0[i];
                    if (!(train.Min > 0)) {
                        // Min has to be an int
                        continue;
                    }
                    // TODO: remove this hack
                    //   console.log("Filtering? " + train.LocationName);
                    if (train.LocationName == "NoMa-Gallaudet") {
                        train.LocationName = "NoMa-Gallaudet U";
                    }

                    // if (!sharedProperties.getObject().Stations[train.LocationName].isFavorite) {
                    if (!stations[train.LocationName].isFavorite) {
                        // console.log("sharedProperties: ");
                        // console.log(sharedProperties.getObject());
                        // console.log("Filtered out: " + train.Line);
                        continue;
                    }


                    if (!sharedProperties.getObject().Lines[train.Line]) {
                        // console.log("sharedProperties: ");
                        // console.log(sharedProperties.getObject());
                        // console.log("Not found: " + train.Line);
                        continue;
                    }
                    switch (train.Line) {
                        case "BL":
                            train.rgb = "rgb(10, 148, 214)";
                            trains.push(train);
                            break;
                        case "GR":
                            train.rgb = "rgb(0, 176, 82)";
                            trains.push(train);
                            break;
                        case "OR":
                            train.rgb = "rgb(222, 135, 3)";
                            trains.push(train);
                            break;
                        case "RD":
                            train.rgb = "rgb(191, 18, 56)";
                            trains.push(train);
                            break;
                        case "SV":
                            train.rgb = "rgb(161, 163, 161)";
                            trains.push(train);
                            break;
                        case "YL":
                            train.rgb = "rgb(247, 212, 23)";
                            trains.push(train);
                            break;
                        default:
                            break;
                    }
                }
                $scope.trains = trains;
                $scope.display = JSON.stringify(data.data.Trains[0]);
                $scope.display += "\n\n" + JSON.stringify(data.data.Trains[1]);
                $scope.d = "SUCCESS";
                // console.log("Redata");
                // console.log(data);
            }, function error(data) {
                console.log("ERROR");
                console.log(data);
            });
    }
    $scope.getData0 = function() {
        // console.log("sharedProperties.getObject()");
        // console.log(sharedProperties.getObject());
        var url = "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/All";
        $http({
                url: url,
                method: "GET",
                headers: {
                    // "api_key": "bdcf688ae9954ed79b2a7c30a4e99d27"
                    "api_key": sharedProperties.getApi()
                }
            })
            .then(function success(data) {
                var trains0 = data.data.Trains;
                var trains = [];
                for (var i = 0; i < trains0.length; i++) {
                    var train = trains0[i];
                    if (!(train.Min > 0)) {
                        // Min has to be an int
                        continue;
                    }
                    // TODO: remove this hack
                    //   console.log("Filtering? " + train.LocationName);
                    if (train.LocationName == "NoMa-Gallaudet") {
                        train.LocationName = "NoMa-Gallaudet U";
                    }
                    if (!sharedProperties.getObject().Stations[train.LocationName].isFavorite) {
                        // console.log("sharedProperties: ");
                        // console.log(sharedProperties.getObject());
                        // console.log("Filtered out: " + train.Line);
                        continue;
                    }
                    if (!sharedProperties.getObject().Lines[train.Line]) {
                        // console.log("sharedProperties: ");
                        // console.log(sharedProperties.getObject());
                        // console.log("Not found: " + train.Line);
                        continue;
                    }
                    switch (train.Line) {
                        case "BL":
                            train.rgb = "rgb(10, 148, 214)";
                            trains.push(train);
                            break;
                        case "GR":
                            train.rgb = "rgb(0, 176, 82)";
                            trains.push(train);
                            break;
                        case "OR":
                            train.rgb = "rgb(222, 135, 3)";
                            trains.push(train);
                            break;
                        case "RD":
                            train.rgb = "rgb(191, 18, 56)";
                            trains.push(train);
                            break;
                        case "SV":
                            train.rgb = "rgb(161, 163, 161)";
                            trains.push(train);
                            break;
                        case "YL":
                            train.rgb = "rgb(247, 212, 23)";
                            trains.push(train);
                            break;
                        default:
                            break;
                    }
                }
                $scope.trains = trains;
                $scope.display = JSON.stringify(data.data.Trains[0]);
                $scope.display += "\n\n" + JSON.stringify(data.data.Trains[1]);
                $scope.d = "SUCCESS";
                // console.log("Redata");
                // console.log(data);
            }, function error(data) {
                console.log("ERROR");
                console.log(data);
            });
    }

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop(true);
    };

    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.lastUpdated = sharedProperties.getPrintedDate();
        $scope.getData();
        $scope.$apply();
    };

})

.controller('ScheduleCtrl', function($scope, $http, $ionicScrollDelegate, Schedule, sharedProperties) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.trains = []
    var d = Schedule.all();
    $scope.lastUpdated = "Pull to Refresh";

    $scope.getData = function() {
        var url = "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/All";
        $http({
                url: url,
                method: "GET",
                headers: {
                    // "api_key": "bdcf688ae9954ed79b2a7c30a4e99d27"
                    "api_key": sharedProperties.getApi()
                }
            })
            .then(function success(data) {
                var trains0 = data.data.Trains;
                var trains = [];
                for (var i = 0; i < trains0.length; i++) {
                    var train = trains0[i];
                    // if (!(train.Min > 0)) {
                    //     // Min has to be an int
                    //     continue;
                    // }
                    switch (train.Line) {
                        case "BL":
                            train.rgb = "rgb(10, 148, 214)";
                            trains.push(train);
                            break;
                        case "GR":
                            train.rgb = "rgb(0, 176, 82)";
                            trains.push(train);
                            break;
                        case "OR":
                            train.rgb = "rgb(222, 135, 3)";
                            trains.push(train);
                            break;
                        case "RD":
                            train.rgb = "rgb(191, 18, 56)";
                            trains.push(train);
                            break;
                        case "SV":
                            train.rgb = "rgb(161, 163, 161)";
                            trains.push(train);
                            break;
                        case "YL":
                            train.rgb = "rgb(247, 212, 23)";
                            trains.push(train);
                            break;
                        default:
                            break;
                    }
                }
                $scope.trains = trains;
                $scope.display = JSON.stringify(data.data.Trains[0]);
                $scope.display += "\n\n" + JSON.stringify(data.data.Trains[1]);
                $scope.d = "SUCCESS";
                console.log("data");
                console.log(data);
            }, function error(data) {
                console.log("ERROR");
                console.log(data);
            });
    }

    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.getData();
        $scope.lastUpdated = sharedProperties.getPrintedDate();
        $scope.$apply();
    };

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop(true);
    };


})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
    $scope.trains = []

    $scope.showData = function() {
        var trains0 = d.data.Trains;
        var trains = [];
        for (var i = 0; i < trains0.length; i++) {
            var train = trains0[i];
            // if (!(train.Min > 0)) {
            //     // Min has to be an int
            //     continue;
            // }
            switch (train.Line) {
                case "OR":
                    train.rgb = "orange";
                    trains.push(train);
                    break;
                case "SV":
                    train.rgb = "gray";
                    trains.push(train);
                    break;
                default:
                    break;
            }
        }
        $scope.trains = trains;
    };

    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        $scope.showData();
        $scope.$apply();
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, sharedProperties) {
    $scope.settings = sharedProperties.getObject();

    $scope.saveProperties = function() {
        console.log("saveProperties()");
        sharedProperties.setObject($scope.settings);
    };

    $scope.clearq = function() {
        console.log($scope.q);
        console.log("clearq");
        $scope.q = "";
    }

    $scope.lineToRgb = function(line) {
        var train = {};
        switch (line) {
            case "BL":
                train.rgb = "rgb(10, 148, 214)";
                break;
            case "GR":
                train.rgb = "rgb(0, 176, 82)";
                break;
            case "OR":
                train.rgb = "rgb(222, 135, 3)";
                break;
            case "RD":
                train.rgb = "rgb(191, 18, 56)";
                break;
            case "SV":
                train.rgb = "rgb(161, 163, 161)";
                break;
            case "YL":
                train.rgb = "rgb(247, 212, 23)";
                break;
            default:
                break;
        }
        //   console.log(line);
        //   console.log(train.rgb);
        return train.rgb;
    }
})

.controller('SettingsCtrl', function($scope, $location, sharedProperties, anchorSmoothScroll, $ionicScrollDelegate) {
    $scope.settings = sharedProperties.getObject();
    $scope.favFilterVal = false;

    $scope.keyVal = function(item) {
        console.log(item);
        return item.Name;
    }

    $scope.favFilter = function(item) {
        // console.log("favFilter(" + item + ")");
        // console.log(item);
        if ($scope.favFilterVal) {
            return item.isFavorite;
        }
        else {
            return true;
        }
    };

    $scope.lineFilter = function(item) {
        // console.log("lineFilter(" + item + ")");
        // console.log(item);
        // Check all in Line[] to see if it is in $scope.settings.Lines[]
        // if any are true, return it
        for (l in item.Line) {
          // console.log(item.Line[l] + " " + $scope.settings.Lines[item.Line[l]])
          if ($scope.settings.Lines[item.Line[l]]) {
              return true;
          }
        }
        return false;
    };

    $scope.saveProperties = function() {
        console.log("saveProperties()");
        // console.log($scope.settings);
        sharedProperties.setObject($scope.settings);
    };

    $scope.clearq = function() {
        console.log($scope.q);
        console.log("clearq");
        $scope.q = "";
    };

    $scope.lineToRgb = function(line) {
        var train = {};
        switch (line) {
            case "BL":
                train.rgb = "rgb(10, 148, 214)";
                break;
            case "GR":
                train.rgb = "rgb(0, 176, 82)";
                break;
            case "OR":
                train.rgb = "rgb(222, 135, 3)";
                break;
            case "RD":
                train.rgb = "rgb(191, 18, 56)";
                break;
            case "SV":
                train.rgb = "rgb(161, 163, 161)";
                break;
            case "YL":
                train.rgb = "rgb(247, 212, 23)";
                break;
            default:
                break;
        }
        //   console.log(line);
        //   console.log(train.rgb);
        return train.rgb;
    };

    $scope.gotoElement = function(eID) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('#');
        console.log("gotoElement(" + eID + ")");

        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);

    };

    $scope.clear = function() {
      console.log("in $scope.clear()");
      $scope.settings.Lines = {"BL":true,"GR":true,"OR":true,"SV":true,"RD":true,"YL":true};
      $scope.q = "";
      $scope.favFilterVal = false;
      $scope.saveProperties();
    }

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop(true);
    };

    $scope.keypress = function($event) {
        $scope.lastKey = $event.keyCode;
        console.log($scope.lastKey);
        $scope.scrollTop();
    };


})

;

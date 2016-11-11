var base = angular.module("base", []);

base.directive('observe', function() {

    var templateUrl = '';
    templateUrl += '<div class="page">';
    /*templateUrl += '    <span ng-click="first()" ng-disabled="isFirst()">{{ getText("first") }}</span>';*/
    templateUrl += '    <span class="prov" ng-click="provie()" ng-disabled="isFirst()">{{ getText("provie") }}</span>';
    templateUrl += '    <span ng-repeat="i in page" ng-click="selectPage(i.indexPage)" ng-class="{active: i.active}">{{ i.text + 1 }}</span>';
    templateUrl += '    <span class="next" ng-click="next()" ng-disabled="isLast()">{{ getText("next") }}</span>';
    /*templateUrl += '    <span ng-click="last()" ng-disabled="isLast()">{{ getText("last") }}</span>';
     */

    /* templateUrl += '    <span>共{{ totalPages }}页，{{ totalItems }}条</span>';
     */
    templateUrl += '</div>';

    return {
        restrice: 'EA',
        controller: function($scope, pagerConfig) {
            // 共多少条
            $scope.totalItems = 0;
            $scope.page = [];
            // 偏移数
            $scope.offsetPage = 0;
            // 一页多少条
            $scope.itemsPerpage = 5;
            // 一个多少页
            $scope.totalPages = 5;
            $scope.currentPage = 0;

            $scope.$watch('totalItems', function() {

                $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerpage);

                resetPageList();
                if ($scope.page[$scope.currentPage]) {
                    $scope.page[$scope.currentPage].active = true;
                }
            });

            var resetPageList = function() {
                $scope.page = [];

                var last = Math.min(Number($scope.offsetPage) + Number($scope.listSizes), $scope.totalPages);

                for (var i = $scope.offsetPage; i < last; i++) {
                    $scope.page.push({
                        text: i,
                        indexPage: i,
                        active: false
                    })
                }

            }
            var getOffset = function(index) {
                var offset = Math.min(index, $scope.totalPages - $scope.listSizes);
                if (offset <= 0) {
                    offset = 0;
                }
                return offset;
            };
            $scope.selectPage = function(index) {
                if (index < 0 || index >= $scope.totalPages) {
                    return;
                }
                if ($scope.page[$scope.currentPage - $scope.offsetPage]) {
                    $scope.page[$scope.currentPage - $scope.offsetPage].active = false;
                }
                $scope.currentPage = index;
                // 如果currentPage 小于 offsetPage 或者 currentPage 大于 offsetPage加listsizes

                if ($scope.currentPage < $scope.offsetPage || $scope.currentPage >= $scope.offsetPage + $scope.page.length) {

                    $scope.offsetPage = getOffset(index)

                    resetPageList();
                }

                if ($scope.page[$scope.currentPage - $scope.offsetPage]) {
                    $scope.page[$scope.currentPage - $scope.offsetPage].active = true;
                }


                $scope.$emit('pagechage', $scope.currentPage);
                $scope.submit($scope.currentPage + 1, 5);

            };
            $scope.next = function() {
                if ($scope.isLast()) {
                    return;
                }
                $scope.selectPage($scope.currentPage + 1);
            };
            $scope.provie = function() {
                if ($scope.isFirst()) return
                $scope.selectPage($scope.currentPage - 1);
            }
            $scope.first = function() {
                $scope.selectPage(0);
            }
            $scope.last = function() {
                $scope.selectPage($scope.totalPages - 1);
            }
            $scope.isFirst = function() {
                return $scope.currentPage <= 0;
            };
            $scope.isLast = function() {
                return $scope.currentPage >= $scope.totalPages - 1;
            }
            $scope.getText = function(key) {
                return pagerConfig.text[key];
            };


        },
        link: function(scope, ele, attrs) {

            scope.itemsPerpage = attrs.itemsperpage || 1;
            scope.listSizes = attrs.listsizes;
            attrs.$observe('totalitems', function(val) {
                scope.totalItems = val;
            })
        },
        template: templateUrl
    }
}).constant('pagerConfig', {
    text: {
        'first': '首页',
        'provie': '上一页',
        'next': '下一页',
        'last': '尾页',
    }
});

base.factory('baseHttp', function($http, $q) {
    var factory = {};

    factory.jsonp = function(url, data, back) {
        var deferred = $q.defer();
        var param = '';
        for (var item in data) {
            param += '&' + item + '=' + data[item];
        }
        var _token = $.cookie('token') || '';
        $http.jsonp(url + "?_token=" + _token + "&callback=JSON_CALLBACK" + param)
            .success(function(d) {
                deferred.resolve(data);
                back.call(this, d);
            }).error(function(data, status, headers, config) {
                deferred.reject(data); // 声明执行失败，即服务器返回错误  
            });
        return deferred.promise;
    }
    return factory;
});

base.filter('subString', function() {
    return function(str, len) {
        len = len || 999999;
        var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength > len) {
                break;
            }
            newStr += singleChar;
        }

        if (strLength > len) {
            newStr += "...";
        }
        return newStr;
    }
});
/**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 */

angular.module('angucomplete', ['base'])
    .directive('angucomplete', function($parse, $http, $sce, $timeout, baseHttp) {
        return {
            restrict: 'EA',
            scope: {
                "id": "@id",
                "placeholder": "@placeholder",
                "selectedObject": "=selectedobject",
                "selectedObjectEvent": "=selectedevent",
                "url": "@url",
                "dataField": "@datafield",
                "titleField": "@titlefield",
                "descriptionField": "@descriptionfield",
                "imageField": "@imagefield",
                "imageUri": "@imageuri",
                "inputClass": "@inputclass",
                "userPause": "@pause",
                "localData": "=localdata",
                "searchFields": "@searchfields",
                "minLengthUser": "@minlength",
                "matchClass": "@matchclass"
            },
            template: '<div class="angucomplete-holder" ><input id="{{id}}" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()" /><div  id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown"><div class="angucomplete-searching" ng-show="searching">搜索中···</div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">没有搜索到结果</div><div class="angucomplete-row" ng-repeat="result in results" ng-mousedown="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div ng-if="imageField" class="angucomplete-image-holder"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/><div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div></div><div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div><div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div>',

            link: function($scope, elem, attrs) {
                $scope.lastSearchTerm = null;
                $scope.currentIndex = null;
                $scope.justChanged = false;
                $scope.searchTimer = null;
                $scope.hideTimer = null;
                $scope.searching = false;
                $scope.pause = 500;
                $scope.minLength = 1;
                $scope.searchStr = null;

                if ($scope.minLengthUser && $scope.minLengthUser != "") {
                    $scope.minLength = $scope.minLengthUser;
                }

                if ($scope.userPause) {
                    $scope.pause = $scope.userPause;
                }

                isNewSearchNeeded = function(newTerm, oldTerm) {
                    return newTerm.length >= $scope.minLength && newTerm != oldTerm
                }

                $scope.processResults = function(responseData, str) {
                    if (responseData && responseData.length > 0) {
                        $scope.results = [];

                        var titleFields = [];
                        if ($scope.titleField && $scope.titleField != "") {
                            titleFields = $scope.titleField.split(",");
                        }

                        for (var i = 0; i < responseData.length; i++) {
                            // Get title variables
                            var titleCode = [];

                            for (var t = 0; t < titleFields.length; t++) {
                                titleCode.push(responseData[i][titleFields[t]]);
                            }

                            var description = "";
                            if ($scope.descriptionField) {
                                description = responseData[i][$scope.descriptionField];
                            }

                            var imageUri = "";
                            if ($scope.imageUri) {
                                imageUri = $scope.imageUri;
                            }

                            var image = "";
                            if ($scope.imageField) {
                                image = imageUri + responseData[i][$scope.imageField];
                            }

                            var text = titleCode.join(' ');
                            if ($scope.matchClass) {
                                var re = new RegExp(str, 'i');
                                var strPart = text.match(re)[0];
                                text = $sce.trustAsHtml(text.replace(re, '<span class="' + $scope.matchClass + '">' + strPart + '</span>'));
                            }

                            var resultRow = {
                                title: text,
                                description: description,
                                image: image,
                                originalObject: responseData[i]
                            }

                            $scope.results[$scope.results.length] = resultRow;
                        }


                    } else {
                        $scope.results = [];
                    }
                }

                $scope.searchTimerComplete = function(str) {
                    // Begin the search

                    if (str.length >= $scope.minLength) {
                        if ($scope.localData) {
                            var searchFields = $scope.searchFields.split(",");

                            var matches = [];

                            for (var i = 0; i < $scope.localData.length; i++) {
                                var match = false;

                                for (var s = 0; s < searchFields.length; s++) {
                                    match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                                }

                                if (match) {
                                    matches[matches.length] = $scope.localData[i];
                                }
                            }

                            $scope.searching = false;
                            $scope.processResults(matches, str);

                        } else {
                            baseHttp.jsonp($scope.url, { name: str }, function(responseData) {
                                $scope.searching = false;
                                $scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData), str);
                            });
                        }
                    }
                }

                $scope.hideResults = function() {
                    $scope.hideTimer = $timeout(function() {
                        $scope.showDropdown = false;
                    }, $scope.pause);
                };

                $scope.resetHideResults = function() {
                    if ($scope.hideTimer) {
                        $timeout.cancel($scope.hideTimer);
                    };
                };

                $scope.hoverRow = function(index) {
                    $scope.currentIndex = index;
                }

                $scope.keyPressed = function(event) {
                    if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                        if (!$scope.searchStr || $scope.searchStr == "") {
                            $scope.showDropdown = false;
                            $scope.lastSearchTerm = null
                        } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                            $scope.lastSearchTerm = $scope.searchStr
                            $scope.showDropdown = true;
                            $scope.currentIndex = -1;
                            $scope.results = [];

                            if ($scope.searchTimer) {
                                $timeout.cancel($scope.searchTimer);
                            }

                            $scope.searching = true;

                            $scope.searchTimer = $timeout(function() {
                                $scope.searchTimerComplete($scope.searchStr);
                            }, $scope.pause);
                        }
                    } else {
                        event.preventDefault();
                    }
                }

                $scope.selectResult = function(result) {
                    if ($scope.matchClass) {
                        result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                    }
                    $scope.searchStr = $scope.lastSearchTerm = result.title;
                    $scope.selectedObject = result;
                    $scope.showDropdown = false;
                    $scope.results = [];

                    if ($scope.selectedObjectEvent) {
                        $scope.selectedObjectEvent.call(this, result)
                    }
                    //$scope.$apply();
                }

                var inputField = elem.find('input');

                inputField.on('keyup', $scope.keyPressed);

                elem.on("keyup", function(event) {
                    if (event.which === 40) {
                        if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                            $scope.currentIndex++;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                        $scope.$apply();
                    } else if (event.which == 38) {
                        if ($scope.currentIndex >= 1) {
                            $scope.currentIndex--;
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                    } else if (event.which == 13) {
                        if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                            $scope.selectResult($scope.results[$scope.currentIndex]);
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        } else {
                            $scope.results = [];
                            $scope.$apply();
                            event.preventDefault;
                            event.stopPropagation();
                        }

                    } else if (event.which == 27) {
                        $scope.results = [];
                        $scope.showDropdown = false;
                        $scope.$apply();
                    } else if (event.which == 8) {
                        $scope.selectedObject = null;
                        $scope.$apply();
                    }
                });

            }
        };
    });

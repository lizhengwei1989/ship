'use.strict';

/*新建派车单*/
app.controller("acontrol", ['$scope', '$http', function($scope, $http) {
    /*添加发货单弹出框*/
    $scope.sendcar = false;
    $scope.addsalebill = function() {
        $scope.sendcar = true;
    }
    $scope.cancel = function() {
        $scope.sendcar = false;
    }


    /*服务站*/
    //$scope.serveShow = false;
    $http({
        url: 'http://10.143.79.39:8082/station/getCurrentStations',
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {

        }
    }).success(function(data) {
        //console.log(data);
        $scope.serveList = data.data;
        // $scope.serveSelect = function() {
        //     $scope.serveShow = true;
        //     $('#serveShow').css('display', 'block');
        // }
        $scope.titleTxt = data.data.name + '派车单';
        /*点击选择的内容放到input里面*/
        $scope.serveI = function(sel) {
            //$scope.serveTxt = sel.name;
            //$scope.serveShow = false;
            $('#station_id').attr('name', sel.id);
            //var servId = sel.id;
        }
    })


    /*配送路线*/
    $scope.pathShow = false;
    /*班次*/
    $scope.classesShow = false;
    /*发货单*/
    $scope.dispatchBill = false;
    /*存放发货单id*/
    $scope.arr = [];
    $http({
        url: 'http://10.143.79.39:8082/serviceLine/getAllServiceLines',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {

        }
    }).success(function(data2) {
        //console.log(data2);
        //配送路线
        $scope.pathList = data2.data;
        $scope.pathSelect = function() {
            $scope.pathShow = true;
            $('#pathShow').css('display', 'block');
        }
        $scope.pathI = function(path) {
            $scope.pathTxt = path.lineName;
            $("#sendpath").attr("name", path.id);
            $scope.pathShow = false;
            var pathId = path.id;
            /*班次请求*/
            $http({
                url: 'http://10.143.79.39:8082/serviceLine/getLineRunsByServiceLine?',
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    id: pathId
                }
            }).success(function(data3) {
                //console.log(data3);
                //班次
                $scope.classesList = data3.data;
                $scope.classesSelect = function() {
                    $scope.classesShow = true;
                    $('#classesShow').css('display', 'block');
                }
                $scope.classesI = function(classes) {
                    $scope.classesTxt = classes.runTime;
                    $scope.classesShow = false;
                    $('#line_sn_id').attr('name', classes.id);
                    var classesId = classes.id;
                    //alert(pathId);
                    //alert(classesId);

                    $http({
                        url: 'http://10.143.79.39:8082/ship/findBillsToDispatch?routeId=' + pathId + '&frequencyId=' + classesId,
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: {

                        }
                    }).success(function(data6) {
                        //console.log(data6.data);
                        //发货单
                        $scope.invoiceList = data6.data;
                        $scope.dispatchBill = true;
                        $scope.arr.length = 0;
                        angular.forEach(data6.data, function(value, key) {
                            //console.log(value.id);
                            $scope.arr.push(value.id);
                        });
                        //console.log($scope.arr);

                        /*平账金额*/
                        $scope.amount = function(val) {
                            $scope.moneys = 0;
                            angular.forEach(val, function(value, key) {
                                $scope.moneys += value.bmoney;
                            });
                            return $scope.moneys;
                        }

                        /*平账备注*/
                        $scope.remark = function(val) {
                            $scope.BRemark = '';
                            angular.forEach(val, function(value, key) {
                                $scope.BRemark = $scope.BRemark + '\n' + value.balancingRemark;
                                //$scope.BRemark += value.balancingRemark;
                            });
                            return $scope.BRemark;
                        }

                        /*平账操作记录*/
                        $scope.BOperate = function(val) {
                            $scope.BOperates = '';
                            angular.forEach(val, function(value, key) {
                                $scope.BOperates += value.createTime + '\n' + value.createUser;
                            });
                            return $scope.BOperates;
                        }

                        /*平账操作的删除按钮*/
                        $scope.handleDel = function(val) {
                            //console.log(val);
                            $scope.invoiceList.splice(val, 1);
                        }

                        /*应收金额*/
                        $scope.balanceDelivery = function(val) {
                            //console.log(val.balanceInfo);
                            var balanceIn = $scope.amount(val.balanceInfo);
                            $scope.balanceMoney = val.collectionDelivery + val.freightCharge + balanceIn;
                            return $scope.balanceMoney;
                        }

                    })
                }
            })

            /*根据选择的配送路线填充车辆信息*/
            $http({
                url: 'http://10.143.79.39:8082/driver/getDriverInfoByLineId?lineId=' + pathId,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {

                }
            }).success(function(data4) {
                //console.log(JSON.stringify(data4));
                //console.log(data4.data);
                $('#dispath_account_id').attr('name', data4.data.id);
                $('#dispath_plate_number').attr('name', data4.data.carId);
                $('#dispath_account_id').val(data4.data.name);
                $('#dispath_mobile').val(data4.data.contactNumber);
                $('#dispath_plate_number').val(data4.data.plateNumber);
            })
        }
    })


    /*提交*/
    $scope.submitNumber = function() {
        var serveId = Number($('#station_id').attr('name'));
        //alert(serveId);
        var lineId = Number($("#sendpath").attr("name"));
        //alert(lineId);
        var classId = Number($("#line_sn_id").attr("name"));
        var diliverymanId = Number($('#dispath_account_id').attr('name'));
        //alert(diliverymanId);
        var phoneTxt = Number($('#dispath_mobile').val());
        //alert(phoneTxt);
        var licenceId = Number($('#dispath_plate_number').attr('name'));
        //alert(licenceId);

        var params = {
            title: $scope.titleTxt,
            serviceStationId: serveId,
            serviceLineId: lineId,
            serviceLineSn: classId,
            driverId: diliverymanId,
            phone: phoneTxt,
            carId: licenceId
                // 'dispatchBillVoList[0].id': 31,
                // 'dispatchBillVoList[1].id': 32
        };
        //console.log($scope.arr);
        for (var i = 0; i < $scope.arr.length; i++) {
            var dbId = $scope.arr[i];
            params['dispatchBillVoList[idx].id'.replace('idx', i)] = dbId;
        }

        $http({
            url: 'http://10.143.79.39:8082/dispatch/addVehicleDispatch',
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },
            data: params
        }).success(function(data8) {
            console.log(data8);
            if (data8.result) {
                alert('提交成功');
            }
        })
    }

    /*车辆信息*/
    /*配送员*/
    $scope.deliveryShow = false;
    $http({
        url: 'http://10.143.79.39:8082/driver/loadByDriverNameForSelect',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            name: $scope.deliveryTxt
        }
    }).success(function(data5) {
        //console.log(data5.data);
        $scope.deliveryList = data5.data;
        $scope.deliverySelect = function() {
            $scope.deliveryShow = true;
            $('#deliveryShow').css('display', 'block');
        }
        $scope.deliveryI = function(delivery) {
            $scope.deliveryTxt = delivery.name;
            $scope.deliveryShow = false;
            $('#dispath_account_id').attr('name', delivery.id);
            $('#dispath_plate_number').attr('name', delivery.carId);
            $('#dispath_mobile').val(delivery.contactNumber);
            $('#dispath_plate_number').val(delivery.plateNumber);
        }

    })

    /*车牌号*/
    $scope.plateShow = false;
    $http({
        url: 'http://10.143.79.39:8082/car/searchByPlateNumber',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            name: $scope.plateTxt
        }
    }).success(function(data7) {
        //console.log(data7.data);
        $scope.plateList = data7.data;
        $scope.plateSelect = function() {
            $scope.plateShow = true;
            $('#plateShow').css('display', 'block');
        }
        $scope.plateI = function(plate) {
            $scope.plateTxt = plate.plateNumber;
            $scope.plateShow = false;
            $('#dispath_plate_number').attr('name', plate.id);
        }
    })

}]);

/*派车单查询*/
app.controller('check', ['$scope', '$http', function($scope, $http) {
    //点击时间框弹出时间end
    $scope.dat = new Date();
    $scope.format = "yyyy-MM-dd";
    $scope.altInputFormats = ['yyyy-M!-d!'];
    $scope.popup1 = {
        opened: false
    };
    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };
    //点击时间框弹出时间end

    /*服务站*/


    $http({
        url: 'http://10.143.79.39:8082/station/getCurrentStations',
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {

        }
    }).success(function(data) {
        //console.log(data);
        $scope.serveCheckList = data.data;
        $scope.serveCheck = function(serveVal) {
            $('#serveCheckId').attr('name', serveVal.id);
        }
    })

    /*服务站结束*/

    /*派车单状态*/
    $scope.sendState = false;
    // $scope.sendStateBtn = function() {
    //     $scope.sendState = true;
    //     $('#source').css('display', 'block');
    // }

    // $('#source li i').click(function() {
    //     $scope.sendStateTxt = $(this).val();
    //     $scope.sendState = false;
    // })


    /*线路*/
    $scope.checkPathShow = false;
    /*班次*/
    $scope.classShow = false;
    $http({
        url: 'http://10.143.79.39:8082/serviceLine/getAllServiceLines',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {

        }
    }).success(function(path) {
        //console.log(path.data);
        $scope.checkPathList = path.data;
        $scope.checkPathSelect = function() {
            $scope.checkPathShow = true;
            $('#checkPathShow').css('display', 'block');
        }
        $scope.checkPathBtn = function(pathtxt) {
            $scope.checkPathTxt = pathtxt.lineName;
            /*线路Id*/
            $("#checkPathTxt").attr("name", pathtxt.id);
            $scope.checkPathShow = false;
            var checkpathId = pathtxt.id;
            $http({
                url: 'http://10.143.79.39:8082/serviceLine/getLineRunsByServiceLine?',
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    id: checkpathId
                }
            }).success(function(classes) {
                //console.log(classes.data);
                $scope.classList = classes.data;
                $scope.classSelect = function() {
                    $scope.classShow = true;
                    $('#classShow').css('display', 'block');
                }
                $scope.classBtn = function(classVal) {
                    $scope.classTxt = classVal.runTime;
                    $scope.classShow = false;
                    /*班次Id*/
                    $('#lineSnId').attr('name', classVal.id);
                    var checkclassId = classVal.id;
                }
            })
        }
    });


    /*点击查询按钮按条件查询派车单*/
    $scope.tableCheck = false;
    $scope.advancedSearchBtn = function() {

        /*获取创建时间*/
        var createTime = $('#creationTime').val();
        var createTimeStart = createTime + ' ' + '00:00:00';
        var createTimeEnd = createTime + ' ' + '23:59:59';
        //console.log(createTimeStart);
        //console.log(createTimeEnd);

        /*参数的ID*/
        var serveCId = $('#serveCheckId').attr('name');
        var checkPId = $("#checkPathTxt").attr("name");
        var classPId = $('#lineSnId').attr('name');

        $http({
            url: 'http://10.143.79.39:8082/dispatch/listVehicleDispatch',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },
            data: {
                // serviceStationId: serveCId,
                // createTimeBegin: createTimeStart,
                // createTimeEnd: createTimeEnd,
                // vehicleDispatchNo: $scope.sendNumber,
                // currentStatus: 1,
                // driverId: $scope.dispatcherName,
                // phone: $scope.dispatcherMobile,
                // serviceLineId: checkPId,
                // plateNumber: $scope.dispatcherPlate,
                // serviceLineSn: classPId,
                // numbers: $scope.deliverNumber
            }
        }).success(function(data) {
            //console.log(data);
            $scope.tableList = data.data;
            $scope.tableCheck = true;

        })
    }

}])

/*派车单查询详情*/
app.controller('checkSend', ['$scope', '$http', function($scope, $http) {
    /*查看派车单*/
    $http({
        url: 'http://10.143.79.39:8082/dispatch/getVehicleDispatchInfo?id=123123',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {

        }
    }).success(function(data) {
        //console.log(data.data);
        $scope.checksendList = data.data;
        $scope.checktable = data.data.dbList;


        /*平账金额*/
        $scope.bmoneyCheck = function(money) {
            //console.log(money);
            $scope.lookBmoney = 0;
            angular.forEach(money, function(value, key) {
                $scope.lookBmoney += value.bmoney;
            });
            return $scope.lookBmoney;
        }

        /*平账备注*/
        $scope.Bcomment = function(remarks) {
            //console.log(remarks);
            $scope.Bremarks = '';
            angular.forEach(remarks, function(value, key) {
                $scope.Bremarks = $scope.Bremarks + '\n' + value.balancingRemark;
                //$scope.BRemark += value.balancingRemark;
            });
            return $scope.Bremarks;
        }

        /*操作记录*/
        $scope.handleRecord = function(record) {
            //console.log(record);
            $scope.operates = '';
            angular.forEach(record, function(value, key) {
                $scope.operates += value.createTime + '\n' + value.createUser;
            });
            if ($scope.operates == null || $scope.operates == undefined || $scope.operates == '') {
                $scope.operates = '无';
            }
            return $scope.operates;
        }

        /*应收金额*/
        $scope.balanceCheck = function(val) {

            //console.log(val);
            var balanceTotal = $scope.bmoneyCheck(val.balancingPoList);
            $scope.receivableMoney = val.collectionDelivery + val.freightCharge + balanceTotal;
            return $scope.receivableMoney;
        }
    });

    /*创建发货单*/
    $http({
        url: 'http://10.143.79.39:8082/ship/findNewBillsByDispatchId?vdId=123123',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {

        }
    }).success(function(newscreate) {
        //console.log(newscreate);
        $scope.newsList = newscreate.data;

        /*平账金额*/
        $scope.newsMoney = function(newmoney) {
            //console.log(newmoney);
            $scope.newsmoney = 0;
            angular.forEach(newmoney, function(value, key) {
                $scope.newsmoney += value.bmoney;
            });
            return $scope.newsmoney;
        }

        /*平账备注*/
        $scope.newsComment = function(newremarks) {
            //console.log(newremarks);
            $scope.newsBremarks = '';
            angular.forEach(newremarks, function(value, key) {
                $scope.newsBremarks = $scope.newsBremarks + '\n' + value.balancingRemark;
                //$scope.BRemark += value.balancingRemark;
            });
            return $scope.newsBremarks;
        }

        /*操作记录*/
        $scope.newsRecord = function(newrecord) {
            //console.log(newrecord);
            $scope.newsoperates = '';
            angular.forEach(newrecord, function(value, key) {
                $scope.newsoperates += value.createTime + '\n' + value.createUser;
            });
            if ($scope.newsoperates == null || $scope.newsoperates == undefined || $scope.newsoperates == '') {
                $scope.newsoperates = '无';
            }
            return $scope.newsoperates;
        }

        /*应收金额*/
        $scope.newsTotal = function(totals) {

            //console.log(totals);
            var newsbalanceTotal = $scope.newsMoney(totals.balancingPoList);
            $scope.newsreceivableMoney = totals.collectionDelivery + totals.freightCharge + newsbalanceTotal;
            return $scope.newsreceivableMoney;
        }

    });

    /*拒签*/
    $http({
        url: 'http://10.143.79.39:8082/ship/findDeniedBillsByDispatchId?vdId=123123',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {

        }
    }).success(function(refuse) {
        //console.log(refuse);
        $scope.RefusalList = refuse.data;

        /*平账金额*/
        $scope.RefusalMoney = function(refusemoney) {
            //console.log(refusemoney);
            $scope.repelmoney = 0;
            angular.forEach(refusemoney, function(value, key) {
                $scope.repelmoney += value.bmoney;
            });
            return $scope.repelmoney;
        }

        /*平账备注*/
        $scope.RefusalComment = function(refuseremarks) {
            //console.log(refuseremarks);
            $scope.repelBremarks = '';
            angular.forEach(refuseremarks, function(value, key) {
                $scope.repelBremarks = $scope.repelBremarks + '\n' + value.balancingRemark;
                //$scope.BRemark += value.balancingRemark;
            });
            return $scope.repelBremarks;
        }

        /*操作记录*/
        $scope.RefusalRecord = function(refuserecord) {
            //console.log(refuserecord);
            $scope.repeloperates = '';
            angular.forEach(refuserecord, function(value, key) {
                $scope.repeloperates += value.createTime + '\n' + value.createUser;
            });
            if ($scope.repeloperates == null || $scope.repeloperates == undefined || $scope.repeloperates == '') {
                $scope.repeloperates = '无';
            }
            return $scope.repeloperates;
        }

        /*应收金额*/
        $scope.RefusalTotal = function(refuse) {

            //console.log(refuse);
            var repelbalanceTotal = $scope.RefusalMoney(refuse.balancingPoList);
            $scope.repelreceivableMoney = refuse.collectionDelivery + refuse.freightCharge + repelbalanceTotal;
            return $scope.repelreceivableMoney;
        }
    })

    /*平账弹出框*/
    $scope.checkPing = false;
    $scope.checkpingBtn = function() {
        $scope.checkPing = true;
    }
    $scope.checkpingCancel = function() {
        $scope.checkPing = false;
    }

    /*收款弹出框*/
    $scope.checkPay = false;
    $scope.checkpayBtn = function() {
        $scope.checkPay = true;
    }
    $scope.checkpayCancel = function() {
        $scope.checkPay = false;
    }

    /*添加发货单弹出框*/
    $scope.checkCar = false;
    $scope.checkaddsalebill = function() {
        $scope.checkCar = true;
    }
    $scope.checkcancel = function() {
        $scope.checkCar = false;
    }
}])

/*回车登记*/
app.controller('back', ['$scope', '$http', function($scope, $http) {
    $scope.backShow = false;
    $scope.backSearch = function() {
        $http({
            url: 'http://10.143.79.39:8082/dispatch/listVdListForReturn',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },
            data: {

            }
        }).success(function(back) {
            $scope.backShow = true;
            console.log(back.data.data);
            $scope.backcarList = back.data.data;
        })
    }

}]);

/*回车登记详情*/
app.controller('backRegister', ['$scope', '$http', function($scope, $http) {

    $http({
        url: 'http://10.143.79.39:8082/dispatch/getVehicleDispatchInfo?id=123123',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {

        }
    }).success(function(data) {
        //console.log(data.data);
        $scope.backsendList = data.data;
        $scope.backtable = data.data.dbList;

        /*平账金额*/
        $scope.bmoneybackDL = function(backmoney) {
            //console.log(backmoney);
            $scope.registerMoney = 0;
            angular.forEach(backmoney, function(value, key) {
                $scope.registerMoney += value.bmoney;
            });
            return $scope.registerMoney;
        }

        /*平账备注*/
        $scope.backRcomment = function(backremarks) {
            //console.log(backremarks);
            $scope.backsBremarks = '';
            angular.forEach(backremarks, function(value, key) {
                $scope.backsBremarks = $scope.backsBremarks + '\n' + value.balancingRemark;
                //$scope.BRemark += value.balancingRemark;
            });
            return $scope.backsBremarks;
        }

        /*操作记录*/
        $scope.backsRecord = function(backrecord) {
            //console.log(backrecord);
            $scope.backoperates = '';
            angular.forEach(backrecord, function(value, key) {
                $scope.backoperates += value.createTime + '\n' + value.createUser;
            });
            if ($scope.backoperates == null || $scope.backoperates == undefined || $scope.backoperates == '') {
                $scope.backoperates = '无';
            }
            return $scope.backoperates;
        }

        /*应收金额*/
        $scope.balancebackDL = function(backtotal) {

            //console.log(backtotal);
            var backbalanceTotal = $scope.bmoneybackDL(backtotal.balancingPoList);
            $scope.backreceivableMoney = backtotal.collectionDelivery + backtotal.freightCharge + backbalanceTotal;
            return $scope.backreceivableMoney;
        }
    });

    /*平账弹出框*/
    $scope.backPing = false;
    $scope.backpingBtn = function() {
        $scope.backPing = true;
    }
    $scope.backpingCancel = function() {
        $scope.backPing = false;
    }

    /*添加发货单弹出框*/
    $scope.backCar = false;
    $scope.backaddsalebill = function() {
        $scope.backCar = true;
    }
    $scope.backcancel = function() {
        $scope.backCar = false;
    }
}]);

/*财务*/
app.controller('cash', ['$scope', '$http', function($scope, $http) {
    $scope.tableShow = false;
    $scope.cashSearch = function() {

        $http({
            url: 'http://10.143.79.39:8082/dispatch/listVdListForReturn',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },
            data: {

            }
        }).success(function(data) {
            $scope.tableShow = true;
            //console.log(data.data.data);
            $scope.carcashList = data.data.data;
        })
    }
}]);


/*财务收款详情*/
app.controller('cashcheck', ['$scope', '$http', function($scope, $http) {

    $http({
        url: 'http://10.143.79.39:8082/dispatch/getVehicleDispatchInfo?id=123123',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {

        }
    }).success(function(cashDe) {
        //console.log(cashDe.data);
        $scope.cashList = cashDe.data;
        $scope.cashseeList = cashDe.data.dbList;

        /*平账金额*/
        $scope.bmoneycashsee = function(cashmoney) {
            //console.log(cashmoney);
            $scope.cashSeeMoney = 0;
            angular.forEach(cashmoney, function(value, key) {
                $scope.cashSeeMoney += value.bmoney;
            });
            return $scope.cashSeeMoney;
        }

        /*平账备注*/
        $scope.cashRcomment = function(cashremarks) {
            //console.log(cashremarks);
            $scope.cashBremarks = '';
            angular.forEach(cashremarks, function(value, key) {
                $scope.cashBremarks = $scope.cashBremarks + '\n' + value.balancingRemark;
                //$scope.BRemark += value.balancingRemark;
            });
            return $scope.cashBremarks;
        }

        /*操作记录*/
        $scope.cashRecord = function(cashrecord) {
            //console.log(cashrecord);
            $scope.cashoperates = '';
            angular.forEach(cashrecord, function(value, key) {
                $scope.cashoperates += value.createTime + '\n' + value.createUser;
            });
            if ($scope.cashoperates == null || $scope.cashoperates == undefined || $scope.cashoperates == '') {
                $scope.cashoperates = '无';
            }
            return $scope.cashoperates;
        }

        /*应收金额*/
        $scope.balancecashsee = function(cashtotal) {

            //console.log(cashtotal);
            var cashbalanceTotal = $scope.bmoneycashsee(cashtotal.balancingPoList);
            $scope.cashreceivableMoney = cashtotal.collectionDelivery + cashtotal.freightCharge + cashbalanceTotal;
            return $scope.cashreceivableMoney;
        }
    })

    /*收款弹出框*/
    $scope.cashPay = false;
    $scope.cashpayBtn = function() {
        $scope.cashPay = true;
    }
    $scope.cashpayCancel = function() {
        $scope.cashPay = false;
    }

    /*添加发货单弹出框*/
    $scope.cashCar = false;
    $scope.cashaddsalebill = function() {
        $scope.cashCar = true;
    }
    $scope.cashcancel = function() {
        $scope.cashCar = false;
    }
}]);

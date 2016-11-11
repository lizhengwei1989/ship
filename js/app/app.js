'use.strict';
var app = angular.module("myApp", ['ui.router', 'base', 'ui.bootstrap']);
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/main/receive/new");
    $stateProvider
        .state('main', {
            url: '/main',
            views: {
                '': {
                    templateUrl: "/tpls/main.html"
                },
                'comHeader@main': {
                    templateUrl: "/tpls/common/header.html"
                },
                'comLeft@main': {
                    templateUrl: "/tpls/receive/receive_left.html"
                },
                'comRight@main': {
                    templateUrl: "/tpls/receive/receive_new.html"
                },

            }
        })
        /*派车*/
        .state("main.sendcar", {
            url: "/sendcar",
            views: {
                'comLeft@main': {
                    templateUrl: "/tpls/sendcar/sendcar_left.html"
                },
                'comRight@main': {
                    templateUrl: "/tpls/sendcar/sendcar_new.html"
                }
            }

        })
        /*派车单查询*/
        .state("main.sendcar.check", {
            url: "/check",
            views: {
                'comRight@main': {
                    templateUrl: "/tpls/sendcar/sendcarcheck.html",
                    controller: 'check'
                }
            }
        })
        /*查看派车单*/
        .state('main.sendcar.checkSend', {
            url: '/checkSend',
            views: {
                'comRight@main': {
                    templateUrl: "/tpls/sendcar/checkSend.html",
                    controller: 'checkSend'
                }
            }

        })
        /*新建派车单*/
        .state("main.sendcar.new", {
            url: "/new",
            views: {
                'comRight@main': {
                    templateUrl: "/tpls/sendcar/sendcar_new.html",
                    controller: "acontrol"
                }
            }
        })

    /*回车登记*/
    .state("main.sendcar.back", {
            url: "/back",
            views: {
                'comRight@main': {
                    templateUrl: "/tpls/sendcar/sendcarback.html",
                    controller: "back"
                }
            }
        })
        /*回车登记查看*/
        .state('main.sendcar.backRegister', {
            url: '/backRegister',
            views: {
                'comRight@main': {
                    templateUrl: '/tpls/sendcar/backRegister.html',
                    controller: 'backRegister'
                }
            }
        })
        /*站点财务收款*/
        .state("main.sendcar.cash", {
            url: "/cash",
            views: {
                'comRight@main': {
                    templateUrl: "/tpls/sendcar/sendcarcash.html",
                    controller: "cash"
                }
            }
        })
        /*财务收款查看*/
        .state('main.sendcar.cashcheck', {
            url: 'cashcheck',
            views: {
                'comRight@main': {
                    templateUrl: '/tpls/sendcar/cashcheck.html',
                    controller: 'cashcheck'
                }
            }
        })

    /*收货*/
    .state("main.receive", {
            url: "/receive",
            views: {
                'comLeft@main': {
                    templateUrl: "/tpls/receive/receive_left.html"
                },
                'comRight@main': {
                    templateUrl: "/tpls/receive/receive_new.html"
                }
            }
        })
        .state("main.receive.check", {
            url: "/check",
            views: {
                'comRight@main': {
                    templateUrl: "/tpls/receive/receivecheck.html",
                    controller: "receivecheck"
                }
            }
        })
        .state("main.receive.new", {
            url: "/new",
            views: {
                'comRight@main': {
                    templateUrl: "/tpls/receive/receive_new.html",
                    controller: "receiveNew"
                }
            }
        })

    /*查看发货单*/
    .state('seeWaybill', {
        url: '/seeWaybill',
        templateUrl: "/tpls/receive/seeWaybill.html",
        controller: "seeWaybill"
    })

    /*打印派车单*/
    .state('printSend', {
        url: '/printSend',
        templateUrl: '/tpls/sendcar/printSend.html'
    })

}])

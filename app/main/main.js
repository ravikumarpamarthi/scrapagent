'use strict';
angular.module('main', [
        'ionic',
        'ionic.rating',
        'ngCordova',
        'ui.router',
        'ngMessages',
        'ngMap',
        'ionic-datepicker',
        'ionic-timepicker',
        'LocalStorageModule',
        'environment',
        'base64',
        'checklist-model',
        'angular-momentjs',
        'chart.js',
        'ui.calendar',
        'ngFileUpload'
    ])
    .config(function($stateProvider, $urlRouterProvider, envServiceProvider, localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('scrapqagent')
            .setStorageType('localStorage')
            .setNotify(true, true);
        /* environment start*/
        var restApi = {
            signup: "/api/registration/agent",
            updateProfile: "/api/agent/profile",
            getProfile: "/api/agent/profile/:aid",
            consumerCategories: "/api/agent/categories",
            otpVerification: "/api/registration/verification",
            login: "/api/auth/login",
            logout: "/api/auth/logout",
            getAbout: "/api/consumer/about",
            getSellRquests: "/api/sells",
            getSlots: "/api/sell/slots/available",
            getSellById: "/api/sell/:id",
            cancelSellRquests: "/api/sell/:cid/cancel",
            uploadFile: "/fileManager/uploadFile",
            saveAddress: "/api/address",
            updateaddress: "/api/updateaddress",
            getAddress: "/api/addresses",
            deleteAddress: "/api/address/:id/deleteaddress",
            getAddressById: "/api/address/:id",
            getImageFileById: "/fileManager/getImageFileById",
            setDefault: "/api/address/:id/default",
            getCalendar: "/api/sell/agent/:agentId/calendar/from/:from/to/:to",
            updateSellItems: "/api/sell/items",
            completeSellItems: "/api/sell/complete",
            declineRequest: "/api/sell/decline",
            ScrapCategories: "/api/categories",
            resetPwd: "/api/registration/pwd",
            reschedule: "/api/sell/reschedule",
            forgotpassword: "/api/registration/:usertext/reset/pwd",
            getBidById: "/api/bid/:id",
            getBids: "/api/bids",
            getOpenBids: "/api/bids/open",
            acceptOpenBid: "/api/bid/accept",
            bulksale: "/api/bulksale",
            getBulkSales: "/api/bulksales?agentid=:aid",


        };
        envServiceProvider.config({
            vars: {
                development: {
                    // apiUrl: 'http://10.80.80.113:9080/scrapq-restcontroller/api/sell/:id',
                    apiUrl: 'http://10.80.80.116:9080/rest',
                    staticUrl: 'http://localhost:3000',
                    restApi: restApi
                },
                localhost: {
                    apiUrl: 'http://localhost:3000',
                    staticUrl: 'http://localhost:3000',
                    restApi: restApi
                },
                qaserver: {
                    apiUrl: 'http://scrapq.digitelenetworks.com/scrapq',
                    staticUrl: 'http://localhost:3000',
                    restApi: restApi
                }
            }
        });

        envServiceProvider.check();
        envServiceProvider.set('qaserver');
        /* environment end*/



        //$urlRouterProvider.otherwise('/main/dashboard');
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('/', {
                url: '/',
                // abstract: true,
                // templateUrl: 'main/templates/menu.html',
                controller: function($state) {
                    $state.go('main.home')
                }
            }).state('main', {
                url: '/main',
                abstract: true,
                templateUrl: 'main/templates/menu.html',
                controller: 'MenuCtrl as menu'
            }).state('main.home', {
                url: '/home',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('main.login', {
                url: '/login',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('main.viewbids', {
                url: '/viewbids',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/viewbids.html',
                        controller: 'ViewbidsCtrl'
                    }
                }
            })
            .state('main.viewinventory', {
                url: '/viewinventory',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/viewinventory.html',
                        controller: 'ViewinventoryCtrl'
                    }
                }
            })
            .state('main.updateScrap', {
                url: '/updateScrap',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/update-scrap.html',
                        controller: 'Update-scrapCtrl'
                    }
                }
            })
            .state('main.pendingAmount', {
                url: '/pendingAmount',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/pending-amount.html',
                        controller: 'Pending-amountCtrl'
                    }
                }
            })
            .state('main.appointmentList', {
                url: '/appointmentList',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/appointment-list.html',
                        controller: 'Appointment-listCtrl'
                    }
                }
            })
            .state('main.appointmentListFilter', {
                url: '/appointmentListFilter/:fromdate/:todate',
                params: {
                    fromdate: null,
                    todate: null,
                },
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/appointment-list-filter.html',
                        controller: 'Appointment-listCtrl'
                    }
                }
            })
            .state('main.manage-address', {
                url: '/manage-address',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/manage-addresses.html',
                        controller: 'Manage-addressesCtrl'
                    }
                }
            })
            .state('main.contactCallCenter', {
                url: '/contactCallCenter',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/contact-callcenter.html',
                        controller: 'Contact-callcenterCtrl'
                    }
                }
            })
            .state('main.bookAppointment', {
                url: '/bookAppointment',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/book-appointment.html',
                        controller: 'Book-appointmentCtrl'
                    }
                }
            })
            .state('main.bookAppointmentPriceList', {
                url: '/bookAppointmentPriceList',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/book-appointment-price-list.html',
                        controller: 'Book-appointment-price-listCtrl'
                    }
                }
            })
            .state('main.forgotpassword', {
                url: '/forgotpassword',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/forgotpassword.html',
                        controller: 'ForgotpasswordCtrl'
                    }
                }
            })
            .state('main.registration', {
                url: '/registration',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/registration.html',
                        controller: 'RegistrationCtrl'
                    }
                }
            }).state('main.dashboard', {
                url: '/dashboard',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/agent-dashboard.html',
                        controller: 'Agent-dashboardCtrl'
                    }
                }
            }).state('main.ngmap', {
                url: '/ngmap',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/ngmap.html',
                        controller: 'NgmapCtrl'
                    }
                }
            }).state('main.edit-address', {
                // cache: false,
                url: '/edit-address/:id',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/ngmap.html',
                        controller: 'NgmapCtrl'
                    }
                }
            })
            .state('main.bookAgentAppointment', {
                url: '/bookAgentAppointment',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/agent-book-appointment.html',
                        controller: 'Agent-book-appointmentCtrl'
                    }
                }
            })
            .state('main.about', {
                url: '/about',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/about.html',
                        controller: 'AboutCtrl'
                    }
                }
            })
            .state('main.otp', {
                url: '/otp',
                params: {
                    queryParams: null
                },
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/otp.html',
                        controller: 'OtpCtrl'
                    }
                }
            }).state('main.catselection', {
                url: '/catselection',
                params: {
                    queryParams: null
                },
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/catselection.html',
                        controller: 'CatSelectionCtrl'
                    }
                }
            }).state('main.myaccount', {
                // cache: false,
                url: '/myaccount',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/myaccount.html',
                        controller: 'MyAccountCtrl'
                    }
                }
            }).state('main.update-sell-items', {
                // cache: false,
                url: '/update-sell-items/:id',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/update-sell-items.html',
                        controller: 'UpdateSellItemsCtrl'
                    }
                }
            }).state('main.sell-items-confirmation', {
                url: '/sell-items-confirmation/:id',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/sell-items-confirmation.html',
                        controller: 'SellItemsConfirmationCtrl'
                    }
                }
            }).state('main.view-bulksales', {
                url: '/view-bulksales',
                views: {
                    'pageContent': {
                        templateUrl: 'main/templates/view-bulksales.html',
                        controller: 'ViewBulksalesCtrl'
                    }
                }
            })
    }).run(function($state, $global, $rootScope, $ionicPlatform, Complaints, $cordovaStatusbar) {

        /* $ionicPlatform.ready(function() {
             if (window.StatusBar) {
                 $cordovaStatusbar.overlaysWebView(true);
                 $cordovaStatusbar.styleHex('#126B2B');
             }
         });*/
        $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            var isLogin = toState.name === 'main.login';
            $global.init();
            $rootScope.$emit('initMenu', "ok");
            if (isLogin) {
                $global.removeLocalItem("authentication");
                $global.removeLocalItem("sellReuestItems");
                $rootScope.$emit('initMenu', "ok");
                return;
            } else {
                var toStateName = toState.name;
                if (toStateName == 'main.faq' || toStateName == 'main.about' || toStateName == 'main.otp' || toStateName == 'main.registration' || toStateName == 'main.forgotpassword') {
                    return;
                }
                if ($global.authentication == null || $global.authentication == undefined || $global.authentication == '') {
                    e.preventDefault();
                    $state.go('main.login');
                    return;
                } /* */

                /*if ($global.feedBackChecked == false) {
                    Complaints.getPendingFeedBacks().then(function(res) {
                        if (res.status == $global.SUCCESS) {
                            if (res.data.feedbacks.length > 0) {
                                e.preventDefault();
                                $state.go('main.fb');
                            } else {
                                $global.feedBackChecked = true;
                            }
                        }
                    });

                }*/

            }
        });
    })

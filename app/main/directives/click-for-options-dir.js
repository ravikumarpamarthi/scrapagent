'use strict';
angular.module('main')
    .directive('clickForOptions', ['$ionicGesture', function($ionicGesture) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $ionicGesture.on('tap', function(e) {

                    var content = element[0].querySelector('.item-content');

                    var buttons = element[0].querySelector('.item-options');

                    if (!buttons) {
                        console.log('There are no option buttons');
                        return;
                    }
                    var buttonsWidth = buttons.offsetWidth;

                    ionic.requestAnimationFrame(function() {
                        content.style[ionic.CSS.TRANSITION] = 'all ease-out .25s';

                        if (!buttons.classList.contains('invisible')) {
                            console.log('close');
                            content.style[ionic.CSS.TRANSFORM] = '';
                            setTimeout(function() {
                                buttons.classList.add('invisible');
                            }, 250);
                        } else {
                            buttons.classList.remove('invisible');
                            content.style[ionic.CSS.TRANSFORM] = 'translate3d(-' + buttonsWidth + 'px, 0, 0)';
                        }
                    });

                }, element);
            }
        };
    }])

import {_, $, Backbone, Marionette, Radio} from '../vendor/vendor';
import {Root} from '../app';
import {referenceHeight} from '../frontpage/scroll_controller';

var eventsChannel = Radio.channel('events');
var $body = $('body');
var wait = 400;
var isFirstLoad = true;

var updateBodyClasses = function() {
    var state = window.history.state;
    $body.attr('data-type', state.type);
};

var setIsFirstLoad = function(val) {
    isFirstLoad = val;
}

var map = function(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

$.extend( $.easing,
    {
        easeOutCubic: function (x, t, b, c, d) {
            return c*((t=t/d-1)*t*t + 1) + b;
        }
    });

var $bodyhtml = $('html, body');
    
var stopScrollAnimation = function() {
    $bodyhtml.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
    $bodyhtml.stop();
}

var animateToScrollPos = function(ix, stopOnScroll = true) {
    var targetScrollPos = ix * referenceHeight;
    $bodyhtml.animate({scrollTop: targetScrollPos}, 400, 'easeOutCubic', function() {
        eventsChannel.trigger('scroll:locked:in', ix);
        if(stopOnScroll){
            $bodyhtml.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
        }
    });		
    if(stopOnScroll){
        $bodyhtml.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
            $bodyhtml.stop();
        });
    }
}

var isVisibleVertical = function(el) {
    var rect = el.getBoundingClientRect();
	if(rect.top <= window.innerHeight && rect.top+rect.height > 0){
		return true;
	}else{
		return false;
	}
}

var isVisible = function(el) {
    var rect = el.getBoundingClientRect();
	if(rect.top <= window.innerHeight && rect.top+rect.height > 0 && rect.left >= 0 && rect.left <= $('body').innerWidth()){
		return true;
	}else{
		return false;
	}
}

var isMidPointVisible = function(el) {
    var rect = el.getBoundingClientRect();
    var midVertical = rect.top + rect.height/2;
    var midHorizontal = rect.left + rect.width/2;
    if(midVertical > 0 && midVertical < window.innerHeight && midHorizontal > 0 && midHorizontal < $('body').innerWidth()){
        return true;
    }
    return false;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
var hidden, visibilityChange; 
var initVisibilityChange = function() {
    // Set the name of the hidden property and the change event for visibility
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    if (typeof document.addEventListener != "undefined" && typeof document[hidden] != "undefined") {
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
}
var handleVisibilityChange = function() {
    if (document[hidden]) {
        eventsChannel.trigger('document:hidden');
    }else{
        eventsChannel.trigger('document:visible');
    }
}

var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
if( isTouchDevice == null ){ isTouchDevice = false; }
// var isTouchDevice = true;

var WebFont = require('webfontloader');
WebFont.load({
    custom: {
        families: ['neue_haas_grotesk']
    },
    active: function(){
        eventsChannel.trigger('font:loaded');
    }
});

var fixedAtY = 0;
var isFixed = false;
var fixBody = function(){
    // fixing body to prevent scrolling of background when cart is opened for example
    if(!isFixed){
        setListenToScroll(false);
        isFixed = true;
        fixedAtY = window.pageYOffset || document.documentElement.scrollTop;
        $('body').css({
            'top': -fixedAtY+'px'
        });

        // use set timeout to prevent glitch in safari
        setTimeout(function() {
            $('body').css('position', 'fixed');
        }, 0);
    }
};

var unfixBody = function(){
    if(isFixed){
        setListenToScroll(true);
        isFixed = false;

        $('body').removeAttr('style');
        $(document).scrollTop(fixedAtY);
    }
};

$(window).on('resize orientationchange', function(){
    eventsChannel.trigger('window:resize');
})

$(document).on('scroll', function(){
    if(window.scrollY >= window.innerHeight){
        eventsChannel.trigger('intro:hidden');
        $('body').addClass('intro-hidden').removeClass('intro-visible');
    }else{
        eventsChannel.trigger('intro:visible');
        $('body').addClass('intro-visible').removeClass('intro-hidden');
    }
});
// trigger scroll on start, so 'intro-visible' or 'intro-hidden' classes are set
$(document).trigger('scroll');

var isDescendant = function(parent, child) {
    if(child == null){
        return false;
    }
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

var WebFont = require('webfontloader');
WebFont.load({
    custom: {
        families: ['neue_haas_grotesk']
    },
    active: function(){
        $('html').addClass('font-loaded');
        eventsChannel.trigger('font:loaded');
    }
});

export {
    updateBodyClasses,
    wait,
    isFirstLoad,
    setIsFirstLoad,
    map,
    animateToScrollPos,
    stopScrollAnimation,
    isVisible,
    initVisibilityChange,
    isTouchDevice,
    fixBody,
    unfixBody,
    isVisibleVertical,
    isDescendant,
    isMidPointVisible
}
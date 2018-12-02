import {_, $, Backbone, Marionette, Radio} from '../vendor/vendor';
import {map, animateToScrollPos, stopScrollAnimation, isFirstLoad, isVisible, isTouchDevice} from '../util/util';

var eventsChannel = Radio.channel('events');

var initFrontpageScroll = function() {
    setReferenceHeight();
    $(window).on('resize', setReferenceHeight);
    if(!isTouchDevice){
        $(window).on('scroll resize', doFrontpageLockinScroll);
    }
    $(window).on('scroll resize', setIxScroll);
}

var referenceHeight = window.innerHeight;
var setReferenceHeight = function() {
    if(window.innerWidth > 700){
        referenceHeight = window.innerHeight;
    }else{
    //     // $m_navbar_h: 60px;
        referenceHeight = window.innerHeight - 60;
    }
}

var lastIx = -1;
var ix = 0;
var setIxScroll = function() {
    var y = window.scrollY;
    // see if current scroll position is greater or smaller than half of referenceHeight * n

    var mod = y % referenceHeight;
    ix = y / referenceHeight;
    ix = parseInt(ix, 10);

    if(mod>referenceHeight/2){
        ix += 1;
    }

    if(ix != lastIx){
        eventsChannel.trigger('scrolled:to:slide', ix);
        if(isTouchDevice){
            eventsChannel.trigger('scroll:locked:in', ix);
        }
    }
    lastIx = ix;
}

var doFrontpageLockinScroll = _.debounce(function() {
    stopScrollAnimation();
    animateToScrollPos(ix);
}, 100);

/**
 * Regex tested and matched against the following userAgents:
 * iPhone
 *   Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X)
 *   AppleWebKit/602.1.50 (KHTML, like Gecko)
 *   CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1
 * iPad
 *   Mozilla/5.0 (iPad; CPU OS 9_0 like Mac OS X)
 *   AppleWebKit/600.1.4 (KHTML, like Gecko)
 *   CriOS/45.0.2454.89 Mobile/13A344 Safari/600.1.4 (000205)
 */

const iOSChromeDetected = /CriOS/.test(navigator.userAgent);

if (iOSChromeDetected) {
	const getHeight = function getComputedHeightFrom(element) {
		const computedHeightString = getComputedStyle(element).height;
		const elementHeight = Number(computedHeightString.replace('px', ''));
		return elementHeight;
	};

	const calculateVh = function calculateVhFrom(elementHeight) {
		const approximateVh = (elementHeight / initialViewportHeight) * 100;
		const elementVh = Math.round(approximateVh);
		return elementVh;
	};

	const setDataAttribute = function setDataAttributeUsing(elementVh, element) {
		const dataAttributeValue = `${elementVh}`;
		element.setAttribute('data-vh', dataAttributeValue);
	};

	const setHeight = function setHeightBasedOnVh(element) {
		const landscape = orientation;
		const vhRatio = Number(element.dataset.vh / 100);
		if (landscape) {
			element.style.height = `${vhRatio * landscapeHeight}px`;
		} else {
			element.style.height = `${vhRatio * portraitHeight}px`;
		}
	};

	const initialize = function initializeDataAttributeAndHeight(element) {
		const elementHeight = getHeight(element);
		const elementVh = calculateVh(elementHeight);
		setDataAttribute(elementVh, element);
		setHeight(element);
	};

	const initialViewportHeight = window.innerHeight;
	const elements = Array.from(document.getElementsByClassName('vh-fix'));
	const statusBarHeight = 20;
	const portraitHeight = screen.height - statusBarHeight;
	const landscapeHeight = screen.width - statusBarHeight;

	window.onload = function() {
		window.addEventListener('orientationchange', function() {
			elements.forEach(setHeight);
		});

		elements.forEach(initialize);
	};
}

export {initFrontpageScroll, referenceHeight};

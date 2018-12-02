import {_, $, Backbone, Marionette, Radio} from '../vendor/vendor';
import {ImageView} from '../sharedviews/imageview';
import {VideoView} from '../sharedviews/videoview';
import {animateToScrollPos} from '../util/util';

var eventsChannel = Radio.channel('events');

var IntroView = Marionette.View.extend({
    className: 'intro-view',
    template: _.template(`
    <svg class="intro-logo" viewBox="0 0 100 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Desktop-Viewport-Copy-33" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-25.000000, -25.000000)">
            <path d="M92.1469192,82.6530245 L92.1496394,92.1496394 L74.8386268,80.575895 L63.6450734,77.3498717 L57.8513207,69.8972636 L57.8513207,61.4045706 L62.6624333,62.7595612 L57.8503606,56.9790895 L57.8503606,48.3743874 L60.8128423,47.9511528 L57.8503606,43.9314648 L57.8503606,29.3864379 L60.4723345,28.5303681 L57.8503606,24.8919912 L57.8503606,15.3252905 L61.9956588,16.519148 L57.8506806,11.0063781 L57.8506806,3.39663717 L61.0333403,4.15477903 L57.8506806,-0.392152 L57.8503606,-7.85036059 L86.2115549,-5.8749994 L92.1464391,0.688576188 L92.1464391,9.64226681 L90.1867592,9.84404327 L92.1469192,12.4733778 L92.1469192,20.4741907 L89.7372826,20.5785192 L92.1469192,23.9309528 L92.1469192,40.4847836 L89.2863658,39.8426512 L92.1437189,43.6528821 L92.1461191,59.8378828 L90.2042007,60.195512 L92.1469192,62.8698102 L92.1469192,78.5832524 L88.9761004,78.689181 L92.1469192,82.6530245 Z M91.163895,24.7573082 L78.5919891,18.5275198 L91.0355645,19.7396188 L91.1621348,19.7517797 L91.1621348,13.5360725 L78.8529704,7.65975304 L91.0355645,8.86625149 L91.163895,8.87857249 L91.163895,1.91224404 L64.7988636,0.0762542223 L64.6753335,0.0677735303 L64.6753335,6.3958099 L78.9326569,13.0781152 L64.6748535,11.630157 L64.6748535,17.7301748 L91.1634149,30.5651421 L91.163895,24.7573082 Z M90.9759116,50.6687986 L91.1629669,50.8155305 L91.1629669,44.3951666 L82.8126855,36.8238288 L91.1624869,39.1620996 L91.1624869,32.4457116 L64.8217775,24.6719572 L64.6737654,24.6279536 L64.6737654,31.6354054 L75.9249235,35.049284 L64.7686531,37.1025716 L64.6744054,37.1192129 L64.6744054,44.4721329 L79.3357618,41.4478861 L90.9759116,50.6687986 Z M91.1635909,70.1871113 L91.1635909,64.5112881 L79.0136395,60.833228 L91.1635909,59.4955188 L91.1635909,52.2493275 L64.8212814,45.1684297 L64.6745494,45.1298666 L64.6745494,50.6884002 L78.8912295,54.8296981 L64.6745494,56.397026 L64.6745494,62.6034524 L91.016859,70.1448678 L91.1635909,70.1871113 Z M91.1633509,83.8524344 L82.0443668,78.1106858 L91.1633509,77.5482399 L91.1633509,70.944181 L75.5566374,73.0416322 L64.6754295,70.1167535 L64.6754295,76.4847932 L75.1518044,79.5116001 L91.1633509,90.380007 L91.1633509,83.8524344 Z" id="Combined-Shape-Copy" fill="#ffffff" transform="translate(75.000000, 42.149639) rotate(-90.000000) translate(-75.000000, -42.149639) "></path>
        </g>
    </svg>
    <div class="intro-video-region"></div>
    <svg class="down-arrow" viewBox="0 0 100 100"><path d="M 10,50 L 60,100 L 70,90 L 30,50  L 70,10 L 60,0 Z" class="arrow" transform="translate(0, 100) rotate(270) "></path></svg>
    `),
    regions: {
        videoRegion: {
            el: '.intro-video-region',
            replaceElement: true
        }
    },
    onRender: function(){
        var videoView = new VideoView({model: this.model, mode: 'fullscreen'});
        this.showChildView('videoRegion', videoView);
    },
    onAttach: function(){
        this.triggerMethod('play:video');
    },
    onPlayVideo: function(){
        this.getRegion('videoRegion').currentView.triggerMethod('play:video');
    },
    onPauseVideo: function(){
        this.getRegion('videoRegion').currentView.triggerMethod('pause:video');        
    },
    radioEvents: {
        events: {
            'intro:hidden': 'onPauseVideo',
            'intro:visible': 'onPlayVideo',
        }
    },
    events: {
        "click": "onClick"
    },
    onClick: function(){
        animateToScrollPos(1);
    },
    initialize: function(){
        // bind radio channel events to a view: https://github.com/marionettejs/backbone.marionette/issues/2956#issuecomment-247823892
        const eventsChannel = Radio.channel('events');
        this.bindEvents(eventsChannel, this.radioEvents.events);
    }
});

export {IntroView};
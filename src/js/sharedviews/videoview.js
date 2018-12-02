import {_, $, Backbone, Marionette, Radio} from '../vendor/vendor';
import {isVisible, isVisibleVertical, isTouchDevice} from '../util/util';
import {SizeToScreenBehavior} from '../behaviors/behaviors';
import {ImageView} from './imageview';
import 'lazysizes';
// unveilhooks extension
/*! lazysizes - v4.0.1 */
!function(a,b){var c=function(){b(a.lazySizes),a.removeEventListener("lazyunveilread",c,!0)};b=b.bind(null,a,a.document),"object"==typeof module&&module.exports?b(require("lazysizes")):a.lazySizes?c():a.addEventListener("lazyunveilread",c,!0)}(window,function(a,b,c){"use strict";function d(a,c){if(!g[a]){var d=b.createElement(c?"link":"script"),e=b.getElementsByTagName("script")[0];c?(d.rel="stylesheet",d.href=a):d.src=a,g[a]=!0,g[d.src||d.href]=!0,e.parentNode.insertBefore(d,e)}}var e,f,g={};b.addEventListener&&(f=/\(|\)|\s|'/,e=function(a,c){var d=b.createElement("img");d.onload=function(){d.onload=null,d.onerror=null,d=null,c()},d.onerror=d.onload,d.src=a,d&&d.complete&&d.onload&&d.onload()},addEventListener("lazybeforeunveil",function(a){if(a.detail.instance==c){var b,g,h,i;a.defaultPrevented||("none"==a.target.preload&&(a.target.preload="auto"),b=a.target.getAttribute("data-link"),b&&d(b,!0),b=a.target.getAttribute("data-script"),b&&d(b),b=a.target.getAttribute("data-require"),b&&(c.cfg.requireJs?c.cfg.requireJs([b]):d(b)),h=a.target.getAttribute("data-bg"),h&&(a.detail.firesLoad=!0,g=function(){a.target.style.backgroundImage="url("+(f.test(h)?JSON.stringify(h):h)+")",a.detail.firesLoad=!1,c.fire(a.target,"_lazyloaded",{},!0,!0)},e(h,g)),i=a.target.getAttribute("data-poster"),i&&(a.detail.firesLoad=!0,g=function(){a.target.poster=i,a.detail.firesLoad=!1,c.fire(a.target,"_lazyloaded",{},!0,!0)},e(i,g)))}},!1))});

var VideoView = Marionette.View.extend({
    className: 'video',
    template: _.template(`
    <video loop muted playsinline preload>
        <source src="<%- url %>" type="video/mp4">
    </video>`),
    behaviors: function(){
        var mode = this.getOption('mode');
        return [
            {
                behaviorClass: SizeToScreenBehavior,
                mode: mode
            }
        ]
    },
    onPauseVideo: function(){
        this.$el.find('video')[0].pause();
    },
    onPlayVideo: function(){
        this.$el.find('video')[0].play();
    },
    onRender: function(){
        this.triggerMethod('size');
    },
    onResize: function(){
        this.triggerMethod('size');
    },  
    radioEvents: {
        events: {
            'window:resize': 'onResize',
        }
    },
    initialize: function(){
        // bind radio channel events to a view: https://github.com/marionettejs/backbone.marionette/issues/2956#issuecomment-247823892
        const eventsChannel = Radio.channel('events');
        this.bindEvents(eventsChannel, this.radioEvents.events);
    }
});

var VideoSimple = Marionette.View.extend({
    className: 'video',
    template: _.template(`
        <video autoplay loop muted playsinline preload>
            <source src="<%- url %>" type="video/mp4">
        </video>
    `)
})

// need ".video-background" to have a dark background while iframe is rendering
var VideoPreviewView = Marionette.View.extend({
    className: 'video-preview',
    template: _.template(`
        <div class="play-video-wrap">
            <svg class="play-video" width="34px" height="50px" viewBox="0 0 34 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g id="Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Mobile" transform="translate(-18.000000, -564.000000)" fill="#FFFFFF">
                        <polygon id="Triangle" points="52 589 18 614 18 564"></polygon>
                    </g>
                </g>
            </svg>
        </div>
        <div class="content-region"></div>
        `
    ),
    ui: {
        content: function(){
            if(isTouchDevice){
                return '.image';
            }else{
                return 'video';
            }
        }
    },
    behaviors: function(){
        var mode = this.getOption('mode');
        return [
            {
                behaviorClass: SizeToScreenBehavior,
                mode: mode
            }
        ]
    },
    regions: {
        content: {
            el: '.content-region',
            replaceElement: true
        }
    },
    events: {
        'click video': 'onContentClick',
        'click .image': 'onContentClick'
    },
    vimeoShown: false,
    onContentClick: function(e){
        e.stopPropagation();
        this.$el.find('.play-video').hide();
        this.$el.append(`
            <div class="iframe-wrap">
                <div class="video-background"></div>
                <iframe src="https://player.vimeo.com/video/`+this.model.get('vimeo_video_id')+`?autoplay=1&loop=1&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
        `);
        
        if(!isTouchDevice){
            this.$el.find('video')[0].pause();
        }

        this.$el.addClass('hide-content');
        this.triggerMethod('size');
        this.vimeoShown = true;
    },
    onPauseVideo: function(){
        if(this.vimeoShown){        
            this.vimeoShown = false;
            this.$el.find('.video-background, .iframe-wrap').remove();
            this.$el.find('.play-video').show();

            this.$el.removeClass('hide-content');

            if(!isTouchDevice){
                this.$el.find('video')[0].pause();
            }
        }
    },
    onPlayVideo: function(){
        if(!this.vimeoShown && !isTouchDevice){
            this.$el.find('video')[0].play();            
        }
    },
    onRender: function(){
        if(isTouchDevice){
            var model = new Backbone.Model(this.model.get('replacement_img'));
            var view = new ImageView({model: model});
            this.showChildView('content', view);
        }else{
            var view = new VideoSimple({model: this.model});
            this.showChildView('content', view);
        }

        this.triggerMethod('size');
    },
    onResize: function(){
        this.triggerMethod('size');
    },  
    radioEvents: {
        events: {
            'window:resize': 'onResize',
        }
    },
    initialize: function(){
        // bind radio channel events to a view: https://github.com/marionettejs/backbone.marionette/issues/2956#issuecomment-247823892
        const eventsChannel = Radio.channel('events');
        this.bindEvents(eventsChannel, this.radioEvents.events);
    }
});

export {VideoView, VideoPreviewView};
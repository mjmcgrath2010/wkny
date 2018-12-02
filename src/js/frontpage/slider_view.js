import {_, $, Backbone, Marionette, Radio} from '../vendor/vendor';
import {ImageView} from '../sharedviews/imageview';
import {VideoPreviewView} from '../sharedviews/videoview';
import Flickity from 'flickity';
import {isTouchDevice, isVisible, isVisibleVertical, isMidPointVisible} from '../util/util';
import 'lazysizes';

const eventsChannel = Radio.channel('events');

var SliderChildView = Marionette.View.extend({
    className: 'slider-child-view',
    template: _.template(`
        <div class="slide-content-region"></div>
        <div class="bottom-right slider-counter"></div>
        <div class="slide-text-background"></div>
        <div class="prev-slider-button"></div>
        <div class="next-slider-button"></div>
    `),
    triggers: {
        'click .prev-slider-button': 'prev:click',
        'click .next-slider-button': 'next:click',
        'mouseenter .prev-slider-button': 'prev:mouseenter',
        'mouseleave .next-slider-button': 'next:mouseleave',
        'mouseenter .next-slider-button': 'next:mouseenter',
        'mouseleave .prev-slider-button': 'prev:mouseleave'
    },
    onPrevClick: function(){

    },
    onNextClick: function(){

    },
    regions: {
        content: {
            el: '.slide-content-region',
            replaceElement: true
        }
    },
    onRender: function(){
        var view;
        switch(this.model.get('acf_fc_layout')){
            case 'image':
                var model = new Backbone.Model(this.model.get('image'));
                view = new ImageView({model: model, mode: 'fit'});
            break;
            case 'video':
                var vimeo_video_id = this.model.get('vimeo_video_id');
                var replacement_img = this.model.get('mobile_preview_video_replacement_image');

                var model = new Backbone.Model(this.model.get('preview_video'));
                model.set({
                    'vimeo_video_id': vimeo_video_id,
                    'replacement_img': replacement_img
                });

                view = new VideoPreviewView({model: model, mode: 'fit'});
            break;
        }
        this.showChildView('content', view);
    }
});

// slider view
var SliderCollectionView = Marionette.CollectionView.extend({
    className: 'slider-collection-view',
    childView: SliderChildView,
    flkty: null,
    childViewEvents: {
        'prev:click': 'onPrevClick',
        'next:click': 'onNextClick',
    },
    onPrevClick: function(){
        this.flkty.previous();
    },
    onNextClick: function(){
        this.flkty.next();
    },
    onAttach: function(){
        var el = this.el;
        var $el = this.$el;
        var thisView = this;

        this.flkty = new Flickity( el, {
            cellSelector: '.slider-child-view',
            accessibility: false,
            setGallerySize: false,
            cellAlign: 'center',
            prevNextButtons: false,
            pageDots: false,
            contain: true,
            draggable: (isTouchDevice || window.innerWidth < 700),
            wrapAround: true,
            prevNextButtons: false,
            dragThreshold: 10
        });

        this.flkty.on('select', function(){
            var flkty_index = thisView.flkty.selectedIndex;
            thisView.children.each(function(view, index){
                if(flkty_index == index){
                    view.getRegion('content').currentView.triggerMethod('play:video');
                }else{
                    view.getRegion('content').currentView.triggerMethod('pause:video');
                }
            });
        });

        this.flkty.on('select', function(){
            var flkty_index = thisView.flkty.selectedIndex;
            thisView.triggerMethod('slide:select', flkty_index);
        });
    },
    onDestroy: function(){
        
    }
});

var SliderView = Marionette.View.extend({
    className: 'slider-view',
    template: _.template(`
        <img src="<%- client_svg.url %>" class="client-logo">
        <div class="slider-collection-region"></div>
        <div class="bottom-left">
            <span class="client _client"><%- client %>: </span><span class="caption _Default"></span>
        </div>
        <svg class="prev-button" width="18px" height="32px" viewBox="0 0 18 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-menu-open" transform="translate(-23.000000, -428.000000)" stroke="#000000" stroke-width="2">
                    <polyline id="Path-2" transform="translate(32.500000, 444.000000) rotate(-180.000000) translate(-32.500000, -444.000000) " points="25 429 40 444.318087 25.6229633 459"></polyline>
                </g>
            </g>
        </svg>
        <svg class="next-button" width="18px" height="32px" viewBox="0 0 18 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-menu-open" transform="translate(-1396.000000, -428.000000)" stroke="#000000" stroke-width="2">
                    <polyline id="Path-2" points="1397 429 1412 444.318087 1397.62296 459"></polyline>
                </g>
            </g>
        </svg>

        <div class="bottom-right counter _Default"></div>
    `),
    childViewEvents: {
        'slide:select': 'onSlideSelected'
    },
    events: {
        'click .prev-button': 'onPrevClick',
        'click .next-button': 'onNextClick',
        'mousemove': 'onMouseMove'
    },
    onMouseMove: function(e){
        var x = e.clientX;
        var y = e.clientY;
        var el = document.elementFromPoint(x, y);
        if(el.classList == "prev-slider-button"){
            this.$el.find('.prev-button').addClass('show');
            this.$el.find('.next-button').removeClass('show');
        }
        else if(el.classList == "next-slider-button"){
            this.$el.find('.prev-button').removeClass('show');
            this.$el.find('.next-button').addClass('show');            
        }else{
            this.$el.find('.prev-button').removeClass('show');
            this.$el.find('.next-button').removeClass('show');
        }
    },
    onPrevClick: function(e){
        this.getRegion('collection').currentView.triggerMethod('prev:click');
    },
    onNextClick: function(){
        this.getRegion('collection').currentView.triggerMethod('next:click');
    },
    regions: {
        collection: {
            el: '.slider-collection-region',
            replaceElement: true
        }
    },
    onSlideSelected: function(ix){
        this.triggerMethod('set:caption', ix);
        this.triggerMethod('set:counter', ix);
        lazySizes.loader.checkElems();
    },
    onSetCaption: function(ix){
        var text = this.model.get('media')[ix].caption;
        this.$el.find('.caption').text(text);
    },
    onSetCounter: function(ix){
        var length = this.model.get('media').length;
        var ix = ix+1;
        this.$el.find('.counter').text(ix+' of '+length);
    },
    onRender: function(){
        this.triggerMethod('set:caption', 0);
        this.triggerMethod('set:counter', 0);
        var collection = new Backbone.Collection(this.model.get('media'));
        var sliderCollectionView = new SliderCollectionView({collection: collection});
        this.showChildView('collection', sliderCollectionView);
        bindPlayPauseSliderVideosOnScroll(sliderCollectionView);        
    }
});

var bindPlayPauseSliderVideosOnScroll = function(sliderCollectionView){
    $(window).on('scroll resize', function(){
        sliderCollectionView.children.each(function(view){
            var contentView = view.getRegion('content').currentView;

            if(contentView.$el.hasClass('video-preview') && !isTouchDevice){
                if(isMidPointVisible(contentView.$el.find('video')[0])){
                    contentView.triggerMethod('play:video');
                }else{
                    contentView.triggerMethod('pause:video');
                }
            }
        })
    });
}

export {SliderView};
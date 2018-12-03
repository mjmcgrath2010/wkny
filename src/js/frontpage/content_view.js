import {_, $, Backbone, Marionette, Radio} from '../vendor/vendor';
import {ImageView} from '../sharedviews/imageview';
import {VideoView} from '../sharedviews/videoview';
import {SliderView} from './slider_view';

var eventsChannel = Radio.channel('events');

var ContentChildView = Marionette.View.extend({
    className: 'content-child-view',
    template: _.template(`
        <div class="slider-region"></div>
    `),
    regions: {
        slider: {
            el: '.slider-region',
            replaceElement: true
        }
    },
    onRender: function(){
        var sliderView = new SliderView({model: this.model});
        this.showChildView('slider', sliderView);
    },
    onAttach: function(){
        eventsChannel.trigger('content:attached');
    }

});

var ContentCollectionView = Marionette.CollectionView.extend({
    className: 'content-collectionview',
    childView: ContentChildView,
    onScrolledTo: function(ix){
        ix = ix-1;
        this.children.each(function(view, index){
            if(index == ix){
                view.$el.addClass('active');
            }else{
                view.$el.removeClass('active');
            }
        });
    },
    radioEvents: {
        events: {
            'scroll:locked:in': 'onScrolledTo',
        }
    },
    initialize: function(){
        // bind radio channel events to a view: https://github.com/marionettejs/backbone.marionette/issues/2956#issuecomment-247823892
        const eventsChannel = Radio.channel('events');
        this.bindEvents(eventsChannel, this.radioEvents.events);
    }
});

var ContentView = Marionette.View.extend({
    className: 'content-view',
    template: _.template(`
        <div class="content-collection-region"></div>
    `),
    regions: {
        contentCollectionRegion: {
            el: '.content-collection-region',
            replaceElement: true
        }
    },
    onRender: function(){
        var collection = new Backbone.Collection(this.model.get('content'));
        // console.log(collection);
        var collectionView = new ContentCollectionView({collection: collection});
        this.showChildView('contentCollectionRegion', collectionView);
    }
});

export {ContentView};

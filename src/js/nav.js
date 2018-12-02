import {_, $, Backbone, Marionette, Radio} from './vendor/vendor';
import {Root} from './app';
import {animateToScrollPos} from './util/util';

var selectNavItemsContinuously = true;
var eventsChannel = Radio.channel('events');

var NavItem = Marionette.View.extend({
    className: 'nav-item',
    template: _.template(`<img src="<%- client_svg.url %>" alt="<%- client_svg.alt %>">`),
    onClick: function(){
        selectNavItemsContinuously = false;
        setTimeout(function(){
            selectNavItemsContinuously = true;
        }, 400);
        $('.nav-item').removeClass('active');
        var ix = this.$el.index();
        ix++;
        animateToScrollPos(ix);
        // close menu when on mobile view
        if(window.innerWidth < 700){
            Root.triggerMethod('toggle:menu');
        }
    },
    events:{
        "click": "onClick"
    },
    onSelect: function(){
        this.$el.addClass('active');
    },
    onUnselect: function(){
        this.$el.removeClass('active');
    }
});

var NavView = Marionette.CollectionView.extend({
    className: 'nav-items',
    childView: NavItem,
    radioEvents: {
        events: {
            'scroll:locked:in': 'onScrolledTo',
            'scrolled:to:slide': 'onContinuousScrolledTo'
        }
    },
    onContinuousScrolledTo: function(ix){
        if(selectNavItemsContinuously){
            this.triggerMethod('scrolled:to', ix);            
        }
    },
    onScrolledTo: function(ix){
        ix = ix-1;
        this.children.each(function(view, index){
            if(index == ix){
                view.triggerMethod('select');
            }else{
                view.triggerMethod('unselect');
            }
        });
    },
    initialize: function(){
        // bind radio channel events to a view: https://github.com/marionettejs/backbone.marionette/issues/2956#issuecomment-247823892
        const eventsChannel = Radio.channel('events');
        this.bindEvents(eventsChannel, this.radioEvents.events);
    }
});

eventsChannel.on('data:fetched', function(data){
    initNav(data);
});

var initNav = function(data) {
    var collection = new Backbone.Collection(data.content);
    var navView = new NavView({collection: collection});

    Root.showChildView('nav', navView);
}
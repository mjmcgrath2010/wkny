import {_, $, Backbone, Marionette, Radio} from '../vendor/vendor';
import {SizeToScreenBehavior} from '../behaviors/behaviors';
import 'lazysizes';

lazySizesConfig.hFac = 1.5;
lazySizesConfig.expFactor = 3;

var sizes = ['_512', '_768', '_1024', '_1280', '_1920'];

var ImageView = Marionette.View.extend({
    className: 'image',
    template: _.template(`<img class="lazyload" data-src="<%- url %>" sizes="<%- sizesAttr %>" data-srcset="<%- srcset() %>" alt="<%- alt %>">`),
    templateContext: function() {
        return{
            srcset: function(){
                var arr = [];
                for(var i=0; i<sizes.length; i++){
                    if(typeof this.sizes[sizes[i]] != "undefined"){
                        arr.push(this.sizes[sizes[i]] + ' ' + sizes[i].substr(1)+'w');                        
                    }
                }
                return arr.join(', ');
            },
            sizesAttr: this.getOption('sizesAttr')
        }
    },
    behaviors: function(){
        var mode = this.getOption('mode');
        var enlarge = this.getOption('enlarge');
        return [
            {
                behaviorClass: SizeToScreenBehavior,
                mode: mode,
                enlarge : enlarge
            }
        ]
    },
    onRender: function(){
        this.triggerMethod('size');
    },
    radioEvents: {
        events: {
            'window:resize': 'onSize',
        }
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

export {ImageView};
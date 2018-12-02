import {_, $, Backbone, Marionette, Radio} from '../vendor/vendor';
import {Root} from '../app';
import {IntroView} from './intro_view';
import {ContentView} from './content_view';
import {initFrontpageScroll} from './scroll_controller';
import {updateBodyClasses} from '../util/util';

var eventsChannel = Radio.channel('events');

var FrontpageView = Marionette.View.extend({
    className: 'frontpage-view',
    template: _.template(`
        <div id="intro-region"></div>
        <div id="content-region"></div>
    `),
    regions: {
        intro: {
            el: '#intro-region',
            replaceElement: true
        },
        content: {
            el: '#content-region',
            replaceElement: true
        }
    },
    onRender: function(){
        var intro_data = this.model.get('intro');
        var model = new Backbone.Model(intro_data);
        var intro = new IntroView({model: model});
        this.showChildView('intro', intro);

        var content_data = this.model.get('content');
        model = new Backbone.Model({'content': content_data});
        var content = new ContentView({model: model});
        this.showChildView('content', content);

        initFrontpageScroll();
    }
})

var initFrontpage = function(data) {
    var model = new Backbone.Model(data);
    var view = new FrontpageView({model: model});
    Root.showChildView('frontpage', view);
}

eventsChannel.on('data:fetched', function(data){
    initFrontpage(data);
});
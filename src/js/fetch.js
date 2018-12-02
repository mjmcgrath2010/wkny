import {_, $, Backbone, Marionette, Radio} from './vendor/vendor';

var eventsChannel = Radio.channel('events');

var fetchData = function() {
    $.getJSON('/wp-json/wkny/v1/frontpage/', function(data){
        eventsChannel.trigger('data:fetched', data);
    }); 
}

export {fetchData};
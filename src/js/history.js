import {$, Radio, _} from './vendor/vendor';
import {setIsFirstLoad, updateBodyClasses} from './util/util';

var $body = $('body');
var eventsChannel = Radio.channel('events');

var currentState = null;
var lastState = {
    slug: '',
    type: ''
};
var getLastState = function() {
    return lastState;
}

var replaceState = function() {
    // init history
    var title = $('title').text();

    var stateObj = {};
    stateObj.type = $body.attr('data-type');

    window.history.replaceState(stateObj, title, window.location);
    handleStatechange(stateObj);
    lastState = window.history.state;            
};

var pushState = function(stateObj, title, href){
    setIsFirstLoad(false);
    lastState = window.history.state;
    window.history.pushState(stateObj, title, href);
    handleStatechange(stateObj);
};

var bindPopState = function(){
    window.addEventListener('popstate', function(event){
        setIsFirstLoad(false);
        lastState = currentState;
        handleStatechange(event.state);
    });
};

var handleStatechange = function(state){
    // if last and current state are the same, don't do anything
    if(state.type == lastState.type && state.slug == lastState.slug){
        return;
    }
    
    eventsChannel.trigger('handle:statechange', lastState, window.history.state);    
    
    currentState = window.history.state;
    updateBodyClasses();
    switch(currentState.type){
        case 'frontpage':
            
        break;
    }
    
}

var initHistory = function() {
    replaceState();
    bindPopState();
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }
    
}

export {initHistory, pushState, getLastState};
import {_, $, Backbone, Marionette} from '../vendor/vendor';
import {Root} from '../app'; 
import 'jquery.waitforimages';

const AddLoadedClassToImageBehavior = Marionette.Behavior.extend({
    onAttach: function(){
        // Using the jQuery promises API, you can then use the progress() method to know when an individual image has been loaded.
        this.view.$el.waitForImages().progress(function(loaded, count, success) {
            $(this).addClass('loaded');
        });
    }
});

const SizeToScreenBehavior = Marionette.Behavior.extend({
    onSize: function(){
        // console.log(this.getOption('mode'));
        var w_w = $('body').innerWidth();
        var w_h = window.innerHeight;      
        
        var this_w = this.view.model.get('width');
        var this_h = this.view.model.get('height');

        var this_ar = this_w/this_h;

        // max size in percentage
        var target_width, target_height;        
        var bool = true;
        var mode = window.innerWidth < 700 ? 'fullscreen' : this.getOption('mode'); 
        switch(mode){
            case 'fullscreen':
                target_width = $('body').innerWidth();
                target_height = window.innerHeight;

                var w_ar = w_w/w_h;

                bool = this_ar<w_ar;
            break;
            case 'fit':
                // 82 is height of navbar
                target_width = $('body').innerWidth() - 82 * 2;
                target_height = window.innerHeight - 82 * 2;

                var w_ar = (w_w-82*2)/(w_h-82*2);

                bool = this_ar>w_ar;
            break;
        }

        // console.log(this.getOption('enlarge'));

        var enlarge = typeof this.getOption('enlarge') != "undefined" ? this.getOption('enlarge') : 0;

        if(bool){
            target_width += enlarge;
            target_height = this_h / this_w * target_width;
        }else{
            target_height += enlarge;
            target_width = this_w / this_h * target_height;
        }

        $(this.view.el.children).css({
            'width': target_width+'px',
            'height': target_height+'px',
            'position': 'absolute',
            'transform': 'translate(-50%, -50%)',
            'top': '50%',
            'left': '50%'
        });

        if(window.innerWidth < 700){
            this.view.$el.find('.play-video-wrap').css({
                'width': window.innerWidth,
                'height': window.innerHeight
            });
        }
    }
});

export {AddLoadedClassToImageBehavior, SizeToScreenBehavior};
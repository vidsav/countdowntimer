;(function ($, window, document, undefined) {
  var pluginName = "countdown360",
    defaults = {
      radius: 15.5,                    // radius of arc
      strokeStyle: "#000",          // the color of the stroke
      strokeWidth: 25,          // the stroke width, dynamically calulated if omitted in options
      fillStyle: "rgba(255, 255, 255, 0)",            // the fill color
  
        completestrokeStyle: "red",     // the color of stroke when the time is low
        completefontColor: "#FF0000",
      fontColor: "rgba(255, 255, 255, 0)",             // the font color
      fontFamily: "sans-serif",        // the font family
      fontSize: undefined,             // the font size, dynamically calulated if omitted in options
      fontWeight: 400,                 // the font weight
      autostart: true,                 // start the countdown automatically
      seconds: 10,                     // the number of seconds to count down
    //timeformat: 'MMSS',            // format of count label (SS, or MMSS)
      label: ["second", "seconds"],    // the label to use or false if none
      startOverAfterAdding: true,      // Start the timer over after time is added with addSeconds
      smooth: true,                   // should the timer be smooth or stepping
      onComplete: function () {
          return Plugin;
      }
    };

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    if (!this.settings.fontSize) { this.settings.fontSize = this.settings.radius/1.2; }
    if (!this.settings.strokeWidth) { this.settings.strokeWidth = this.settings.radius/4; }  
    this._defaults = defaults;
    this._name = pluginName;
    this._init();
  }

  Plugin.prototype = {
    getTimeRemaining: function()
    {
    
      var timeRemaining = this._secondsLeft(this.getElapsedTime());
      return timeRemaining;
    },
    getElapsedTime: function()
    {
      return  Math.round((new Date().getTime() - this.startedAt.getTime())/1000);
    },
    extendTimer: function (value) {
      var seconds = parseInt(value),
          secondsElapsed = Math.round((new Date().getTime() - this.startedAt.getTime())/1000);
      if ((this._secondsLeft(secondsElapsed) + seconds) <= this.settings.seconds) {
        this.startedAt.setSeconds(this.startedAt.getSeconds() + parseInt(value));
      }
    },

    addSeconds: function (value) {
      var secondsElapsed = Math.round((new Date().getTime() - this.startedAt.getTime())/1000);
      if (this.settings.startOverAfterAdding) {
          this.settings.seconds = this._secondsLeft(secondsElapsed) + parseInt(value);
          this.start();
        } else {
          this.settings.seconds += parseInt(value);
        }
    },

    start: function () {
      this.startedAt = new Date();
      this._drawCountdownShape(Math.PI*3.5, true);
      this._drawCountdownLabel(0);
      var timerInterval = 1000;
        this.settings.fontColor;
      if (this.settings.smooth) {
        timerInterval = 16;
      }
      this.interval = setInterval(jQuery.proxy(this._draw, this), timerInterval);
    },

    stop: function (cb) {
      clearInterval(this.interval);
      if (cb) { cb(); }
    },

    _init: function () {
      this.settings.width = (this.settings.radius * 2) + (this.settings.strokeWidth * 2);
      this.settings.height = this.settings.width;
      this.settings.arcX = this.settings.radius + this.settings.strokeWidth;
      this.settings.arcY = this.settings.arcX;
      this._initPen(this._getCanvas());
      if (this.settings.autostart) { this.start(); }
    },

    _getCanvas: function () {
      var $canvas = $("<canvas id=\"countdown360_" + $(this.element).attr("id") + "\" width=\"" +
                      this.settings.width + "\" height=\"" +
                      this.settings.height + "\">" +
                      "<span id=\"countdown-text\" role=\"status\" aria-live=\"assertive\"></span></canvas>");
      $(this.element).prepend($canvas[0]);
      return $canvas[0];
    },

    _initPen: function (canvas) {
      this.pen              = canvas.getContext("2d");
      this.pen.lineWidth    = this.settings.strokeWidth;
      this.pen.strokeStyle  = this.settings.strokeStyle;
      this.pen.fillStyle    = this.settings.fillStyle;
      
      this.pen.textAlign    = "center";
      this.pen.textBaseline = "middle";
      this.ariaText = $(canvas).children("#countdown-text");
      this._clearRect();
    },

    _clearRect: function () {
      this.pen.clearRect(0, 0, this.settings.width, this.settings.height);
    },

    _secondsLeft: function(secondsElapsed) {
      return this.settings.seconds - secondsElapsed;
    },

    _drawCountdownLabel: function (secondsElapsed) {
      this.ariaText.text(secondsLeft);
      this.pen.font         = this.settings.fontWeight + " " + this.settings.fontSize + "px " + this.settings.fontFamily;
      var secondsLeft = this._secondsLeft(secondsElapsed),
          label = secondsLeft === 1 ? this.settings.label[0] : this.settings.label[1],
          drawLabel = this.settings.label && this.settings.label.length === 2,
          x = this.settings.width/2;
      if (drawLabel) {
        y = this.settings.height/2 - (this.settings.fontSize/6.2);
      } else {
        y = this.settings.height/2;
      }
        if ( secondsLeft <=20) {
           this.pen.strokeStyle = this.settings.completestrokeStyle;
            this.settings.fontColor = this.settings.completefontColor;
            
       } else {
           this.pen.strokeStyle = this.settings.strokeStyle;
           this.pen.font = this.settings.fontColor;
       }
        
        if( secondsLeft >=8) {
            this.settings.fontColor = this.settings.fontColor;
        }
        
        if(secondsLeft ==0){
            $(".blink_me").css({"display": "inline-block"});
              
          }else{
            $(".blink_me").css({"display": "none"});
          }
       if(secondsLeft <=120){
            $(".timer-200").css({"display": "none"});
              }
        if(secondsLeft <=5){
           $(".audioDemo").trigger('play');
              
           }
        
        if(secondsLeft ==0){
           $(".audioDemo").trigger('pause');  
        }
        if(secondsLeft ==20){
               $(".audioDemo").trigger('play');
             
           }
//        if(secondsLeft ==4){
//           $(".audioDemo").trigger('play');
//           };
//        if(secondsLeft ==3){
//           $(".audioDemo").trigger('play');
//           };
//        if(secondsLeft ==2){
//           $(".audioDemo").trigger('play');
//           };
//        if(secondsLeft ==1){
//           $(".audioDemo").trigger('play');
//           };
      this.pen.fillStyle = this.settings.fillStyle; 
      this.pen.fillText(secondsLeft + 1, x, y);
      this.pen.fillStyle  = this.settings.fontColor;
      this.pen.fillText(secondsLeft, x, y);  
      //this.pen.fillText(this._timeFormat(secondsLeft, this.settings.timeformat), x, y);
      if (drawLabel) {
        this.pen.font = "normal small-caps " + (this.settings.fontSize/3) + "px " + this.settings.fontFamily;
        this.pen.fillText(label, this.settings.width/2, this.settings.height/2 + (this.settings.fontSize/2.2));
      }
    },
      
//    _timeFormat: function (secondsLeft, format) {
//      switch(format) {
//      case 'MMSS':
//        var minutes = Math.floor(secondsLeft / 60);
//        var seconds = secondsLeft - (minutes * 60);
//        if (minutes < 10) {minutes = "0"+minutes;}
//        if (seconds < 10) {seconds = "0"+seconds;}
//        return minutes+':'+seconds;
//      case 'SS':
//        return secondsLeft;
//      default:
//        return secondsLeft;     
//      }
//    },    

    _drawCountdownShape: function (endAngle, drawStroke) {
      this.pen.fillStyle = this.settings.fillStyle;
      this.pen.beginPath();
      this.pen.arc(this.settings.arcX, this.settings.arcY, this.settings.radius, Math.PI*1.5, endAngle, false);
      this.pen.fill();
        if(secondsLeft =0){
            this._drawCountdownShape(Math.PI*3.5, true);
        }
        
      if (drawStroke) { this.pen.stroke(); }
    },

    _draw: function () {
      var millisElapsed, secondsElapsed;
      millisElapsed = new Date().getTime() - this.startedAt.getTime();
      secondsElapsed = Math.floor((millisElapsed)/1000);
        endAngle = (Math.PI*3.5) - (((Math.PI*2)/(this.settings.seconds * 1000)) * millisElapsed);
        startAngle =  (Math.PI*3.5)
      this._clearRect();
      this._drawCountdownShape(Math.PI*3.5, false);
      if (secondsElapsed < this.settings.seconds) {
        this._drawCountdownShape(endAngle, true);
        this._drawCountdownLabel(secondsElapsed);
      } else {
        this._drawCountdownLabel(this.settings.seconds);
        this.stop();
        this.settings.onComplete();
      }
    }

  };

  $.fn[pluginName] = function (options) {
    var plugin;
    this.each(function() {
      plugin = $.data(this, "plugin_" + pluginName);
      if (!plugin) {
        plugin = new Plugin(this, options);
        $.data(this, "plugin_" + pluginName, plugin);
      }
    });
    return plugin;
  };

})(jQuery, window, document);
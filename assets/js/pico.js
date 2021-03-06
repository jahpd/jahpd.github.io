(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Pico = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Pico = require("./pico");
var WebAudioPlayer = require("./player/web-audio-player");
var FlashFallbackPlayer = require("./player/flash-fallback-player");

if (WebAudioPlayer.isEnabled) {
  Pico.bind(WebAudioPlayer);
} else {
  FlashFallbackPlayer.fallback(Pico);
}

module.exports = Pico;
},{"./pico":2,"./player/flash-fallback-player":3,"./player/web-audio-player":4}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Processor = require("./processor");

var processor = new Processor();

var Pico = (function () {
  function Pico() {
    _classCallCheck(this, Pico);
  }

  _createClass(Pico, [{
    key: "bind",
    value: function bind(klass) {
      processor.bind(klass);
    }
  }, {
    key: "play",
    value: function play(audioprocess) {
      processor.play(audioprocess);
    }
  }, {
    key: "pause",
    value: function pause() {
      processor.pause();
    }
  }, {
    key: "env",
    get: function get() {
      return processor.env;
    }
  }, {
    key: "sampleRate",
    get: function get() {
      return processor.sampleRate;
    }
  }, {
    key: "bufferSize",
    get: function get() {
      return processor.bufferSize;
    }
  }, {
    key: "isPlaying",
    get: function get() {
      return processor.isPlaying;
    }
  }]);

  return Pico;
})();

module.exports = new Pico();
},{"./processor":5}],3:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SWFID = "PicoFlashFallbackPlayer" + Date.now();

var FlashFallbackPlayer = (function () {
  function FlashFallbackPlayer(processor) {
    _classCallCheck(this, FlashFallbackPlayer);

    this.env = "flashfallback";
    this.sampleRate = 44100;
    this.bufferLength = 2048;
    this.processor = processor;

    this._timerId = 0;
    this._timerAPI = global;
  }

  _createClass(FlashFallbackPlayer, [{
    key: "play",
    value: function play() {
      var _this = this;

      if (FlashFallbackPlayer.swf && this._timerId === 0) {
        (function () {
          var processor = _this.processor;
          var bufferLength = _this.bufferLength;
          var bufL = new Float32Array(bufferLength);
          var bufR = new Float32Array(bufferLength);
          var out = new Array(bufferLength * 2);
          var written = 0;
          var startTime = Date.now();
          var writtenIncr = bufferLength / _this.sampleRate * 1000;

          _this._timerId = _this._timerAPI.setInterval(function () {
            if (written < Date.now() - startTime) {
              var x = undefined;

              processor.process(bufL, bufR);

              for (var i = 0, j = 0; i < bufferLength; i++) {
                x = bufL[i] * 16384 + 32768 | 0;
                x = Math.max(16384, Math.min(x, 49152));
                out[j++] = String.fromCharCode(x);

                x = bufR[i] * 16384 + 32768 | 0;
                x = Math.max(16384, Math.min(x, 49152));
                out[j++] = String.fromCharCode(x);
              }

              FlashFallbackPlayer.swf.write(out.join(""));

              written += writtenIncr;
            }
          }, 25);
          FlashFallbackPlayer.swf.play();
        })();
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (FlashFallbackPlayer.swf && this._timerId !== 0) {
        this._timerAPI.clearInterval(this._timerId);
        this._timerId = 0;
        FlashFallbackPlayer.swf.pause();
      }
    }
  }]);

  return FlashFallbackPlayer;
})();

function getPicoSwfUrl() {
  var scripts = global.document.getElementsByTagName("script");

  for (var i = 0; i < scripts.length; i++) {
    var matched = scripts[i].src.match(/^(.*\/)pico(?:\.min)?\.js$/);

    if (matched) {
      return matched[1] + "pico.swf";
    }
  }
  return "pico.swf";
}

function createFlashContainer(swfId) {
  var container = global.document.createElement("div");
  var object = global.document.createElement("object");
  var param = global.document.createElement("param");

  param.setAttribute("name", "allowScriptAccess");
  param.setAttribute("value", "always");

  object.id = swfId;
  object.classid = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";
  object.width = 1;
  object.height = 1;
  object.setAttribute("data", getPicoSwfUrl() + "?" + Date.now());
  object.setAttribute("type", "application/x-shockwave-flash");

  container.style.position = "fixed";
  container.style.left = 0;
  container.style.top = 0;
  container.style.width = "1px";
  container.style.height = "1px";

  object.appendChild(param);
  container.appendChild(object);

  return container;
}

FlashFallbackPlayer.fallback = function (Pico) {
  global.picojs$flashfallback = function () {
    Pico.bind(FlashFallbackPlayer);
    delete global.picojs$flashfallback;
  };

  global.window.addEventListener("load", function () {
    global.document.body.appendChild(createFlashContainer(SWFID));
    FlashFallbackPlayer.swf = global.document.getElementById(SWFID);
  });
};

module.exports = FlashFallbackPlayer;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Driver = require("pico.driver.webaudio");
var AudioContext = global.AudioContext || global.webkitAudioContext;

var WebAudioPlayer = (function () {
  function WebAudioPlayer(processor) {
    _classCallCheck(this, WebAudioPlayer);

    this._driver = new Driver();
    this._driver.setup({ context: new AudioContext(), bufferLength: 2048 });
    this._driver.processor = processor;

    this.env = "webaudio";
    this.bufferLength = this._driver.bufferLength;
    this.sampleRate = this._driver.sampleRate;
  }

  _createClass(WebAudioPlayer, [{
    key: "play",
    value: function play() {
      this._driver.start();
    }
  }, {
    key: "pause",
    value: function pause() {
      this._driver.stop();
    }
  }], [{
    key: "isEnabled",
    get: function get() {
      return !!AudioContext;
    }
  }]);

  return WebAudioPlayer;
})();

module.exports = WebAudioPlayer;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"pico.driver.webaudio":6}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BUFFER_SIZE = 64;

var Processor = (function () {
  function Processor() {
    _classCallCheck(this, Processor);

    this.player = null;
    this.audioprocess = null;
    this.isPlaying = false;
    this.streams = null;
    this.buffers = null;
  }

  _createClass(Processor, [{
    key: "bind",
    value: function bind(Klass) {
      this.player = new Klass(this);
    }
  }, {
    key: "play",
    value: function play(audioprocess) {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.streams = [new Float32Array(this.player.bufferLength), new Float32Array(this.player.bufferLength)];
        this.buffers = [new Float32Array(BUFFER_SIZE), new Float32Array(BUFFER_SIZE)];
        this.audioprocess = audioprocess;
        this.player.play();
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.player.pause();
        this.streams = null;
        this.buffers = null;
        this.audioprocess = null;
      }
    }
  }, {
    key: "process",
    value: function process(bufL, bufR) {
      var audioprocess = this.audioprocess;
      var buffers = this.buffers;
      var bufferL = buffers[0];
      var bufferR = buffers[1];
      var n = bufL.length / BUFFER_SIZE;

      for (var i = 0; i < n; i++) {
        audioprocess({
          bufferSize: BUFFER_SIZE,
          buffers: buffers
        });
        bufL.set(bufferL, i * BUFFER_SIZE);
        bufR.set(bufferR, i * BUFFER_SIZE);
      }
    }
  }, {
    key: "env",
    get: function get() {
      return this.player.env;
    }
  }, {
    key: "sampleRate",
    get: function get() {
      return this.player.sampleRate;
    }
  }, {
    key: "bufferSize",
    get: function get() {
      return BUFFER_SIZE;
    }
  }]);

  return Processor;
})();

module.exports = Processor;
},{}],6:[function(require,module,exports){
function PicoWebAudioDriver() {
  this.sampleRate = 0;
  this.bufferLength = 0;

  this._scp = null;
  this._context = null;
  this._destination = null;
}

PicoWebAudioDriver.prototype.setup = function(opts) {
  var bufferLength = Math.max(256, Math.min((+opts.bufferLength|0) || 1024, 16384));

  this.bufferLength = 1 << Math.ceil(Math.log(bufferLength) / Math.log(2));

  if (opts.destination) {
    this._destination = opts.destination;
    this._context = this._destination.context;
  } else {
    this._context = opts.context;
    this._destination = this._context.destination;
  }

  this.sampleRate = this._context.sampleRate;
};

PicoWebAudioDriver.prototype.start = function() {
  var processor = this.processor;
  var bufL = new Float32Array(this.bufferLength);
  var bufR = new Float32Array(this.bufferLength);

  if (this._context !== null && this.processor !== null && this._scp === null) {
    this._scp = this._context.createScriptProcessor(this.bufferLength, 0, 2);
    if (typeof AudioBuffer.prototype.copyToChannel === "function") {
      this._scp.onaudioprocess = function(e) {
        var buf = e.outputBuffer;

        processor.process(bufL, bufR);

        buf.copyToChannel(bufL, 0);
        buf.copyToChannel(bufR, 1);
      };
    } else {
      this._scp.onaudioprocess = function(e) {
        var buf = e.outputBuffer;

        processor.process(bufL, bufR);

        buf.getChannelData(0).set(bufL);
        buf.getChannelData(1).set(bufR);
      };
    }
    this._scp.connect(this._destination);
  }
};

PicoWebAudioDriver.prototype.stop = function() {
  if (this._scp !== null) {
    this._scp.disconnect();
    this._scp = null;
  }
};

module.exports = PicoWebAudioDriver;

},{}]},{},[1])(1)
});

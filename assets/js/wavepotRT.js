var contextClass = (window.AudioContext || window.webkitAudioContext)

/*
  @bufferSize
  @channels
*/
function WavepotRuntime(o){
    this.code = ""
    this.scope = new Object();
    this.time = 0;
    this.context = new contextClass();
    this.playing = false;
    this.bufferSize = o.bufferSize || 1024;
    this.channels = o.channels || 2
    this.scriptnode = this.context.createScriptProcessor(this.bufferSize, 0, this.channels);
    this.recording = false;
    var _this = this;
    this.scriptnode.onaudioprocess = function(e) {
	
	// Sistema estereofonico de 2 canais
	var out = [
            e.outputBuffer.getChannelData(0),
            e.outputBuffer.getChannelData(1)
        ];
        
	// Tempo discretizado
	var f = 0, t = 0, td = 1.0 / _this.context.sampleRate;
        
	// A cada janela temporal, o valor numerico
	// de amplitude vai ser atualizado
	if (_this.scope && _this.scope.dsp && _this.playing) {
            t = _this.time;
	    _this.scope.set_controls(_this.controls);
	    var i = 0;
            for (var i = 0; i < out[0].length; i++) {
		// Ajusta o relógio
		// Tempo atual e tempo diferencial
		// Este último será útil para filtros
		_this.scope.set_time(t, td);

		// função definida dinamicamente
		f = _this.scope.dsp();

		// Se a funcao retornar um número
		// utilizar ele nos dois canais
		// Se a funcao retornar um Array
		// de dois valores, separar nos canais
		if(typeof(f) === 'number'){
                    out[0][i] =  f
                    out[1][i] =  f
		}
		else if (typeof(f) === 'object'){
                    out[0][i] =  f[0]
                    out[1][i] =  f[1]
		}
		// Incrementar o tempo
		t += td;
            }
	    _this.time = t;
	    
            // Continuar o processamento se nada for atualizado
	} else {
            for (var i = 0; i < out[0].length; i++) {
		out[0][i] = f[0] | f
		out[1][i] = f[1] | f
            }
	}
    }
}

var makeScope = function(code, ctx){
    // AMBIENTE DE ÁUDIO INTERNO
    var newscope = new Object();
    var _code = "var sampleRate = "+ctx.sampleRate+";\n\n"+
	"var t = 0;\n\n"+
	"var td = 0;\n\n"+
	"var tau = 2 * Math.PI\n\n;"+
	"var bpm = 60;\n\n"+
	"var controls = {};\n\n"+
	"var sin = function(f, a) { return a * Math.sin(tau * f * t);};\n\n"+
	"var saw = function(f, a) { return (1 - 2 * tmod(f, t)) * a; };\n\n"+
	"var tmod = function(f, t) { return t % (1 / f) * f; };\n\n" +
	"var tri = function(f, a) { return ttri(f, t) * a; };\n\n" +
	"var ttri = function(f, t) { return Math.abs(1 - (2 * t * f) % 2 * 2 - 1); };\n\n" +
	"var pulse = function(f, a, w) { return ((t * f % 1 / f < 1 / f / 2 * w) * 2 - 1) * a; };\n\n" +
	"this.set_time = function(time, diferencialTime){ t = time; td = diferencialTime};\n\n" +
	"this.set_controls = function(c){ controls = c};\n\n"+ 
	"this.dsp = "+code+";"
    var fn = new Function(_code)
    fn.call(newscope)
    if (typeof(newscope.dsp) == 'function') {
	return newscope;
    }
    else{
	return new Error("No given dsp function");
    }
	
}

WavepotRuntime.prototype.compile = function(code) {
    // console.log('WavepotRuntime: compile', code);
    this.code = code;
    try {
	this.scope = makeScope(code, this.context);
	console.log('WavepotRuntime: compiled', newscope);
	return true;
    } catch(e) {
	console.log('WavepotRuntime: ERROR', e.stack.toString());
        return false;
    }
    
}

WavepotRuntime.prototype.play = function(){
    console.log('WavepotRuntime: play');
    this.scriptnode.connect(this.context.destination);
    this.playing = true;
}

WavepotRuntime.prototype.pause = function() {
    console.log('WavepotRuntime: pause');
    this.playing = false;
}

WavepotRuntime.prototype.stop = function() {
    console.log('WavepotRuntime: stop');
    this.playing = false;
    this.time = 0;
    this.scriptnode.disconnect(this.context.destination);
}

WavepotRuntime.prototype.reset = function() {
    console.log('WavepotRuntime: reset');
    this.time = 0;
}

window.WavepotRuntime = WavepotRuntime

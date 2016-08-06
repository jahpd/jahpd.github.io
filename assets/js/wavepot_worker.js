var scope = new Object();
var playing = false;
var 

onnodecreate = function(e){
    e.node.scope = scope;
    e.node.playing = playing;
}

onaudioprocess = function (e) {	
    if(e.node.scope.dsp && e.node.playing){
	var outputs = [e.outputs[0],e.outputs[1]];
	var sample = outputs[0].length-1;
	var t = e.node.time;
	var l = e.outputs[0].length-1;
	var result = e.node.scbope.dsp();
	if(typeof(result) === 'number'){
	    for(;sample>=0;sample--){
		for(; l>=0;l--){
		    fn(outputs[l], result);
		}
		t += e.node.td;
	    }
	}
	else if (typeof(result) === 'object'){
	    for(;sample>=0;sample--){
		for(; l>=0;l--){
		    fn(outputs[l], result[l]);
		}
		t += e.node.td;
	    }
	}
    }
}

onmessage = function(e){
    if(e.data[0] === 'compile'){
	// AMBIENTE DE ÁUDIO INTERNO
	var text = e.data[1].split("\n")
	for(var t in text ){
	    text[t] = text[t].replace(/\&gt;/, ">");
	    text[t] = text[t].replace(/<code><code\/>/, "");
	}
	text = text.join("\n")
	var text = text.split("function dsp(){")
	var environment = [
	    "var sampleRate = "+sampleRate+";",
	    "var t = 0;",
	    "var td = 0;",
	    "var tau = 2 * Math.PI;",
	    "var bpm = 60;",
	    "var controls = {};",
	    "var sin = function(f, a, _t) { return a * Math.sin(tau * f * (_t!==undefined?t+_t:t));};",
	    "var saw = function(f, a, _t) { return (1 - 2 * tmod(f, (_t!==undefined?t+_t:t))) * a; };",
	    "var tmod = function(f, _t) { return (_t!==undefined?t+_t:t) % (1 / f) * f; };" ,
	    "var tri = function(f, a, _t) { return ttri(f, (_t!==undefined?t+_t:t)) * a; };" ,
	    "var ttri = function(f, _t) { return Math.abs(1 - (2 * (_t!==undefined?t+_t:t) * f) % 2 * 2 - 1); };" ,
	    "var pulse = function(f, a, w, _t) { return (((_t!==undefined?t+_t:t) * f % 1 / f < 1 / f / 2 * w) * 2 - 1) * a; };",
	    text[0],
	    "this.dsp = function(){ ",
	    text[1]
	].join("\n")
	var fn = new Function(environment);
	var newscope = new Object();
	fn.call(newscope);
	scope = newscope;
	self.postMessage(['compiled']);
    }
    if(e.data[0] === 'play'){
	playing = true;
	
	self.postMessage(['play']);
    }
    if(e.data[0] === 'stop'){
	playing = false;
	self.postMessage(['stop']);
    }
    if(e.data[0] === 'pause'){
	self.postMessage(['play']);
    }
    if(e.data[0] === 'reset'){
	self.postMessage(['play']);
    }
}  

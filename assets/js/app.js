(function(p5){
    var wp = {}; 
    $(document).ready(function(){
	if(p5 !== undefined){
	    p5();
	}

	var contextClass = (window.AudioContext || window.webkitAudioContext);
	var context = new contextClass();
	
	if(wp){
	    $(".wavepot").each(function(i, e){
		var id = $(e).attr('id')
		wp[id] = {
		    play:  $('.play').button({text: false, icons: {primary: "ui-icon-play"}}).click(function(){
			var txt = $(this).text()
			if (txt === "play" ) {
			    var text = $("#"+id+">pre>code").text()
			    wp[id]["runtime"] = new window.WavepotRuntime({context: context, channels:2, bufferSize:1024});
			    wp[id].runtime.compile(text);
			    wp[id].runtime.play();
			    $(this).button("option", {label: "pause",icons: {primary: "ui-icon-pause"}});
			} else { 
			    if(wp[id].runtime) wp[id].runtime.pause();
			    $(this).button("option", {label: "play",icons: {primary: "ui-icon-play"}});
			}
		    }),
		    stop: $('.stop').button({text: false, icons: {primary: "ui-icon-stop"}}).click(function(){
			if(wp[id].runtime) wp[id].runtime.stop();
		    })
		};
	    });
	}
    });
}(window.RenderCode, {}))

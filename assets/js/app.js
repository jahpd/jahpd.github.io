(function(p5,wp){
    this.wp = wp
    $(document).ready(function(){
	if(p5 !== undefined){
	    p5();
	}

	var contextClass = (window.AudioContext || window.webkitAudioContext);
	var context = new contextClass();
	
	if(wp){
	    $(".wavepot").each(function($e){
		var id = $e.att('id')
		this.wp[id] = new WavepotRuntime({context: context, channels:2, bufferSize:1024});
	    })
	    $('.play').button({text: false, icons: {primary: "ui-icon-play"}}).click(function(){
		var id = $(this).attr('id')
		if ( $( this ).text() === "play" ) {
		    options = {
			label: "pause",
			icons: {
			    primary: "ui-icon-pause"
			}
		    };
		    this.wp[id].compile($("#"+$(this).attr('id')+">figure>pre>code").text());
		    this.wp[id].play()
		} else {
		    options = {
			label: "play",
			icons: {
			    primary: "ui-icon-play"
			}
		    };
		    this.wp[id].pause()
		}
	    });
	    
	    $('.stop').button({text: false, icons: {primary: "ui-icon-stop"}}).click(function(){
		this.wp[id].stop()
	    });
	}
    });
}(renderCode, {}))

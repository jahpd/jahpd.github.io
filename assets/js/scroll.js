document.body.onscroll = function() {
    var e = document.getElementById('go-top');
    if (document.body.scrollTop !=0 || document.documentElement.scrollTop != 0) {
	e.style.right = '.5em';
    }
    else e.style.right = '-1em';
}
var timeOut;
function scrollToTop() {
    if (document.body.scrollTop !=0 || document.documentElement.scrollTop != 0) {
	window.scrollBy(0,-50);
	timeOut=setTimeout('scrollToTop()',5);
    }
    else clearTimeout(timeOut);
}

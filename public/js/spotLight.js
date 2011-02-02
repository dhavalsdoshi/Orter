var spot = document.getElementById('spot');
var width = document.documentElement.clientWidth;
var height = document.documentElement.clientHeight;

/* A bit of JS to respond to mouse events */
function moveSpot(e) {
    var x = 0;
    var y = 0;

    if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        x = e.clientX + document.body.scrollLeft;
        y = e.clientY + document.body.scrollTop;
    }

    if (navigator.userAgent.match('AppleWebKit')) {
        var style = '-webkit-gradient(radial, ' + x + ' ' + y + ', 150, ' + x + ' ' + y + ', 190, from(transparent), to(#000))';
    } else {
        var style = '-moz-radial-gradient(' + x + 'px ' + y + 'px ,circle,transparent 150px,#000 190px)';
    }
    spot.style.backgroundImage = style;
}

window.onload = function() {
    window.onmousemove = moveSpot;
}
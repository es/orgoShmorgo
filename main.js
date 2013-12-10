window.onload = function () {
    var container = document.getElementById("container");
    var paper = Raphael(container, 600, 600);
    
    var rect = paper.rect(10, 10, 50, 50);
	var circle = paper.circle(110, 35, 25);

	rect.attr({fill: "green"});
	circle.attr({fill: "blue"});
};
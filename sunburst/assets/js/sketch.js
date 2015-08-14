"use strict";

var lato_black;

var main;
var level_thickness = 130;
var level_offset = 2;

var select_path = 'None';
var select_percentage = 100;
var has_hover = false;

var mouse_angle;
var mouse_dist;


function Arc(data) {
	this.value = data['value'];
	this.name = data['name'];
	this.subsections = [];
	for(var i = 0; i < data['data'].length; i++){
		this.subsections.push(new Arc(data['data'][i]));
	}
	
	this.draw = function(percentage, level, angle, dist){
		push();
		for(var i = 0; i < this.subsections.length; i++){
			var next = (this.subsections[i].value/this.value)*percentage;

			this.subsections[i].draw(next,level+1,angle,dist);

			if(!has_hover) draw_arc(level, next, this.subsections[i].name, true);
			else draw_arc(level, next, this.subsections[i].name, angle > 0 && angle < next && dist >= level);

			rotate(next);
			angle -= next;
		}
		pop();
	}

	this.check_hover = function(percentage, level, angle, dist){
		if(level > dist) return false;

		for(var i = 0; i < this.subsections.length; i++){
			var next = (this.subsections[i].value/this.value)*percentage;

			if(next*PI*2 < angle){
				angle -= next*PI*2;
				continue;
			}else{ 
				select_path += " > " + this.name;
				if(dist == level){
					select_path += " > " + this.subsections[i].name;
					select_percentage = next;
					return true;
				}else{
					 return this.subsections[i].check_hover(next, level+1, angle, dist);
				}
			}
		}
		return false;
	}
}

function setup() {
	createCanvas(800, 600);
	main = new Arc(json['data']);
}

function draw() {
	clear();
	
	mouse_angle = atan2(mouseY - height/2, mouseX - width/2);
	if(mouse_angle < 0) mouse_angle += PI*2;
	mouse_dist = ceil(dist(width/2,height/2,mouseX,mouseY)*2/level_thickness) - level_offset;
	select_path = '';
	has_hover = main.check_hover(1,1,mouse_angle,mouse_dist);

	push();

	


	translate(width/2,height/2);

	main.draw(PI*2, 1, mouse_angle, mouse_dist);
	noStroke();
	fill(255);
	ellipse(0,0,level_offset*level_thickness,level_offset*level_thickness);

	pop();

	if(has_hover){
		fill(0);
		
		textFont("lato-bold");
		noStroke();
		textSize(30);
		textAlign(LEFT,TOP);
		text(select_path, 10, 10)
		textAlign(CENTER,CENTER);
		text(round(1000*select_percentage)/10 + "%", width/2,height/2);
	}
}

function draw_arc(level, percentage, color, shaded){
	noStroke();
	fill(json['colors'][color][0],json['colors'][color][1],json['colors'][color][2]);
	arc(0,0,(level_offset+level)*level_thickness,(level_offset+level)*level_thickness,0,percentage);

	if(!shaded){
		fill(255,150);
		arc(0,0,(level_offset+level)*level_thickness,(level_offset+level)*level_thickness,0,percentage);
	}
}
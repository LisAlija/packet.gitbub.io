// JavaScript Document
var m02p07 = m02p07 || {};
m02p07.activity = function(){
	var html = "<div id=\"thermometer-div\" style=\" position:absolute; width:800px; height:600px\"><img id=\"thermometer-1\" src=\"pages/assets/m02p07/reveal1.png\" width=\"722\" height=\"102px\" style=\"position:absolute; top:344px; left:36px\" /><img id=\"thermometer-2\" src=\"pages/assets/m02p07/reveal2.png\" width=\"668px\" height=\"43px\" style=\"position:absolute; top:344px; left:48px\" /> <img id=\"thermometer-3\" src=\"pages/assets/m02p07/reveal3.png\" width=\"763px\" height=\"151px\" style=\"position:absolute; top:195px; left:51px\"/><img id=\"thermometer-4\" src=\"pages/assets/m02p07/reveal4.png\" width=\"665px\" height=\"118px\" style=\"position:absolute; top:215px; left:50px\" /> <img id=\"thermometer-6\" src=\"pages/assets/m02p07/reveal6.png\" width=\"719px\" height=\"103px\" style=\"position:absolute; top:115px; left:40px\" /> <img id=\"thermometer-7\" src=\"pages/assets/m02p07/reveal7.png\" width=\"670px\" height=\"61px\" style=\"position:absolute; top:103px; left:47px\" /> <img id=\"thermometer\" src=\"pages/assets/m02p07/thermometer.png\" width=\"99px\" height=\"369px\" style=\"position:absolute; top:104px; left:104px\" /> <img id=\"thermometer-5\" src=\"pages/assets/m02p07/reveal5.png\" width=\"556px\" height=\"148px\" style=\"position:absolute; top:197px; left:160px\"  /> <img id=\"thermometer_slider\" src=\"pages/assets/m02p07/slider.png\" width=\"110px\" height=\"60px\" style=\"position:absolute; top:390px; left:120px\"/> </div>";

	var images=[];
	var finished=false;
	var _holder;
	this.placeOnScreen = function(holder){
		_holder=holder;
		$(holder).append(html);
		
		images=[
			{ id:$("#thermometer-1"), y:-5 },
			{ id:$("#thermometer-2"), y:-50 },
			{ id:$("#thermometer-3"), y:-73 },
			{ id:$("#thermometer-4"), y:-141 },
			{ id:$("#thermometer-5"), y:-200 },
			{ id:$("#thermometer-6"), y:-223 },
			{ id:$("#thermometer-7"), y:-272 }
		];
		$(images).each(function(index, element) {
			TweenLite.set(this.id, {opacity:0})
		});
		
		
		return($("#thermometer-div"));
	};
	this.playIt = function(){
	
		Draggable.create("#thermometer_slider", {
			type:"y",
			bounds: {minY:-300, maxY:0},
			onDrag:function(){
				for(var i=0,ii=images.length;i<ii;i++){
					if(this.y<=images[i].y && images[i].id.css('opacity') <1){
						TweenLite.to(images[i].id, 0.3, {opacity:1});
					}else if(this.y>images[i].y && images[i].id.css('opacity')>0){
						TweenLite.to(images[i].id, 0.3, {opacity:0});
					}
					if(this.y<=-272 && !finished){
						$.event.trigger({ type:"bespokeFinished", container:_holder });
						finished=true;
					}
				}
			}
		});
	};
};
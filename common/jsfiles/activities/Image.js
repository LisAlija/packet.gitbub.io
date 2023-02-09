// JavaScript Document
Activities.ImageActivity = function(){	
	var base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _images=[];
	
	
	this.buildActivity = function(pageObject, holder){
		base = new Activities.base();	
		base.page = _pageNumber;
		_pageObject = pageObject;
		_images = $(_pageObject.pagexml[_pageObject.pageposition]).children("placeImage");
		_holder = holder;
		placeImages();
		
	}	
	function placeImages(){
		
		for(var i=0,ii=_pageObject.images.length;i<ii;i++){
			for(var a=0,aa=_images.length;a<aa;a++){
				if(_pageObject.images[i].id == _images[a].getAttribute("name")){
					$(_pageObject.images[i].pic).css({
						'position':'absolute',
						'visibility':'visible'
					});	
					if(_images[a].getAttribute("applyEffect") != null && _images[a].getAttribute("applyEffect") != undefined && _images[a].getAttribute("applyEffect") === "yes"){
						$(_pageObject.images[i].pic).addClass("apply-effect");
						
					}
					$(_holder).append(_pageObject.images[i].pic);						
					var centred = (_images[a].getAttribute("centre") != null && _images[a].getAttribute("centre") != undefined && _images[a].getAttribute("centre") === "true") ? true : false;
					
					var stx = (centred) ? (_images[a].getAttribute("x") - (_pageObject.images[i].pic.width / 2) ) : _images[a].getAttribute("x");
					var sty = (centred) ? (_images[a].getAttribute("y") - (_pageObject.images[i].pic.height / 2) ) : _images[a].getAttribute("y");
					var wid = _pageObject.images[i].width;
					var hei = _pageObject.images[i].height;		
														
					var tl = new TimelineLite();
					if(centred){
						tl.set(_pageObject.images[i].pic, {left:stx, top:sty, width: wid, height:hei, opacity:0});	
					}else{
						tl.set(_pageObject.images[i].pic, {x:stx, y:sty, width: wid, height:hei, opacity:0});	
					}					
					_pageObject.addToReset(tl);
					var tweens = _images[a].getElementsByTagName("moveImage");
					var tweenObj = new Helpers.tweenObject(tweens, _pageObject.images[i].pic, tl, centred);
					
				
				}
			}
		}
		
		for(i=0,ii=_pageObject.customjs.length;i<ii;i++){
			for(a=0,aa=_images.length;a<aa;a++){
				if(_pageObject.customjs[i].id === _images[a].getAttribute("name")){
					
					var centre = (_images[a].getAttribute("centre") != null && _images[a].getAttribute("centre") != undefined && _images[a].getAttribute("centre") === "true") ? true : false;
					var result = eval(_pageObject.customjs[i].namespace+"."+_pageObject.customjs[i].id); 
					var res = new result();				
					
					var sx = (centre) ? (_images[a].getAttribute("x") - (div.width / 2) ) : _images[a].getAttribute("x");
					var sy = (centre) ? (_images[a].getAttribute("y") - (div.height / 2) ) : _images[a].getAttribute("y");
					var div = res.placeOnScreen(_holder);
					var tl2 = new TimelineLite();
					_pageObject.addToReset(tl2);
					tl2.set(div, {left:sx, top:sy, opacity:0});	
					tl2.to(div, 0.5, {left:sx, top:sy, opacity:1})
					
					var nextsteps = _images[a].getElementsByTagName("moveImage");
				
					for(var e=0,ee=nextsteps.length;e<ee;e++){
						var t = (nextsteps[e].getAttribute("playit")) ? Number(nextsteps[e].getAttribute("playit")) : null;
						var s = (nextsteps[e].getAttribute("scaleX")) ? Number(nextsteps[e].getAttribute("scaleX")) : null;
						if(t){
							var d1 = new TweenMax.delayedCall(t, playIt, [res, s, div]);
							_pageObject.addToReset(d1);
						}
						
					}
					$(document).on("bespokeFinished", setToComplete);
				}
			}
		}		
		function playIt(res, s, div){
			var tl = res.playIt();
			if(tl){
				
				_pageObject.addToReset(tl);
			}
			if(s){
				var t = TweenLite.to(div, 0.5, {scaleX:s, scaleY:s});	
				_pageObject.addToReset(t);
			}		
		}
		function setToComplete(){
			base.setToComplete();
		}
	}
	
}
// JavaScript Document
var Helpers = Helpers || {};		
Helpers.tweenObject = function(xml, obj, timeline, centred){
	
	var _list;
	var _object;
	var _timeline;
		
	_list = xml;
	_object=obj;
	_timeline=timeline;
	moveItems(0);
	
	function moveItems(i){
		var _moveScaleX=-1;
		var _moveScaleY=-1;
		var _moveSpeed=0.5;
		var _moveAlpha;
		var _moveX;
		var _moveY;
		var _moveDelay;
		var _scaleX;
		var _scaleY;
		
		if(_list[i].getAttribute("alpha") != null || _list[i].getAttribute("alpha") != undefined){
			_moveAlpha=_list[i].getAttribute("alpha");
		}		
		if(_list[i].getAttribute("x") != null || _list[i].getAttribute("x") != undefined){
			_moveX=_list[i].getAttribute("x");
		}
		if(_list[i].getAttribute("y") != null || _list[i].getAttribute("y") != undefined){
			_moveY=_list[i].getAttribute("y");
		}
		if(_list[i].getAttribute("scaleX") != null || _list[i].getAttribute("scaleX") != undefined){
			_scaleX=_list[i].getAttribute("scaleX");
			_moveScaleX=_object.width * _scaleX;
		}
		if(_list[i].getAttribute("scaleY") != null || _list[i].getAttribute("scaleY") != undefined){		
			_scaleY=_list[i].getAttribute("scaleY");			
			_moveScaleY=_object.height * _scaleY;
		}
		if(_list[i].getAttribute("delay") != null || _list[i].getAttribute("delay") != undefined){
			_moveDelay=_list[i].getAttribute("delay");
		}
		if(_list[i].getAttribute("speed") != null || _list[i].getAttribute("speed") != undefined){
			_moveSpeed=_list[i].getAttribute("speed");
		}
		
		
		if (_moveScaleX!==-1) {	
			if(centred){
				_timeline.append(new TweenLite(_object,_moveSpeed,{alpha:_moveAlpha, delay:_moveDelay, x:_moveX, y:_moveY, scaleX:_scaleX, scaleY:_scaleY}));
			}else{
				_timeline.append(new TweenLite(_object,_moveSpeed,{alpha:_moveAlpha, delay:_moveDelay, x:_moveX, y:_moveY, width:_moveScaleX, height:_moveScaleY}));			
			}
			
		} else {
			_timeline.append(new TweenLite(_object,_moveSpeed,{alpha:_moveAlpha, delay:_moveDelay, x:_moveX, y:_moveY}));
		}
		if(i<_list.length-1){
			moveItems(i+1);
		}
	}
};
Helpers.popup = function(){
	this.width = 909;
	this.height = 462;
	this.x=-1;
	this.y=-1;
	this.class = "feedbackpopup";
	this.closebtn = true;
	this.html = "<div></div>";
	this.name ="name";
	this.sound = false;
	this.soundName,
	this.owner,
	this.autoX = function(){
		var hw = ($("#holder").width());
		var hh = ($("#holder").height());
		this.x=(hw/2) - (this.width/2);
		this.y=(hh/2) - (this.height/2);
	};
	this.setClass = function(c){
		this.class=c;
	};
	this.setX = function(c){
		this.x=c;
	};
	this.setY = function(c){
		this.y=c;
	};
	this.setWidth = function(c){
		this.width=c;
	};
	this.setHeight = function(c){
		this.height=c;
	};
	this.setName = function(c){
		this.name=c;
	};
	this.setClosebtn = function(c){
		this.closebtn = c;
	};
	this.setOwnerObject = function(c){
		this.owner=c;
	}
	this.includeSound = function(c){
		this.sound = c;	
	}
	
	this.addToStage = function(stage){
		this.html = "<div id=\""+this.name+"\" class=\""+this.class+"\"></div>";
		$(stage).append(this.html);
		var p = ("#"+this.name);
		$(p).css({
			'width': this.width+'px',
			'height': this.height+'px',
			'z-index': 2000
		});
		if(this.x<0){
			this.autoX(stage);	
		}
		
		var tl = new TimelineLite();
		tl.set(p, {position:"absolute", left:this.x, top:this.y-10, opacity:0});	
		tl.append(TweenLite.to(p, 0.5, {left:this.x, top:this.y, opacity: 1}));	
		if(this.closebtn){
			var id=this.name+"-boxclose";
			Helpers.addCloseBtn($("#"+this.name),this.width,id, this);			
		}
			
	};
	this.addText = function(text){
		$("#"+this.name).prepend("<p id=\""+this.name+"_text\">"+text+"</p>");	
		TweenLite.set($("#"+this.name+"_text"), {position:"absolute", x:10, y:10, width:this.width-10});	
	}
	this.removeFromStage = function(){
		
		$("#"+this.name).remove();
		if(this.sound){	
			Global.soundController.stopSound();	
		}
		
		
	};
};
Helpers.listBox = function(){
	var _width = 25;
	var _height = 100;
	var _textColour = "#7A719F";
	var _colour = "#7A719F";
	var _OverColour = "#FF9E51";
	var _SelectColour = "#858585";
	var _IncorrectColour = "#D47272";
	var _CorrectColour = "#2D8019";
	
	
	var _id;
	var _state;
	
	this.setWidth = function(c){
		_width=c;
	};
	this.setHeight = function(c){
		_height=c;
	};
	this.setColour = function(c){
		_colour=c;
	};
	this.setTextColour = function(c){
		_textColour=c;
	};
	this.setId = function(c){
		_id=c;
	};
	this.setOverColour = function(c){
		_OverColour=c;
	};
	this.setSelectColour = function(c){
		_SelectColour=c;
	};
	this.setState = function(i){
		_state = i;
		switch(_state){
			case "active":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
					'backgroundColor':_colour,
				}).mouseenter(function(){
					$(this).css("background", _OverColour);	
				}).mouseleave(function(){
					$(this).css("background", _colour);	
				});
				
			
			break;
			case "over":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
					'backgroundColor':_OverColour,
				}).mouseenter(function(){
					$(this).css("background", _colour);	
				}).mouseleave(function(){
					$(this).css("background", _OverColour);	
				});	
			break;	
			case "selected":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
					'backgroundColor':_SelectColour,
				}).mouseenter(function(){
					$(this).css("background", _OverColour);	
				}).mouseleave(function(){
					$(this).css("background", _SelectColour);	
				});
			break;
			case "correct":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
					'backgroundColor':_CorrectColour,
				}).mouseenter(function(){
					$(this).css("background", _OverColour);	
				}).mouseleave(function(){
					$(this).css("background", _CorrectColour);	
				});
			break;
			case "incorrect":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
					'backgroundColor':_IncorrectColour,
				}).mouseenter(function(){
					$(this).css("background", _OverColour);	
				}).mouseleave(function(){
					$(this).css("background", _IncorrectColour);	
				});
			break;
		}
	};
	this.removeInteraction = function(){
		$("#"+_id).off();	
		$("#"+_id).css({
			'cursor':'auto',
		});
	};
	this.drawBox = function(_holder){
		$(_holder).append("<div class=\"listbox-outer\" id="+_id+"><div id="+_id+"-inner"+" class=\"listbox-gradient\"></div></div>");
		TweenLite.set($("#"+_id),{width:_width, height:_height, display:"block", color:_textColour, backgroundColor: _colour});
		TweenLite.set($("#"+_id+"-inner"),{width:_width-2, x:1, y:1});
	};
};
Helpers.iconBox = function(){
	var _width = 245;
	var _height = 100;
	var _iconColour = "#B8B4CB";
	var _iconOverColour = "#FF9E51";
	var _iconSelectedColour = "#ADADAD";
	var _iconIncorrectColour = "#D47272";
	var _iconCorrectColour = "#56AF68";
	var _id;
	var _state;
	var _holder;
	var _class;
	var _iconDrawn = false;
	
	this.setWidth = function(c){
		_width=c;
	};
	this.setHeight = function(c){
		_height=c;
	};
	this.seticonColour = function(c){
		_iconColour=c;
	};
	this.iconOverColour = function(c){
		_iconOverColour=c;
	};
	this.iconSelectColour = function(c){
		_iconSelectedColour=c;
	};
	this.setId = function(c){
		_id=c;
	};
	this.getId = function(){
		return _id;	
	};
	this.getState = function(){
		return _state;	
	};
	this.setCorrect = function(correct){
		if(correct){
			TweenLite.set($("#"+_id+"-inner"),{backgroundImage:"url(\"../common/images/complete.png\")", backgroundRepeat:"no-repeat", backgroundPosition:"right center", backgroundSize:"10%, 10%"});
		}else{
			TweenLite.set($("#"+_id+"-inner"),{backgroundImage:"url(\"../common/images/cross.png\")", backgroundRepeat:"no-repeat", backgroundPosition:"right center", backgroundSize:"10%, 10%"});
		}
	};
	this.setState = function(i){
		_state = i;
		switch(_state){
			case "active":		
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
				}).mouseenter(function(){
					$("#"+_id+"-inner").css("background", _iconOverColour);	
				}).mouseleave(function(){
					$("#"+_id+"-inner").css("background", _iconColour);	
				});
			
				$("#"+_id+"-inner").css({
					'backgroundColor':_iconColour,
				});			
			break;
			case "over":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
				}).mouseenter(function(){
					$("#"+_id+"-inner").css("background", _iconColour);	
				}).mouseleave(function(){
					$("#"+_id+"-inner").css("background", _iconOverColour);	
				});
			
				$("#"+_id+"-inner").css({
					'backgroundColor':_iconOverColour,
				});			
								
			break;	
			case "correct":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
				}).mouseenter(function(){
					$("#"+_id+"-inner").css("background", _iconOverColour);	
				}).mouseleave(function(){
					$("#"+_id+"-inner").css("background", _iconCorrectColour);	
				});
			
				$("#"+_id+"-inner").css({
					'backgroundColor':_iconCorrectColour,
				});	
				
			break;
			case "selected":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
				}).mouseenter(function(){
					$("#"+_id+"-inner").css("background", _iconOverColour);	
				}).mouseleave(function(){
					$("#"+_id+"-inner").css("background", _iconSelectedColour);	
				});
			
				$("#"+_id+"-inner").css({
					'backgroundColor':_iconSelectedColour,
				});	
				
			break;
			case "incorrect":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
				}).mouseenter(function(){
					$("#"+_id+"-inner").css("background", _iconOverColour);	
				}).mouseleave(function(){
					$("#"+_id+"-inner").css("background", _iconIncorrectColour);	
				});
			
				$("#"+_id+"-inner").css({
					'backgroundColor':_iconIncorrectColour,
				});	
				
			break;
		}
	};
	this.removeInteraction = function(){
		$("#"+_id).off();
		$("#"+_id).css({'cursor':'default'});	
	};
	
	this.addClass = function(cla){		
		if(_iconDrawn){
			$("#"+_id).addClass(cla);
		}else{
			if(_class){
			_class+=" "+cla;
			}else{
				_class = cla;	
			}	
		}
	};
	this.drawIcon = function(holder){
		_holder=holder;
		$(_holder).append("<div class=\"iconbox-outer\" id="+_id+"><div id="+_id+"-inner"+" class=\"iconbox-inner\"></div><div id="+_id+"-gradient"+" class=\"iconbox-gradient\"></div>");	
		if(_class){
			$("#"+_id).addClass(_class);	
		}
		TweenLite.set($("#"+_id),{width:_width, height:_height, display:"block"});
		TweenLite.set($("#"+_id+"-inner"),{backgroundColor:_iconColour, height:_height-2, width:_width-2, top:1, left:1, display:"block"});
		TweenLite.set($("#"+_id+"-gradient"),{width:_width-2, height:(_height)/2, x:1, y:1});
		_iconDrawn = true;
	};
	this.removeBg = function(holder, speed, w, h){
		var sp = (speed)?speed:0.2;
		var wi = (w)?w:_width;
		var he = (h)?h:_height;
		TweenLite.to($("#"+_id), sp, {backgroundColor: "transparent", borderColor: "transparent"});
		TweenLite.to($("#"+_id+"-inner"), sp, {backgroundColor: "transparent", width:wi, height:he});
		$("#"+_id+"-gradient").prependTo("#"+_id);
		TweenLite.to($("#"+_id+"-gradient"), sp, {className:"iconbox-gradiens-whiter", height:"100%", width:"100%"});
	};
	this.addrighthtml = function(html, id){
		$("#"+_id).append(html);
		var width = $("#"+id).width();
		var height = $("#"+id).height();
		TweenLite.set($("#"+id),{position:"absolute", x:_width - (width/2), y:(_height/2)-(height/2) -10, opacity:0 });
		TweenLite.to($("#"+id), 0.3, {y:(_height/2)-(height/2), opacity:1});
	};
};
Helpers.addCloseBtn = function(holder, width, id, th){
	$(holder).append("<a id=\""+id+"\" class=\"boxclose\"></a>");			
	TweenLite.set($("#"+id),{x:width-36, y:5});
	$("#"+id).on('click', function(event){ $(holder).remove(); Global.soundController.stopSound(); 
		if(th.owner){
			th.owner.popupClosed(th.name);
		}
	});
	
	//$.event.trigger({ type:"closedPopup", container:holder }); });
}
Helpers.convertColour = function(colour){
	var c = colour.replace(/^0x+/, '#');
	return c;	
}
Helpers.shuffleArray = function(ys){
	for(var j, x, i = ys.length; i; j = Math.floor(Math.random() * i), x = ys[--i], ys[i] = ys[j], ys[j] = x);
	return ys;	
};
Helpers.isInArray = function(thing, list){
	"use strict";
    for (var i=0,ii=list.length;i<ii;i++) {
        if (list[i] === thing) {
            return true;
        }
    }
    return false;	
}
Helpers.Button = function(text){
	var _width = 160;
	var _height = 30;
	var _bColour = "#673E90";
	var _roColour = "#27bcf2";
	var _selectColour = "#CC6600";
	var _state4Colour = "#FFFFCC";
	var _bText = text;
	var _bFSize = 14;
	var _tColour = "#ffffff";
	var _state;
	var _id;
	
	this.setWidth = function(c){
		_width=c;
	};
	this.setHeight = function(c){
		_height=c;
	};
	this.setButtonColour = function(c){
		_bColour= Helpers.convertColour(c);
	};
	this.setRollOverColour = function(c){
		_roColour=Helpers.convertColour(c);
	};
	this.setSelectColour = function(c){
		_selectColour=Helpers.convertColour(c);
	};
	this.setState4Colour = function(c){
		_state4Colour=c;
	};
	this.setFontColour = function(c){
		_tColour=Helpers.convertColour(c);
	};
	this.setFontSize = function(c){
		_bFSize=c;
	};
	this.setText = function(c){
		_bText = c;
		$("#"+_id+" p").contents().replaceWith(_bText);
		
	};
	this.setId = function(c){
		_id=c;
	};
	this.getId = function(c){
		return _id;
	};
	this.setState = function(i){
		_state = i;
		switch(_state){	
			case "active":
				$("#"+_id).css({
					'cursor':'pointer',
					'opacity': '1',
					'backgroundColor':_bColour,
				}).mouseenter(function(){
					$(this).css("background", _roColour);	
				}).mouseleave(function(){
					$(this).css("background", _bColour);	
				});
				
			break;
			case "inactive":
				$("#"+_id).css({
					'cursor':'not-allowed',
					'opacity': '0.4',
					'backgroundColor':_state4Colour,
				}).off('mouseenter').off('mouseleave');
			break;
		}
	};
	this.getState = function(){
		return _state;	
	};
	this.drawButton = function(_holder){
		$(_holder).append("<div id=\""+_id+"\" class=\"activity-btn\"><p>"+_bText+"</p></div>");
									
		TweenLite.set($("#"+_id),{color: _tColour, width:_width, height:_height, backgroundColor:_bColour, cursor:'pointer'});	
		
		var bheight = $("#"+_id).height();
		var pheight = $("#"+_id+" p").height();
		var toppadding = (_height/2) - (pheight/2);
	
		TweenLite.set($("#"+_id+" p"),{y:toppadding});	
		
	};	
	this.removeFromStage = function(){
		$("#"+_id).remove();
	};
};
Helpers.buttonImage = function(text){
	"use strict";
	var _bImage;
	var _roImage;
	var _selectImage;
	var _state4Image;
	var _state;
	var _id;
	var _button; 
	var _correct; 
	var _selected;
	var tap;
	
	this.setState1Image = function(c){
		_bImage=c;
		_roImage=c;
		_selectImage=c;
		_state4Image=c;
	};
	this.setState2Image = function(c){
		_roImage=c;
	};
	this.setState3Image = function(c){
		_selectImage=c;
	};
	this.setState4Image = function(c){
		_state4Image=c;
	};
	this.setId = function(c){
		_id=c;
	};
	this.setCorrect = function(c){
		_correct=c;
	};
	this.getCorrect = function(){
		return _correct;
	};
	this.setSelected = function(c){
		_selected = c;
	};
	this.getSelected = function(c){
		return _selected;
	};
	this.getButton = function(){
		return _button;	
	};
	this.getId = function(){
		return _id;
	};
	function setTap() {
		tap = true;
		setTimeout(function () {
			tap = false;
		}, 500);
	}
	this.setState = function(i, callback){
		_state = i;
		switch(_state){
			case "active":
				_selected = false;	
				$(_button).off('mouseenter').off('mouseleave').off('touchleave').off('mouseup').contents().replaceWith(_bImage);
				$(_button).on('mouseleave mouseup', function(){
					$(this).contents().replaceWith(_bImage);
				}).on('mouseenter',function(){		
					$(this).contents().replaceWith(_roImage);		
				}).css({
					'cursor':'pointer',
					'opacity': '1',
				});				
			break;
			case "inactive":
				$("#"+_id).css({
					'cursor':'not-allowed',
					'opacity': '0.4',
				}).off('mouseenter').off('mouseleave');
			break;
			case "selected":
				_selected = true;	
				$(_button).off('mouseenter').off('mouseleave').contents().replaceWith(_selectImage);
				$(_button).mouseleave(function(){
					$(this).contents().replaceWith(_selectImage);
					$(this).mouseenter(function(){
						$(this).contents().replaceWith(_roImage);	
					});
				});
				
			break;
			case "done":
				$(_button).off('mouseenter').off('mouseleave').contents().replaceWith(_state4Image);
				
			break;
		}
	};
	this.setBg = function(i){
		switch(i){
			case 1:
				$(_button).contents().replaceWith(_bImage);
			break;
			case 2:
				$(_button).contents().replaceWith(_roImage);
			break;
			case 3:
				$(_button).contents().replaceWith(_selectImage);
			break;
			case 4:
				$(_button).contents().replaceWith(_state4Image);
			break;
		}
	};
	this.getState = function(){
		return _state;	
	};
	this.drawButton = function(_holder){
		$(_holder).append("<a id=\""+_id+"\" class=\"image-btn\"></a>");
		_button = $("#"+_id).append(_bImage);					
	};	
	this.removeInteraction = function(){
		$("#"+_id).off();
		$("#"+_id).css({'cursor':'default'});		
			
	};
};
Helpers.findImage = function(imageName, pageImages){
	"use strict";
	for(var i=0,ii=pageImages.length;i<ii;i++){			
		if(pageImages[i].id === imageName){
			return pageImages[i].pic;
		}
	}
	return false;
}
Helpers.imageExists = function(imageName, pageImages){
	"use strict";
	for(var i=0,ii=pageImages.length;i<ii;i++){			
		if(pageImages[i].id === imageName){
			return true;
		}
	}
	return false;
}
Helpers.addImage = function(imageName, pageImages, target){
	"use strict";
	for(var i=0,ii=pageImages.length;i<ii;i++){			
		if(pageImages[i].id === imageName){
			$(target).append(pageImages[i].pic);
			$(pageImages[i].pic).css({
				'position':'absolute',
			});	
			return pageImages[i];	
		}
	}
};
Helpers.verticalAlignImage = function(image, target){
	"use strict";
	return (target.height()/2) - (image.height /2);
};
Helpers.horizontalAlignImage = function(image, target){
	"use strict";
	return (target.width()/2) - (image.width /2);
};
Helpers.horizontalCentreWidth = function(itemX, holder){
	"use strict";
	return (holder.width()) - (itemX * 2);
}
Helpers.verticalAlignText = function(image, target){
	"use strict";
	return (target.height()/2) - (image.height() /2);
};
Helpers.uniqueArray = function(array){
	"use strict";
	return array.sort().filter(function(item, pos, ary){
		return !pos || item != ary[pos -1];	
	});
};
Helpers.getPosition = function(wrapper, offset, parent) {
	"use strict";
	var position1 = wrapper.offset();
	var position2 = $(parent).offset();
	return {
		x: position1.left - position2.left + offset.left,
		y: position1.top  - position2.top  + offset.top
	};
};
Helpers.modifyRect = function(rectangle){
	var rect = rectangle;
	if(!createjs.BrowserDetect.isChrome){
		rect.height = rect.height * (1/Global.model.zoom);
		rect.width = rect.width * (1/Global.model.zoom);
	}
	return rect;
};
function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}


!function(a,b,c){"use strict";function d(b,p,q){function K(c){var d=0,e=Gb.length;if(yb.old=a.extend({},yb),wb=tb?0:ub[rb.horizontal?"width":"height"](),Bb=zb[rb.horizontal?"width":"height"](),xb=tb?b:vb[rb.horizontal?"outerWidth":"outerHeight"](),Gb.length=0,yb.start=0,yb.end=H(xb-wb,0),Rb){d=Ib.length,Hb=vb.children(rb.itemSelector),Ib.length=0;var f,g=j(vb,rb.horizontal?"paddingLeft":"paddingTop"),h=j(vb,rb.horizontal?"paddingRight":"paddingBottom"),i="border-box"===a(Hb).css("boxSizing"),l="none"!==Hb.css("float"),m=0,n=Hb.length-1;xb=0,Hb.each(function(b,c){var d=a(c),e=Helpers.modifyRect(c.getBoundingClientRect()),i=G(rb.horizontal?e.width||e.right-e.left:e.height||e.bottom-e.top),k=j(d,rb.horizontal?"marginLeft":"marginTop"),o=j(d,rb.horizontal?"marginRight":"marginBottom"),p=i+k+o,q=!k||!o,r={};r.el=c,r.size=q?i:p,r.half=r.size/2,r.start=xb+(q?k:0),r.center=r.start-G(wb/2-r.size/2),r.end=r.start-wb+r.size,b||(xb+=g),xb+=p,rb.horizontal||l||o&&k&&b>0&&(xb-=I(k,o)),b===n&&(r.end+=h,xb+=h,m=q?o:0),Ib.push(r),f=r}),vb[0].style[rb.horizontal?"width":"height"]=(i?xb:xb-g-h)+"px",xb-=m,Ib.length?(yb.start=Ib[0][Pb?"center":"start"],yb.end=Pb?f.center:xb>wb?f.end:yb.start):yb.start=yb.end=0}if(yb.center=G(yb.end/2+yb.start/2),V(),Ab.length&&Bb>0&&(rb.dynamicHandle?(Cb=yb.start===yb.end?Bb:G(Bb*wb/xb),Cb=k(Cb,rb.minHandleSize,Bb),Ab[0].style[rb.horizontal?"width":"height"]=Cb+"px"):Cb=Ab[rb.horizontal?"outerWidth":"outerHeight"](),Db.end=Bb-Cb,ec||N()),!tb&&wb>0){var o=yb.start,p="";if(Rb)a.each(Ib,function(a,b){Pb?Gb.push(b.center):b.start+b.size>o&&o<=yb.end&&(o=b.start,Gb.push(o),o+=wb,o>yb.end&&o<yb.end+wb&&Gb.push(yb.end))});else for(;o-wb<yb.end;)Gb.push(o),o+=wb;if(Eb[0]&&e!==Gb.length){for(var q=0;q<Gb.length;q++)p+=rb.pageBuilder.call(sb,q);Fb=Eb.html(p).children(),Fb.eq(Jb.activePage).addClass(rb.activeClass)}}if(Jb.slideeSize=xb,Jb.frameSize=wb,Jb.sbSize=Bb,Jb.handleSize=Cb,Rb){c&&null!=rb.startAt&&(T(rb.startAt),sb[Qb?"toCenter":"toStart"](rb.startAt));var r=Ib[Jb.activeItem];L(Qb&&r?r.center:k(yb.dest,yb.start,yb.end))}else c?null!=rb.startAt&&L(rb.startAt,1):L(k(yb.dest,yb.start,yb.end));ob("load")}function L(a,b,c){if(Rb&&cc.released&&!c){var d=U(a),e=a>yb.start&&a<yb.end;Qb?(e&&(a=Ib[d.centerItem].center),Pb&&rb.activateMiddle&&T(d.centerItem)):e&&(a=Ib[d.firstItem].start)}cc.init&&cc.slidee&&rb.elasticBounds?a>yb.end?a=yb.end+(a-yb.end)/6:a<yb.start&&(a=yb.start+(a-yb.start)/6):a=k(a,yb.start,yb.end),ac.start=+new Date,ac.time=0,ac.from=yb.cur,ac.to=a,ac.delta=a-yb.cur,ac.tweesing=cc.tweese||cc.init&&!cc.slidee,ac.immediate=!ac.tweesing&&(b||cc.init&&cc.slidee||!rb.speed),cc.tweese=0,a!==yb.dest&&(yb.dest=a,ob("change"),ec||M()),Z(),V(),W(),O()}function M(){if(sb.initialized){if(!ec)return ec=t(M),void(cc.released&&ob("moveStart"));ac.immediate?yb.cur=ac.to:ac.tweesing?(ac.tweeseDelta=ac.to-yb.cur,D(ac.tweeseDelta)<.1?yb.cur=ac.to:yb.cur+=ac.tweeseDelta*(cc.released?rb.swingSpeed:rb.syncSpeed)):(ac.time=I(+new Date-ac.start,rb.speed),yb.cur=ac.from+ac.delta*a.easing[rb.easing](ac.time/rb.speed,ac.time,0,1,rb.speed)),ac.to===yb.cur?(yb.cur=ac.to,cc.tweese=ec=0):ec=t(M),ob("move"),tb||(m?vb[0].style[m]=n+(rb.horizontal?"translateX":"translateY")+"("+-yb.cur+"px)":vb[0].style[rb.horizontal?"left":"top"]=-G(yb.cur)+"px"),!ec&&cc.released&&ob("moveEnd"),N()}}function N(){Ab.length&&(Db.cur=yb.start===yb.end?0:((cc.init&&!cc.slidee?yb.dest:yb.cur)-yb.start)/(yb.end-yb.start)*Db.end,Db.cur=k(G(Db.cur),Db.start,Db.end),_b.hPos!==Db.cur&&(_b.hPos=Db.cur,m?Ab[0].style[m]=n+(rb.horizontal?"translateX":"translateY")+"("+Db.cur+"px)":Ab[0].style[rb.horizontal?"left":"top"]=Db.cur+"px"))}function O(){Fb[0]&&_b.page!==Jb.activePage&&(_b.page=Jb.activePage,Fb.removeClass(rb.activeClass).eq(Jb.activePage).addClass(rb.activeClass),ob("activePage",_b.page))}function P(){bc.speed&&yb.cur!==(bc.speed>0?yb.end:yb.start)||sb.stop(),hc=cc.init?t(P):0,bc.now=+new Date,bc.pos=yb.cur+(bc.now-bc.lastTime)/1e3*bc.speed,L(cc.init?bc.pos:G(bc.pos)),cc.init||yb.cur!==yb.dest||ob("moveEnd"),bc.lastTime=bc.now}function Q(a,b,d){if("boolean"===e(b)&&(d=b,b=c),b===c)L(yb[a],d);else{if(Qb&&"center"!==a)return;var f=sb.getPos(b);f&&L(f[a],d,!Qb)}}function R(a){return null!=a?i(a)?a>=0&&a<Ib.length?a:-1:Hb.index(a):-1}function S(a){return R(i(a)&&0>a?a+Ib.length:a)}function T(a,b){var c=R(a);return!Rb||0>c?!1:((_b.active!==c||b)&&(Hb.eq(Jb.activeItem).removeClass(rb.activeClass),Hb.eq(c).addClass(rb.activeClass),_b.active=Jb.activeItem=c,W(),ob("active",c)),c)}function U(a){a=k(i(a)?a:yb.dest,yb.start,yb.end);var b={},c=Pb?0:wb/2;if(!tb)for(var d=0,e=Gb.length;e>d;d++){if(a>=yb.end||d===Gb.length-1){b.activePage=Gb.length-1;break}if(a<=Gb[d]+c){b.activePage=d;break}}if(Rb){for(var f=!1,g=!1,h=!1,j=0,l=Ib.length;l>j;j++)if(f===!1&&a<=Ib[j].start+Ib[j].half&&(f=j),h===!1&&a<=Ib[j].center+Ib[j].half&&(h=j),j===l-1||a<=Ib[j].end+Ib[j].half){g=j;break}b.firstItem=i(f)?f:0,b.centerItem=i(h)?h:b.firstItem,b.lastItem=i(g)?g:b.centerItem}return b}function V(b){a.extend(Jb,U(b))}function W(){var a=yb.dest<=yb.start,b=yb.dest>=yb.end,c=(a?1:0)|(b?2:0);if(_b.slideePosState!==c&&(_b.slideePosState=c,Yb.is("button,input")&&Yb.prop("disabled",a),Zb.is("button,input")&&Zb.prop("disabled",b),Yb.add(Vb)[a?"addClass":"removeClass"](rb.disabledClass),Zb.add(Ub)[b?"addClass":"removeClass"](rb.disabledClass)),_b.fwdbwdState!==c&&cc.released&&(_b.fwdbwdState=c,Vb.is("button,input")&&Vb.prop("disabled",a),Ub.is("button,input")&&Ub.prop("disabled",b)),Rb&&null!=Jb.activeItem){var d=0===Jb.activeItem,e=Jb.activeItem>=Ib.length-1,f=(d?1:0)|(e?2:0);_b.itemsButtonState!==f&&(_b.itemsButtonState=f,Wb.is("button,input")&&Wb.prop("disabled",d),Xb.is("button,input")&&Xb.prop("disabled",e),Wb[d?"addClass":"removeClass"](rb.disabledClass),Xb[e?"addClass":"removeClass"](rb.disabledClass))}}function X(a,b,c){if(a=S(a),b=S(b),a>-1&&b>-1&&a!==b&&(!c||b!==a-1)&&(c||b!==a+1)){Hb.eq(a)[c?"insertAfter":"insertBefore"](Ib[b].el);var d=b>a?a:c?b:b-1,e=a>b?a:c?b+1:b,f=a>b;null!=Jb.activeItem&&(a===Jb.activeItem?_b.active=Jb.activeItem=c?f?b+1:b:f?b:b-1:Jb.activeItem>d&&Jb.activeItem<e&&(_b.active=Jb.activeItem+=f?1:-1)),K()}}function Y(a,b){for(var c=0,d=$b[a].length;d>c;c++)if($b[a][c]===b)return c;return-1}function Z(){cc.released&&!sb.isPaused&&sb.resume()}function $(a){return G(k(a,Db.start,Db.end)/Db.end*(yb.end-yb.start))+yb.start}function _(){cc.history[0]=cc.history[1],cc.history[1]=cc.history[2],cc.history[2]=cc.history[3],cc.history[3]=cc.delta}function ab(a){cc.released=0,cc.source=a,cc.slidee="slidee"===a}function bb(b){var c="touchstart"===b.type,d=b.data.source,e="slidee"===d;cc.init||!c&&eb(b.target)||("handle"!==d||rb.dragHandle&&Db.start!==Db.end)&&(!e||(c?rb.touchDragging:rb.mouseDragging&&b.which<2))&&(c||f(b),ab(d),cc.init=0,cc.$source=a(b.target),cc.touch=c,cc.pointer=c?b.originalEvent.touches[0]:b,cc.initX=cc.pointer.pageX,cc.initY=cc.pointer.pageY,cc.initPos=e?yb.cur:Db.cur,cc.start=+new Date,cc.time=0,cc.path=0,cc.delta=0,cc.locked=0,cc.history=[0,0,0,0],cc.pathToLock=e?c?30:10:0,u.on(c?x:w,cb),sb.pause(1),(e?vb:Ab).addClass(rb.draggedClass),ob("moveStart"),e&&(fc=setInterval(_,10)))}function cb(a){if(cc.released="mouseup"===a.type||"touchend"===a.type,cc.pointer=cc.touch?a.originalEvent[cc.released?"changedTouches":"touches"][0]:a,cc.pathX=cc.pointer.pageX-cc.initX,cc.pathY=cc.pointer.pageY-cc.initY,cc.path=E(F(cc.pathX,2)+F(cc.pathY,2)),cc.delta=rb.horizontal?cc.pathX:cc.pathY,cc.released||!(cc.path<1)){if(!cc.init){if(!(rb.horizontal?D(cc.pathX)>D(cc.pathY):D(cc.pathX)<D(cc.pathY)))return db();cc.init=1}f(a),!cc.locked&&cc.path>cc.pathToLock&&cc.slidee&&(cc.locked=1,cc.$source.on(z,g)),cc.released&&(db(),rb.releaseSwing&&cc.slidee&&(cc.swing=(cc.delta-cc.history[0])/40*300,cc.delta+=cc.swing,cc.tweese=D(cc.swing)>10)),L(cc.slidee?G(cc.initPos-cc.delta):$(cc.initPos+cc.delta))}}function db(){clearInterval(fc),cc.released=!0,u.off(cc.touch?x:w,cb),(cc.slidee?vb:Ab).removeClass(rb.draggedClass),setTimeout(function(){cc.$source.off(z,g)}),yb.cur===yb.dest&&cc.init&&ob("moveEnd"),sb.resume(1),cc.init=0}function eb(b){return~a.inArray(b.nodeName,B)||a(b).is(rb.interactive)}function fb(){sb.stop(),u.off("mouseup",fb)}function gb(a){switch(f(a),this){case Ub[0]:case Vb[0]:sb.moveBy(Ub.is(this)?rb.moveBy:-rb.moveBy),u.on("mouseup",fb);break;case Wb[0]:sb.prev();break;case Xb[0]:sb.next();break;case Yb[0]:sb.prevPage();break;case Zb[0]:sb.nextPage()}}function hb(a){return dc.curDelta=(rb.horizontal?a.deltaY||a.deltaX:a.deltaY)||-a.wheelDelta,dc.curDelta/=1===a.deltaMode?3:100,Rb?(o=+new Date,dc.last<o-dc.resetTime&&(dc.delta=0),dc.last=o,dc.delta+=dc.curDelta,D(dc.delta)<1?dc.finalDelta=0:(dc.finalDelta=G(dc.delta/1),dc.delta%=1),dc.finalDelta):dc.curDelta}function ib(a){a.originalEvent[r]=sb;var b=+new Date;if(J+rb.scrollHijack>b&&Sb[0]!==document&&Sb[0]!==window)return void(J=b);if(rb.scrollBy&&yb.start!==yb.end){var c=hb(a.originalEvent);(rb.scrollTrap||c>0&&yb.dest<yb.end||0>c&&yb.dest>yb.start)&&f(a,1),sb.slideBy(rb.scrollBy*c)}}function jb(a){rb.clickBar&&a.target===zb[0]&&(f(a),L($((rb.horizontal?a.pageX-zb.offset().left:a.pageY-zb.offset().top)-Cb/2)))}function kb(a){if(rb.keyboardNavBy)switch(a.which){case rb.horizontal?37:38:f(a),sb["pages"===rb.keyboardNavBy?"prevPage":"prev"]();break;case rb.horizontal?39:40:f(a),sb["pages"===rb.keyboardNavBy?"nextPage":"next"]()}}function lb(a){return eb(this)?void(a.originalEvent[r+"ignore"]=!0):void(this.parentNode!==vb[0]||a.originalEvent[r+"ignore"]||sb.activate(this))}function mb(){this.parentNode===Eb[0]&&sb.activatePage(Fb.index(this))}function nb(a){rb.pauseOnHover&&sb["mouseenter"===a.type?"pause":"resume"](2)}function ob(a,b){if($b[a]){for(qb=$b[a].length,C.length=0,pb=0;qb>pb;pb++)C.push($b[a][pb]);for(pb=0;qb>pb;pb++)C[pb].call(sb,a,b)}}var pb,qb,rb=a.extend({},d.defaults,p),sb=this,tb=i(b),ub=a(b),vb=rb.slidee?a(rb.slidee).eq(0):ub.children().eq(0),wb=0,xb=0,yb={start:0,center:0,end:0,cur:0,dest:0},zb=a(rb.scrollBar).eq(0),Ab=zb.children().eq(0),Bb=0,Cb=0,Db={start:0,end:0,cur:0},Eb=a(rb.pagesBar),Fb=0,Gb=[],Hb=0,Ib=[],Jb={firstItem:0,lastItem:0,centerItem:0,activeItem:null,activePage:0},Kb=new l(ub[0]),Lb=new l(vb[0]),Mb=new l(zb[0]),Nb=new l(Ab[0]),Ob="basic"===rb.itemNav,Pb="forceCentered"===rb.itemNav,Qb="centered"===rb.itemNav||Pb,Rb=!tb&&(Ob||Qb||Pb),Sb=rb.scrollSource?a(rb.scrollSource):ub,Tb=rb.dragSource?a(rb.dragSource):ub,Ub=a(rb.forward),Vb=a(rb.backward),Wb=a(rb.prev),Xb=a(rb.next),Yb=a(rb.prevPage),Zb=a(rb.nextPage),$b={},_b={},ac={},bc={},cc={released:1},dc={last:0,delta:0,resetTime:200},ec=0,fc=0,gc=0,hc=0;tb||(b=ub[0]),sb.initialized=0,sb.frame=b,sb.slidee=vb[0],sb.pos=yb,sb.rel=Jb,sb.items=Ib,sb.pages=Gb,sb.isPaused=0,sb.options=rb,sb.dragging=cc,sb.reload=function(){K()},sb.getPos=function(a){if(Rb){var b=R(a);return-1!==b?Ib[b]:!1}var c=vb.find(a).eq(0);if(c[0]){var d=rb.horizontal?c.offset().left-vb.offset().left:c.offset().top-vb.offset().top,e=c[rb.horizontal?"outerWidth":"outerHeight"]();return{start:d,center:d-wb/2+e/2,end:d-wb+e,size:e}}return!1},sb.moveBy=function(a){bc.speed=a,!cc.init&&bc.speed&&yb.cur!==(bc.speed>0?yb.end:yb.start)&&(bc.lastTime=+new Date,bc.startPos=yb.cur,ab("button"),cc.init=1,ob("moveStart"),s(hc),P())},sb.stop=function(){"button"===cc.source&&(cc.init=0,cc.released=1)},sb.prev=function(){sb.activate(null==Jb.activeItem?0:Jb.activeItem-1)},sb.next=function(){sb.activate(null==Jb.activeItem?0:Jb.activeItem+1)},sb.prevPage=function(){sb.activatePage(Jb.activePage-1)},sb.nextPage=function(){sb.activatePage(Jb.activePage+1)},sb.slideBy=function(a,b){a&&(Rb?sb[Qb?"toCenter":"toStart"](k((Qb?Jb.centerItem:Jb.firstItem)+rb.scrollBy*a,0,Ib.length)):L(yb.dest+a,b))},sb.slideTo=function(a,b){L(a,b)},sb.toStart=function(a,b){Q("start",a,b)},sb.toEnd=function(a,b){Q("end",a,b)},sb.toCenter=function(a,b){Q("center",a,b)},sb.getIndex=R,sb.activate=function(a,b){var c=T(a);rb.smart&&c!==!1&&(Qb?sb.toCenter(c,b):c>=Jb.lastItem?sb.toStart(c,b):c<=Jb.firstItem?sb.toEnd(c,b):Z())},sb.activatePage=function(a,b){i(a)&&L(Gb[k(a,0,Gb.length-1)],b)},sb.resume=function(a){rb.cycleBy&&rb.cycleInterval&&("items"!==rb.cycleBy||Ib[0]&&null!=Jb.activeItem)&&!(a<sb.isPaused)&&(sb.isPaused=0,gc?gc=clearTimeout(gc):ob("resume"),gc=setTimeout(function(){switch(ob("cycle"),rb.cycleBy){case"items":sb.activate(Jb.activeItem>=Ib.length-1?0:Jb.activeItem+1);break;case"pages":sb.activatePage(Jb.activePage>=Gb.length-1?0:Jb.activePage+1)}},rb.cycleInterval))},sb.pause=function(a){a<sb.isPaused||(sb.isPaused=a||100,gc&&(gc=clearTimeout(gc),ob("pause")))},sb.toggle=function(){sb[gc?"pause":"resume"]()},sb.set=function(b,c){a.isPlainObject(b)?a.extend(rb,b):rb.hasOwnProperty(b)&&(rb[b]=c)},sb.add=function(b,c){var d=a(b);Rb?(null==c||!Ib[0]||c>=Ib.length?d.appendTo(vb):Ib.length&&d.insertBefore(Ib[c].el),null!=Jb.activeItem&&c<=Jb.activeItem&&(_b.active=Jb.activeItem+=d.length)):vb.append(d),K()},sb.remove=function(b){if(Rb){var c=S(b);if(c>-1){Hb.eq(c).remove();var d=c===Jb.activeItem;null!=Jb.activeItem&&c<Jb.activeItem&&(_b.active=--Jb.activeItem),K(),d&&(_b.active=null,sb.activate(Jb.activeItem))}}else a(b).remove(),K()},sb.moveAfter=function(a,b){X(a,b,1)},sb.moveBefore=function(a,b){X(a,b)},sb.on=function(a,b){if("object"===e(a))for(var c in a)a.hasOwnProperty(c)&&sb.on(c,a[c]);else if("function"===e(b))for(var d=a.split(" "),f=0,g=d.length;g>f;f++)$b[d[f]]=$b[d[f]]||[],-1===Y(d[f],b)&&$b[d[f]].push(b);else if("array"===e(b))for(var h=0,i=b.length;i>h;h++)sb.on(a,b[h])},sb.one=function(a,b){function c(){b.apply(sb,arguments),sb.off(a,c)}sb.on(a,c)},sb.off=function(a,b){if(b instanceof Array)for(var c=0,d=b.length;d>c;c++)sb.off(a,b[c]);else for(var e=a.split(" "),f=0,g=e.length;g>f;f++)if($b[e[f]]=$b[e[f]]||[],null==b)$b[e[f]].length=0;else{var h=Y(e[f],b);-1!==h&&$b[e[f]].splice(h,1)}},sb.destroy=function(){return Sb.add(Ab).add(zb).add(Eb).add(Ub).add(Vb).add(Wb).add(Xb).add(Yb).add(Zb).off("."+r),u.off("keydown",kb),Wb.add(Xb).add(Yb).add(Zb).removeClass(rb.disabledClass),Hb&&null!=Jb.activeItem&&Hb.eq(Jb.activeItem).removeClass(rb.activeClass),Eb.empty(),tb||(ub.off("."+r),Kb.restore(),Lb.restore(),Mb.restore(),Nb.restore(),a.removeData(b,r)),Ib.length=Gb.length=0,_b={},sb.initialized=0,sb},sb.init=function(){if(!sb.initialized){sb.on(q);var a=["overflow","position"],b=["position","webkitTransform","msTransform","transform","left","top","width","height"];Kb.save.apply(Kb,a),Mb.save.apply(Mb,a),Lb.save.apply(Lb,b),Nb.save.apply(Nb,b);var c=Ab;return tb||(c=c.add(vb),ub.css("overflow","hidden"),m||"static"!==ub.css("position")||ub.css("position","relative")),m?n&&c.css(m,n):("static"===zb.css("position")&&zb.css("position","relative"),c.css({position:"absolute"})),rb.forward&&Ub.on(A,gb),rb.backward&&Vb.on(A,gb),rb.prev&&Wb.on(z,gb),rb.next&&Xb.on(z,gb),rb.prevPage&&Yb.on(z,gb),rb.nextPage&&Zb.on(z,gb),Sb.on(y,ib),zb[0]&&zb.on(z,jb),Rb&&rb.activateOn&&ub.on(rb.activateOn+"."+r,"*",lb),Eb[0]&&rb.activatePageOn&&Eb.on(rb.activatePageOn+"."+r,"*",mb),Tb.on(v,{source:"slidee"},bb),Ab&&Ab.on(v,{source:"handle"},bb),u.on("keydown",kb),tb||(ub.on("mouseenter."+r+" mouseleave."+r,nb),ub.on("scroll."+r,h)),sb.initialized=1,K(!0),rb.cycleBy&&!tb&&sb[rb.startPaused?"pause":"resume"](),sb}}}function e(a){return null==a?String(a):"object"==typeof a||"function"==typeof a?Object.prototype.toString.call(a).match(/\s([a-z]+)/i)[1].toLowerCase()||"object":typeof a}function f(a,b){a.preventDefault(),b&&a.stopPropagation()}function g(b){f(b,1),a(this).off(b.type,g)}function h(){this.scrollLeft=0,this.scrollTop=0}function i(a){return!isNaN(parseFloat(a))&&isFinite(a)}function j(a,b){return 0|G(String(a.css(b)).replace(/[^\-0-9.]/g,""))}function k(a,b,c){return b>a?b:a>c?c:a}function l(a){var b={};return b.style={},b.save=function(){if(a&&a.nodeType){for(var c=0;c<arguments.length;c++)b.style[arguments[c]]=a.style[arguments[c]];return b}},b.restore=function(){if(a&&a.nodeType){for(var c in b.style)b.style.hasOwnProperty(c)&&(a.style[c]=b.style[c]);return b}},b}var m,n,o,p="sly",q="Sly",r=p,s=b.cancelAnimationFrame||b.cancelRequestAnimationFrame,t=b.requestAnimationFrame,u=a(document),v="touchstart."+r+" mousedown."+r,w="mousemove."+r+" mouseup."+r,x="touchmove."+r+" touchend."+r,y=(document.implementation.hasFeature("Event.wheel","3.0")?"wheel.":"mousewheel.")+r,z="click."+r,A="mousedown."+r,B=["INPUT","SELECT","BUTTON","TEXTAREA"],C=[],D=Math.abs,E=Math.sqrt,F=Math.pow,G=Math.round,H=Math.max,I=Math.min,J=0;u.on(y,function(a){var b=a.originalEvent[r],c=+new Date;(!b||b.options.scrollHijack<c-J)&&(J=c)}),function(a){function b(a){var b=(new Date).getTime(),d=Math.max(0,16-(b-c)),e=setTimeout(a,d);return c=b,e}t=a.requestAnimationFrame||a.webkitRequestAnimationFrame||b;var c=(new Date).getTime(),d=a.cancelAnimationFrame||a.webkitCancelAnimationFrame||a.clearTimeout;s=function(b){d.call(a,b)}}(window),function(){function a(a){for(var d=0,e=b.length;e>d;d++){var f=b[d]?b[d]+a.charAt(0).toUpperCase()+a.slice(1):a;if(null!=c.style[f])return f}}var b=["","webkit","moz","ms","o"],c=document.createElement("div");m=a("transform"),n=a("perspective")?"translateZ(0) ":""}(),b[q]=d,a.fn[p]=function(b,c){var f,g;return a.isPlainObject(b)||(("string"===e(b)||b===!1)&&(f=b===!1?"destroy":b,g=Array.prototype.slice.call(arguments,1)),b={}),this.each(function(e,h){var i=a.data(h,r);i||f?i&&f&&i[f]&&i[f].apply(i,g):i=a.data(h,r,new d(h,b,c).init())})},d.defaults={slidee:null,horizontal:!1,itemNav:null,itemSelector:null,smart:!1,activateOn:null,activateMiddle:!1,scrollSource:null,scrollBy:0,scrollHijack:300,scrollTrap:!1,dragSource:null,mouseDragging:!1,touchDragging:!1,releaseSwing:!1,swingSpeed:.2,elasticBounds:!1,interactive:null,scrollBar:null,dragHandle:!1,dynamicHandle:!1,minHandleSize:50,clickBar:!1,syncSpeed:.5,pagesBar:null,activatePageOn:null,pageBuilder:function(a){return"<li>"+(a+1)+"</li>"},forward:null,backward:null,prev:null,next:null,prevPage:null,nextPage:null,cycleBy:null,cycleInterval:5e3,pauseOnHover:!1,startPaused:!1,moveBy:300,speed:0,easing:"swing",startAt:null,keyboardNavBy:null,draggedClass:"dragged",activeClass:"active",disabledClass:"disabled"}}(jQuery,window);




/*!
 * sly 1.6.1 - 8th Aug 2015
 * https://github.com/darsain/sly
 *
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 */

;(function ($, w, undefined) {
	'use strict';

	var pluginName = 'sly';
	var className  = 'Sly';
	var namespace  = pluginName;

	// Local WindowAnimationTiming interface
	var cAF = w.cancelAnimationFrame || w.cancelRequestAnimationFrame;
	var rAF = w.requestAnimationFrame;

	// Support indicators
	var transform, gpuAcceleration;

	// Other global values
	var $doc = $(document);
	var dragInitEvents = 'touchstart.' + namespace + ' mousedown.' + namespace;
	var dragMouseEvents = 'mousemove.' + namespace + ' mouseup.' + namespace;
	var dragTouchEvents = 'touchmove.' + namespace + ' touchend.' + namespace;
	var wheelEvent = (document.implementation.hasFeature('Event.wheel', '3.0') ? 'wheel.' : 'mousewheel.') + namespace;
	var clickEvent = 'click.' + namespace;
	var mouseDownEvent = 'mousedown.' + namespace;
	var interactiveElements = ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'];
	var tmpArray = [];
	var time;

	// Math shorthands
	var abs = Math.abs;
	var sqrt = Math.sqrt;
	var pow = Math.pow;
	var round = Math.round;
	var max = Math.max;
	var min = Math.min;

	// Keep track of last fired global wheel event
	var lastGlobalWheel = 0;
	$doc.on(wheelEvent, function (event) {
		var sly = event.originalEvent[namespace];
		var time = +new Date();
		// Update last global wheel time, but only when event didn't originate
		// in Sly frame, or the origin was less than scrollHijack time ago
		if (!sly || sly.options.scrollHijack < time - lastGlobalWheel) lastGlobalWheel = time;
	});

	/**
	 * Sly.
	 *
	 * @class
	 *
	 * @param {Element} frame       DOM element of sly container.
	 * @param {Object}  options     Object with options.
	 * @param {Object}  callbackMap Callbacks map.
	 */
	function Sly(frame, options, callbackMap) {
		if (!(this instanceof Sly)) return new Sly(frame, options, callbackMap);

		// Extend options
		var o = $.extend({}, Sly.defaults, options);

		// Private variables
		var self = this;
		var parallax = isNumber(frame);

		// Frame
		var $frame = $(frame);
		var $slidee = o.slidee ? $(o.slidee).eq(0) : $frame.children().eq(0);
		var frameSize = 0;
		var slideeSize = 0;
		var pos = {
			start: 0,
			center: 0,
			end: 0,
			cur: 0,
			dest: 0
		};

		// Scrollbar
		var $sb = $(o.scrollBar).eq(0);
		var $handle = $sb.children().eq(0);
		var sbSize = 0;
		var handleSize = 0;
		var hPos = {
			start: 0,
			end: 0,
			cur: 0
		};

		// Pagesbar
		var $pb = $(o.pagesBar);
		var $pages = 0;
		var pages = [];

		// Items
		var $items = 0;
		var items = [];
		var rel = {
			firstItem: 0,
			lastItem: 0,
			centerItem: 0,
			activeItem: null,
			activePage: 0
		};

		// Styles
		var frameStyles = new StyleRestorer($frame[0]);
		var slideeStyles = new StyleRestorer($slidee[0]);
		var sbStyles = new StyleRestorer($sb[0]);
		var handleStyles = new StyleRestorer($handle[0]);

		// Navigation type booleans
		var basicNav = o.itemNav === 'basic';
		var forceCenteredNav = o.itemNav === 'forceCentered';
		var centeredNav = o.itemNav === 'centered' || forceCenteredNav;
		var itemNav = !parallax && (basicNav || centeredNav || forceCenteredNav);

		// Miscellaneous
		var $scrollSource = o.scrollSource ? $(o.scrollSource) : $frame;
		var $dragSource = o.dragSource ? $(o.dragSource) : $frame;
		var $forwardButton = $(o.forward);
		var $backwardButton = $(o.backward);
		var $prevButton = $(o.prev);
		var $nextButton = $(o.next);
		var $prevPageButton = $(o.prevPage);
		var $nextPageButton = $(o.nextPage);
		var callbacks = {};
		var last = {};
		var animation = {};
		var move = {};
		var dragging = {
			released: 1
		};
		var scrolling = {
			last: 0,
			delta: 0,
			resetTime: 200
		};
		var renderID = 0;
		var historyID = 0;
		var cycleID = 0;
		var continuousID = 0;
		var i, l;

		// Normalizing frame
		if (!parallax) {
			frame = $frame[0];
		}

		// Expose properties
		self.initialized = 0;
		self.frame = frame;
		self.slidee = $slidee[0];
		self.pos = pos;
		self.rel = rel;
		self.items = items;
		self.pages = pages;
		self.isPaused = 0;
		self.options = o;
		self.dragging = dragging;

		/**
		 * Loading function.
		 *
		 * Populate arrays, set sizes, bind events, ...
		 *
		 * @param {Boolean} [isInit] Whether load is called from within self.init().
		 * @return {Void}
		 */
		function load(isInit) {
			// Local variables
			var lastItemsCount = 0;
			var lastPagesCount = pages.length;

			// Save old position
			pos.old = $.extend({}, pos);

			// Reset global variables
			frameSize = parallax ? 0 : $frame[o.horizontal ? 'width' : 'height']();
			sbSize = $sb[o.horizontal ? 'width' : 'height']();
			slideeSize = parallax ? frame : $slidee[o.horizontal ? 'outerWidth' : 'outerHeight']();
			pages.length = 0;

			// Set position limits & relatives
			pos.start = 0;
			pos.end = max(slideeSize - frameSize, 0);

			// Sizes & offsets for item based navigations
			if (itemNav) {
				// Save the number of current items
				lastItemsCount = items.length;

				// Reset itemNav related variables
				$items = $slidee.children(o.itemSelector);
				items.length = 0;

				// Needed variables
				var paddingStart = getPx($slidee, o.horizontal ? 'paddingLeft' : 'paddingTop');
				var paddingEnd = getPx($slidee, o.horizontal ? 'paddingRight' : 'paddingBottom');
				var borderBox = $($items).css('boxSizing') === 'border-box';
				var areFloated = $items.css('float') !== 'none';
				var ignoredMargin = 0;
				var lastItemIndex = $items.length - 1;
				var lastItem;

				// Reset slideeSize
				slideeSize = 0;

				// Iterate through items
				$items.each(function (i, element) {
					// Item
					var $item = $(element);
					var rect = Helpers.modifyRect(element.getBoundingClientRect());
					var itemSize = round(o.horizontal ? rect.width || rect.right - rect.left : rect.height || rect.bottom - rect.top);
					var itemMarginStart = getPx($item, o.horizontal ? 'marginLeft' : 'marginTop');
					var itemMarginEnd = getPx($item, o.horizontal ? 'marginRight' : 'marginBottom');
					var itemSizeFull = itemSize + itemMarginStart + itemMarginEnd;
					var singleSpaced = !itemMarginStart || !itemMarginEnd;
					var item = {};
					item.el = element;
					item.size = singleSpaced ? itemSize : itemSizeFull;
					item.half = item.size / 2;
					item.start = slideeSize + (singleSpaced ? itemMarginStart : 0);
					item.center = item.start - round(frameSize / 2 - item.size / 2);
					item.end = item.start - frameSize + item.size;

					// Account for slidee padding
					if (!i) {
						slideeSize += paddingStart;
					}

					// Increment slidee size for size of the active element
					slideeSize += itemSizeFull;

					// Try to account for vertical margin collapsing in vertical mode
					// It's not bulletproof, but should work in 99% of cases
					if (!o.horizontal && !areFloated) {
						// Subtract smaller margin, but only when top margin is not 0, and this is not the first element
						if (itemMarginEnd && itemMarginStart && i > 0) {
							slideeSize -= min(itemMarginStart, itemMarginEnd);
						}
					}

					// Things to be done on last item
					if (i === lastItemIndex) {
						item.end += paddingEnd;
						slideeSize += paddingEnd;
						ignoredMargin = singleSpaced ? itemMarginEnd : 0;
					}

					// Add item object to items array
					items.push(item);
					lastItem = item;
				});

				// Resize SLIDEE to fit all items
				$slidee[0].style[o.horizontal ? 'width' : 'height'] = (borderBox ? slideeSize: slideeSize - paddingStart - paddingEnd) + 'px';

				// Adjust internal SLIDEE size for last margin
				slideeSize -= ignoredMargin;

				// Set limits
				if (items.length) {
					pos.start =  items[0][forceCenteredNav ? 'center' : 'start'];
					pos.end = forceCenteredNav ? lastItem.center : frameSize < slideeSize ? lastItem.end : pos.start;
				} else {
					pos.start = pos.end = 0;
				}
			}

			// Calculate SLIDEE center position
			pos.center = round(pos.end / 2 + pos.start / 2);

			// Update relative positions
			updateRelatives();

			// Scrollbar
			if ($handle.length && sbSize > 0) {
				// Stretch scrollbar handle to represent the visible area
				if (o.dynamicHandle) {
					handleSize = pos.start === pos.end ? sbSize : round(sbSize * frameSize / slideeSize);
					handleSize = within(handleSize, o.minHandleSize, sbSize);
					$handle[0].style[o.horizontal ? 'width' : 'height'] = handleSize + 'px';
				} else {
					handleSize = $handle[o.horizontal ? 'outerWidth' : 'outerHeight']();
				}

				hPos.end = sbSize - handleSize;

				if (!renderID) {
					syncScrollbar();
				}
			}

			// Pages
			if (!parallax && frameSize > 0) {
				var tempPagePos = pos.start;
				var pagesHtml = '';

				// Populate pages array
				if (itemNav) {
					$.each(items, function (i, item) {
						if (forceCenteredNav) {
							pages.push(item.center);
						} else if (item.start + item.size > tempPagePos && tempPagePos <= pos.end) {
							tempPagePos = item.start;
							pages.push(tempPagePos);
							tempPagePos += frameSize;
							if (tempPagePos > pos.end && tempPagePos < pos.end + frameSize) {
								pages.push(pos.end);
							}
						}
					});
				} else {
					while (tempPagePos - frameSize < pos.end) {
						pages.push(tempPagePos);
						tempPagePos += frameSize;
					}
				}

				// Pages bar
				if ($pb[0] && lastPagesCount !== pages.length) {
					for (var i = 0; i < pages.length; i++) {
						pagesHtml += o.pageBuilder.call(self, i);
					}
					$pages = $pb.html(pagesHtml).children();
					$pages.eq(rel.activePage).addClass(o.activeClass);
				}
			}

			// Extend relative variables object with some useful info
			rel.slideeSize = slideeSize;
			rel.frameSize = frameSize;
			rel.sbSize = sbSize;
			rel.handleSize = handleSize;

			// Activate requested position
			if (itemNav) {
				if (isInit && o.startAt != null) {
					activate(o.startAt);
					self[centeredNav ? 'toCenter' : 'toStart'](o.startAt);
				}
				// Fix possible overflowing
				var activeItem = items[rel.activeItem];
				slideTo(centeredNav && activeItem ? activeItem.center : within(pos.dest, pos.start, pos.end));
			} else {
				if (isInit) {
					if (o.startAt != null) slideTo(o.startAt, 1);
				} else {
					// Fix possible overflowing
					slideTo(within(pos.dest, pos.start, pos.end));
				}
			}

			// Trigger load event
			trigger('load');
		}
		self.reload = function () { load(); };

		/**
		 * Animate to a position.
		 *
		 * @param {Int}  newPos    New position.
		 * @param {Bool} immediate Reposition immediately without an animation.
		 * @param {Bool} dontAlign Do not align items, use the raw position passed in first argument.
		 *
		 * @return {Void}
		 */
		function slideTo(newPos, immediate, dontAlign) {
			// Align items
			if (itemNav && dragging.released && !dontAlign) {
				var tempRel = getRelatives(newPos);
				var isNotBordering = newPos > pos.start && newPos < pos.end;

				if (centeredNav) {
					if (isNotBordering) {
						newPos = items[tempRel.centerItem].center;
					}
					if (forceCenteredNav && o.activateMiddle) {
						activate(tempRel.centerItem);
					}
				} else if (isNotBordering) {
					newPos = items[tempRel.firstItem].start;
				}
			}

			// Handle overflowing position limits
			if (dragging.init && dragging.slidee && o.elasticBounds) {
				if (newPos > pos.end) {
					newPos = pos.end + (newPos - pos.end) / 6;
				} else if (newPos < pos.start) {
					newPos = pos.start + (newPos - pos.start) / 6;
				}
			} else {
				newPos = within(newPos, pos.start, pos.end);
			}

			// Update the animation object
			animation.start = +new Date();
			animation.time = 0;
			animation.from = pos.cur;
			animation.to = newPos;
			animation.delta = newPos - pos.cur;
			animation.tweesing = dragging.tweese || dragging.init && !dragging.slidee;
			animation.immediate = !animation.tweesing && (immediate || dragging.init && dragging.slidee || !o.speed);

			// Reset dragging tweesing request
			dragging.tweese = 0;

			// Start animation rendering
			if (newPos !== pos.dest) {
				pos.dest = newPos;
				trigger('change');
				if (!renderID) {
					render();
				}
			}

			// Reset next cycle timeout
			resetCycle();

			// Synchronize states
			updateRelatives();
			updateButtonsState();
			syncPagesbar();
		}

		/**
		 * Render animation frame.
		 *
		 * @return {Void}
		 */
		function render() {
			if (!self.initialized) {
				return;
			}

			// If first render call, wait for next animationFrame
			if (!renderID) {
				renderID = rAF(render);
				if (dragging.released) {
					trigger('moveStart');
				}
				return;
			}

			// If immediate repositioning is requested, don't animate.
			if (animation.immediate) {
				pos.cur = animation.to;
			}
			// Use tweesing for animations without known end point
			else if (animation.tweesing) {
				animation.tweeseDelta = animation.to - pos.cur;
				// Fuck Zeno's paradox
				if (abs(animation.tweeseDelta) < 0.1) {
					pos.cur = animation.to;
				} else {
					pos.cur += animation.tweeseDelta * (dragging.released ? o.swingSpeed : o.syncSpeed);
				}
			}
			// Use tweening for basic animations with known end point
			else {
				animation.time = min(+new Date() - animation.start, o.speed);
				pos.cur = animation.from + animation.delta * $.easing[o.easing](animation.time/o.speed, animation.time, 0, 1, o.speed);
			}

			// If there is nothing more to render break the rendering loop, otherwise request new animation frame.
			if (animation.to === pos.cur) {
				pos.cur = animation.to;
				dragging.tweese = renderID = 0;
			} else {
				renderID = rAF(render);
			}

			trigger('move');

			// Update SLIDEE position
			if (!parallax) {
				if (transform) {
					$slidee[0].style[transform] = gpuAcceleration + (o.horizontal ? 'translateX' : 'translateY') + '(' + (-pos.cur) + 'px)';
				} else {
					$slidee[0].style[o.horizontal ? 'left' : 'top'] = -round(pos.cur) + 'px';
				}
			}

			// When animation reached the end, and dragging is not active, trigger moveEnd
			if (!renderID && dragging.released) {
				trigger('moveEnd');
			}

			syncScrollbar();
		}

		/**
		 * Synchronizes scrollbar with the SLIDEE.
		 *
		 * @return {Void}
		 */
		function syncScrollbar() {
			if ($handle.length) {
				hPos.cur = pos.start === pos.end ? 0 : (((dragging.init && !dragging.slidee) ? pos.dest : pos.cur) - pos.start) / (pos.end - pos.start) * hPos.end;
				hPos.cur = within(round(hPos.cur), hPos.start, hPos.end);
				if (last.hPos !== hPos.cur) {
					last.hPos = hPos.cur;
					if (transform) {
						$handle[0].style[transform] = gpuAcceleration + (o.horizontal ? 'translateX' : 'translateY') + '(' + hPos.cur + 'px)';
					} else {
						$handle[0].style[o.horizontal ? 'left' : 'top'] = hPos.cur + 'px';
					}
				}
			}
		}

		/**
		 * Synchronizes pagesbar with SLIDEE.
		 *
		 * @return {Void}
		 */
		function syncPagesbar() {
			if ($pages[0] && last.page !== rel.activePage) {
				last.page = rel.activePage;
				$pages.removeClass(o.activeClass).eq(rel.activePage).addClass(o.activeClass);
				trigger('activePage', last.page);
			}
		}

		/**
		 * Returns the position object.
		 *
		 * @param {Mixed} item
		 *
		 * @return {Object}
		 */
		self.getPos = function (item) {
			if (itemNav) {
				var index = getIndex(item);
				return index !== -1 ? items[index] : false;
			} else {
				var $item = $slidee.find(item).eq(0);

				if ($item[0]) {
					var offset = o.horizontal ? $item.offset().left - $slidee.offset().left : $item.offset().top - $slidee.offset().top;
					var size = $item[o.horizontal ? 'outerWidth' : 'outerHeight']();

					return {
						start: offset,
						center: offset - frameSize / 2 + size / 2,
						end: offset - frameSize + size,
						size: size
					};
				} else {
					return false;
				}
			}
		};

		/**
		 * Continuous move in a specified direction.
		 *
		 * @param  {Bool} forward True for forward movement, otherwise it'll go backwards.
		 * @param  {Int}  speed   Movement speed in pixels per frame. Overrides options.moveBy value.
		 *
		 * @return {Void}
		 */
		self.moveBy = function (speed) {
			move.speed = speed;
			// If already initiated, or there is nowhere to move, abort
			if (dragging.init || !move.speed || pos.cur === (move.speed > 0 ? pos.end : pos.start)) {
				return;
			}
			// Initiate move object
			move.lastTime = +new Date();
			move.startPos = pos.cur;
			// Set dragging as initiated
			continuousInit('button');
			dragging.init = 1;
			// Start movement
			trigger('moveStart');
			cAF(continuousID);
			moveLoop();
		};

		/**
		 * Continuous movement loop.
		 *
		 * @return {Void}
		 */
		function moveLoop() {
			// If there is nowhere to move anymore, stop
			if (!move.speed || pos.cur === (move.speed > 0 ? pos.end : pos.start)) {
				self.stop();
			}
			// Request new move loop if it hasn't been stopped
			continuousID = dragging.init ? rAF(moveLoop) : 0;
			// Update move object
			move.now = +new Date();
			move.pos = pos.cur + (move.now - move.lastTime) / 1000 * move.speed;
			// Slide
			slideTo(dragging.init ? move.pos : round(move.pos));
			// Normally, this is triggered in render(), but if there
			// is nothing to render, we have to do it manually here.
			if (!dragging.init && pos.cur === pos.dest) {
				trigger('moveEnd');
			}
			// Update times for future iteration
			move.lastTime = move.now;
		}

		/**
		 * Stops continuous movement.
		 *
		 * @return {Void}
		 */
		self.stop = function () {
			if (dragging.source === 'button') {
				dragging.init = 0;
				dragging.released = 1;
			}
		};

		/**
		 * Activate previous item.
		 *
		 * @return {Void}
		 */
		self.prev = function () {
			self.activate(rel.activeItem == null ? 0 : rel.activeItem - 1);
		};

		/**
		 * Activate next item.
		 *
		 * @return {Void}
		 */
		self.next = function () {
			self.activate(rel.activeItem == null ? 0 : rel.activeItem + 1);
		};

		/**
		 * Activate previous page.
		 *
		 * @return {Void}
		 */
		self.prevPage = function () {
			self.activatePage(rel.activePage - 1);
		};

		/**
		 * Activate next page.
		 *
		 * @return {Void}
		 */
		self.nextPage = function () {
			self.activatePage(rel.activePage + 1);
		};

		/**
		 * Slide SLIDEE by amount of pixels.
		 *
		 * @param {Int}  delta     Pixels/Items. Positive means forward, negative means backward.
		 * @param {Bool} immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.slideBy = function (delta, immediate) {
			if (!delta) {
				return;
			}
			if (itemNav) {
				self[centeredNav ? 'toCenter' : 'toStart'](
					within((centeredNav ? rel.centerItem : rel.firstItem) + o.scrollBy * delta, 0, items.length)
				);
			} else {
				slideTo(pos.dest + delta, immediate);
			}
		};

		/**
		 * Animate SLIDEE to a specific position.
		 *
		 * @param {Int}  pos       New position.
		 * @param {Bool} immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.slideTo = function (pos, immediate) {
			slideTo(pos, immediate);
		};

		/**
		 * Core method for handling `toLocation` methods.
		 *
		 * @param  {String} location
		 * @param  {Mixed}  item
		 * @param  {Bool}   immediate
		 *
		 * @return {Void}
		 */
		function to(location, item, immediate) {
			// Optional arguments logic
			if (type(item) === 'boolean') {
				immediate = item;
				item = undefined;
			}

			if (item === undefined) {
				slideTo(pos[location], immediate);
			} else {
				// You can't align items to sides of the frame
				// when centered navigation type is enabled
				if (centeredNav && location !== 'center') {
					return;
				}

				var itemPos = self.getPos(item);
				if (itemPos) {
					slideTo(itemPos[location], immediate, !centeredNav);
				}
			}
		}

		/**
		 * Animate element or the whole SLIDEE to the start of the frame.
		 *
		 * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
		 * @param {Bool}  immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.toStart = function (item, immediate) {
			to('start', item, immediate);
		};

		/**
		 * Animate element or the whole SLIDEE to the end of the frame.
		 *
		 * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
		 * @param {Bool}  immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.toEnd = function (item, immediate) {
			to('end', item, immediate);
		};

		/**
		 * Animate element or the whole SLIDEE to the center of the frame.
		 *
		 * @param {Mixed} item      Item DOM element, or index starting at 0. Omitting will animate SLIDEE.
		 * @param {Bool}  immediate Reposition immediately without an animation.
		 *
		 * @return {Void}
		 */
		self.toCenter = function (item, immediate) {
			to('center', item, immediate);
		};

		/**
		 * Get the index of an item in SLIDEE.
		 *
		 * @param {Mixed} item     Item DOM element.
		 *
		 * @return {Int}  Item index, or -1 if not found.
		 */
		function getIndex(item) {
			return item != null ?
					isNumber(item) ?
						item >= 0 && item < items.length ? item : -1 :
						$items.index(item) :
					-1;
		}
		// Expose getIndex without lowering the compressibility of it,
		// as it is used quite often throughout Sly.
		self.getIndex = getIndex;

		/**
		 * Get index of an item in SLIDEE based on a variety of input types.
		 *
		 * @param  {Mixed} item DOM element, positive or negative integer.
		 *
		 * @return {Int}   Item index, or -1 if not found.
		 */
		function getRelativeIndex(item) {
			return getIndex(isNumber(item) && item < 0 ? item + items.length : item);
		}

		/**
		 * Activates an item.
		 *
		 * @param  {Mixed} item Item DOM element, or index starting at 0.
		 *
		 * @return {Mixed} Activated item index or false on fail.
		 */
		function activate(item, force) {
			var index = getIndex(item);

			if (!itemNav || index < 0) {
				return false;
			}

			// Update classes, last active index, and trigger active event only when there
			// has been a change. Otherwise just return the current active index.
			if (last.active !== index || force) {
				// Update classes
				$items.eq(rel.activeItem).removeClass(o.activeClass);
				$items.eq(index).addClass(o.activeClass);

				last.active = rel.activeItem = index;

				updateButtonsState();
				trigger('active', index);
			}

			return index;
		}

		/**
		 * Activates an item and helps with further navigation when o.smart is enabled.
		 *
		 * @param {Mixed} item      Item DOM element, or index starting at 0.
		 * @param {Bool}  immediate Whether to reposition immediately in smart navigation.
		 *
		 * @return {Void}
		 */
		self.activate = function (item, immediate) {
			var index = activate(item);

			// Smart navigation
			if (o.smart && index !== false) {
				// When centeredNav is enabled, center the element.
				// Otherwise, determine where to position the element based on its current position.
				// If the element is currently on the far end side of the frame, assume that user is
				// moving forward and animate it to the start of the visible frame, and vice versa.
				if (centeredNav) {
					self.toCenter(index, immediate);
				} else if (index >= rel.lastItem) {
					self.toStart(index, immediate);
				} else if (index <= rel.firstItem) {
					self.toEnd(index, immediate);
				} else {
					resetCycle();
				}
			}
		};

		/**
		 * Activates a page.
		 *
		 * @param {Int}  index     Page index, starting from 0.
		 * @param {Bool} immediate Whether to reposition immediately without animation.
		 *
		 * @return {Void}
		 */
		self.activatePage = function (index, immediate) {
			if (isNumber(index)) {
				slideTo(pages[within(index, 0, pages.length - 1)], immediate);
			}
		};

		/**
		 * Return relative positions of items based on their visibility within FRAME.
		 *
		 * @param {Int} slideePos Position of SLIDEE.
		 *
		 * @return {Void}
		 */
		function getRelatives(slideePos) {
			slideePos = within(isNumber(slideePos) ? slideePos : pos.dest, pos.start, pos.end);

			var relatives = {};
			var centerOffset = forceCenteredNav ? 0 : frameSize / 2;

			// Determine active page
			if (!parallax) {
				for (var p = 0, pl = pages.length; p < pl; p++) {
					if (slideePos >= pos.end || p === pages.length - 1) {
						relatives.activePage = pages.length - 1;
						break;
					}

					if (slideePos <= pages[p] + centerOffset) {
						relatives.activePage = p;
						break;
					}
				}
			}

			// Relative item indexes
			if (itemNav) {
				var first = false;
				var last = false;
				var center = false;

				// From start
				for (var i = 0, il = items.length; i < il; i++) {
					// First item
					if (first === false && slideePos <= items[i].start + items[i].half) {
						first = i;
					}

					// Center item
					if (center === false && slideePos <= items[i].center + items[i].half) {
						center = i;
					}

					// Last item
					if (i === il - 1 || slideePos <= items[i].end + items[i].half) {
						last = i;
						break;
					}
				}

				// Safe assignment, just to be sure the false won't be returned
				relatives.firstItem = isNumber(first) ? first : 0;
				relatives.centerItem = isNumber(center) ? center : relatives.firstItem;
				relatives.lastItem = isNumber(last) ? last : relatives.centerItem;
			}

			return relatives;
		}

		/**
		 * Update object with relative positions.
		 *
		 * @param {Int} newPos
		 *
		 * @return {Void}
		 */
		function updateRelatives(newPos) {
			$.extend(rel, getRelatives(newPos));
		}

		/**
		 * Disable navigation buttons when needed.
		 *
		 * Adds disabledClass, and when the button is <button> or <input>, activates :disabled state.
		 *
		 * @return {Void}
		 */
		function updateButtonsState() {
			var isStart = pos.dest <= pos.start;
			var isEnd = pos.dest >= pos.end;
			var slideePosState = (isStart ? 1 : 0) | (isEnd ? 2 : 0);

			// Update paging buttons only if there has been a change in SLIDEE position
			if (last.slideePosState !== slideePosState) {
				last.slideePosState = slideePosState;

				if ($prevPageButton.is('button,input')) {
					$prevPageButton.prop('disabled', isStart);
				}

				if ($nextPageButton.is('button,input')) {
					$nextPageButton.prop('disabled', isEnd);
				}

				$prevPageButton.add($backwardButton)[isStart ? 'addClass' : 'removeClass'](o.disabledClass);
				$nextPageButton.add($forwardButton)[isEnd ? 'addClass' : 'removeClass'](o.disabledClass);
			}

			// Forward & Backward buttons need a separate state caching because we cannot "property disable"
			// them while they are being used, as disabled buttons stop emitting mouse events.
			if (last.fwdbwdState !== slideePosState && dragging.released) {
				last.fwdbwdState = slideePosState;

				if ($backwardButton.is('button,input')) {
					$backwardButton.prop('disabled', isStart);
				}

				if ($forwardButton.is('button,input')) {
					$forwardButton.prop('disabled', isEnd);
				}
			}

			// Item navigation
			if (itemNav && rel.activeItem != null) {
				var isFirst = rel.activeItem === 0;
				var isLast = rel.activeItem >= items.length - 1;
				var itemsButtonState = (isFirst ? 1 : 0) | (isLast ? 2 : 0);

				if (last.itemsButtonState !== itemsButtonState) {
					last.itemsButtonState = itemsButtonState;

					if ($prevButton.is('button,input')) {
						$prevButton.prop('disabled', isFirst);
					}

					if ($nextButton.is('button,input')) {
						$nextButton.prop('disabled', isLast);
					}

					$prevButton[isFirst ? 'addClass' : 'removeClass'](o.disabledClass);
					$nextButton[isLast ? 'addClass' : 'removeClass'](o.disabledClass);
				}
			}
		}

		/**
		 * Resume cycling.
		 *
		 * @param {Int} priority Resume pause with priority lower or equal than this. Used internally for pauseOnHover.
		 *
		 * @return {Void}
		 */
		self.resume = function (priority) {
			if (!o.cycleBy || !o.cycleInterval || o.cycleBy === 'items' && (!items[0] || rel.activeItem == null) || priority < self.isPaused) {
				return;
			}

			self.isPaused = 0;

			if (cycleID) {
				cycleID = clearTimeout(cycleID);
			} else {
				trigger('resume');
			}

			cycleID = setTimeout(function () {
				trigger('cycle');
				switch (o.cycleBy) {
					case 'items':
						self.activate(rel.activeItem >= items.length - 1 ? 0 : rel.activeItem + 1);
						break;

					case 'pages':
						self.activatePage(rel.activePage >= pages.length - 1 ? 0 : rel.activePage + 1);
						break;
				}
			}, o.cycleInterval);
		};

		/**
		 * Pause cycling.
		 *
		 * @param {Int} priority Pause priority. 100 is default. Used internally for pauseOnHover.
		 *
		 * @return {Void}
		 */
		self.pause = function (priority) {
			if (priority < self.isPaused) {
				return;
			}

			self.isPaused = priority || 100;

			if (cycleID) {
				cycleID = clearTimeout(cycleID);
				trigger('pause');
			}
		};

		/**
		 * Toggle cycling.
		 *
		 * @return {Void}
		 */
		self.toggle = function () {
			self[cycleID ? 'pause' : 'resume']();
		};

		/**
		 * Updates a signle or multiple option values.
		 *
		 * @param {Mixed} name  Name of the option that should be updated, or object that will extend the options.
		 * @param {Mixed} value New option value.
		 *
		 * @return {Void}
		 */
		self.set = function (name, value) {
			if ($.isPlainObject(name)) {
				$.extend(o, name);
			} else if (o.hasOwnProperty(name)) {
				o[name] = value;
			}
		};

		/**
		 * Add one or multiple items to the SLIDEE end, or a specified position index.
		 *
		 * @param {Mixed} element Node element, or HTML string.
		 * @param {Int}   index   Index of a new item position. By default item is appended at the end.
		 *
		 * @return {Void}
		 */
		self.add = function (element, index) {
			var $element = $(element);

			if (itemNav) {
				// Insert the element(s)
				if (index == null || !items[0] || index >= items.length) {
					$element.appendTo($slidee);
				} else if (items.length) {
					$element.insertBefore(items[index].el);
				}

				// Adjust the activeItem index
				if (rel.activeItem != null && index <= rel.activeItem) {
					last.active = rel.activeItem += $element.length;
				}
			} else {
				$slidee.append($element);
			}

			// Reload
			load();
		};

		/**
		 * Remove an item from SLIDEE.
		 *
		 * @param {Mixed} element Item index, or DOM element.
		 * @param {Int}   index   Index of a new item position. By default item is appended at the end.
		 *
		 * @return {Void}
		 */
		self.remove = function (element) {
			if (itemNav) {
				var index = getRelativeIndex(element);

				if (index > -1) {
					// Remove the element
					$items.eq(index).remove();

					// If the current item is being removed, activate new one after reload
					var reactivate = index === rel.activeItem;

					// Adjust the activeItem index
					if (rel.activeItem != null && index < rel.activeItem) {
						last.active = --rel.activeItem;
					}

					// Reload
					load();

					// Activate new item at the removed position
					if (reactivate) {
						last.active = null;
						self.activate(rel.activeItem);
					}
				}
			} else {
				$(element).remove();
				load();
			}
		};

		/**
		 * Helps re-arranging items.
		 *
		 * @param  {Mixed} item     Item DOM element, or index starting at 0. Use negative numbers to select items from the end.
		 * @param  {Mixed} position Item insertion anchor. Accepts same input types as item argument.
		 * @param  {Bool}  after    Insert after instead of before the anchor.
		 *
		 * @return {Void}
		 */
		function moveItem(item, position, after) {
			item = getRelativeIndex(item);
			position = getRelativeIndex(position);

			// Move only if there is an actual change requested
			if (item > -1 && position > -1 && item !== position && (!after || position !== item - 1) && (after || position !== item + 1)) {
				$items.eq(item)[after ? 'insertAfter' : 'insertBefore'](items[position].el);

				var shiftStart = item < position ? item : (after ? position : position - 1);
				var shiftEnd = item > position ? item : (after ? position + 1 : position);
				var shiftsUp = item > position;

				// Update activeItem index
				if (rel.activeItem != null) {
					if (item === rel.activeItem) {
						last.active = rel.activeItem = after ? (shiftsUp ? position + 1 : position) : (shiftsUp ? position : position - 1);
					} else if (rel.activeItem > shiftStart && rel.activeItem < shiftEnd) {
						last.active = rel.activeItem += shiftsUp ? 1 : -1;
					}
				}

				// Reload
				load();
			}
		}

		/**
		 * Move item after the target anchor.
		 *
		 * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
		 * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
		 *
		 * @return {Void}
		 */
		self.moveAfter = function (item, position) {
			moveItem(item, position, 1);
		};

		/**
		 * Move item before the target anchor.
		 *
		 * @param  {Mixed} item     Item to be moved. Can be DOM element or item index.
		 * @param  {Mixed} position Target position anchor. Can be DOM element or item index.
		 *
		 * @return {Void}
		 */
		self.moveBefore = function (item, position) {
			moveItem(item, position);
		};

		/**
		 * Registers callbacks.
		 *
		 * @param  {Mixed} name  Event name, or callbacks map.
		 * @param  {Mixed} fn    Callback, or an array of callback functions.
		 *
		 * @return {Void}
		 */
		self.on = function (name, fn) {
			// Callbacks map
			if (type(name) === 'object') {
				for (var key in name) {
					if (name.hasOwnProperty(key)) {
						self.on(key, name[key]);
					}
				}
			// Callback
			} else if (type(fn) === 'function') {
				var names = name.split(' ');
				for (var n = 0, nl = names.length; n < nl; n++) {
					callbacks[names[n]] = callbacks[names[n]] || [];
					if (callbackIndex(names[n], fn) === -1) {
						callbacks[names[n]].push(fn);
					}
				}
			// Callbacks array
			} else if (type(fn) === 'array') {
				for (var f = 0, fl = fn.length; f < fl; f++) {
					self.on(name, fn[f]);
				}
			}
		};

		/**
		 * Registers callbacks to be executed only once.
		 *
		 * @param  {Mixed} name  Event name, or callbacks map.
		 * @param  {Mixed} fn    Callback, or an array of callback functions.
		 *
		 * @return {Void}
		 */
		self.one = function (name, fn) {
			function proxy() {
				fn.apply(self, arguments);
				self.off(name, proxy);
			}
			self.on(name, proxy);
		};

		/**
		 * Remove one or all callbacks.
		 *
		 * @param  {String} name Event name.
		 * @param  {Mixed}  fn   Callback, or an array of callback functions. Omit to remove all callbacks.
		 *
		 * @return {Void}
		 */
		self.off = function (name, fn) {
			if (fn instanceof Array) {
				for (var f = 0, fl = fn.length; f < fl; f++) {
					self.off(name, fn[f]);
				}
			} else {
				var names = name.split(' ');
				for (var n = 0, nl = names.length; n < nl; n++) {
					callbacks[names[n]] = callbacks[names[n]] || [];
					if (fn == null) {
						callbacks[names[n]].length = 0;
					} else {
						var index = callbackIndex(names[n], fn);
						if (index !== -1) {
							callbacks[names[n]].splice(index, 1);
						}
					}
				}
			}
		};

		/**
		 * Returns callback array index.
		 *
		 * @param  {String}   name Event name.
		 * @param  {Function} fn   Function
		 *
		 * @return {Int} Callback array index, or -1 if isn't registered.
		 */
		function callbackIndex(name, fn) {
			for (var i = 0, l = callbacks[name].length; i < l; i++) {
				if (callbacks[name][i] === fn) {
					return i;
				}
			}
			return -1;
		}

		/**
		 * Reset next cycle timeout.
		 *
		 * @return {Void}
		 */
		function resetCycle() {
			if (dragging.released && !self.isPaused) {
				self.resume();
			}
		}

		/**
		 * Calculate SLIDEE representation of handle position.
		 *
		 * @param  {Int} handlePos
		 *
		 * @return {Int}
		 */
		function handleToSlidee(handlePos) {
			return round(within(handlePos, hPos.start, hPos.end) / hPos.end * (pos.end - pos.start)) + pos.start;
		}

		/**
		 * Keeps track of a dragging delta history.
		 *
		 * @return {Void}
		 */
		function draggingHistoryTick() {
			// Looking at this, I know what you're thinking :) But as we need only 4 history states, doing it this way
			// as opposed to a proper loop is ~25 bytes smaller (when minified with GCC), a lot faster, and doesn't
			// generate garbage. The loop version would create 2 new variables on every tick. Unexaptable!
			dragging.history[0] = dragging.history[1];
			dragging.history[1] = dragging.history[2];
			dragging.history[2] = dragging.history[3];
			dragging.history[3] = dragging.delta;
		}

		/**
		 * Initialize continuous movement.
		 *
		 * @return {Void}
		 */
		function continuousInit(source) {
			dragging.released = 0;
			dragging.source = source;
			dragging.slidee = source === 'slidee';
		}

		/**
		 * Dragging initiator.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function dragInit(event) {
			var isTouch = event.type === 'touchstart';
			var source = event.data.source;
			var isSlidee = source === 'slidee';

			// Ignore when already in progress, or interactive element in non-touch navivagion
			if (dragging.init || !isTouch && isInteractive(event.target)) {
				return;
			}

			// Handle dragging conditions
			if (source === 'handle' && (!o.dragHandle || hPos.start === hPos.end)) {
				return;
			}

			// SLIDEE dragging conditions
			if (isSlidee && !(isTouch ? o.touchDragging : o.mouseDragging && event.which < 2)) {
				return;
			}

			if (!isTouch) {
				// prevents native image dragging in Firefox
				stopDefault(event);
			}

			// Reset dragging object
			continuousInit(source);

			// Properties used in dragHandler
			dragging.init = 0;
			dragging.$source = $(event.target);
			dragging.touch = isTouch;
			dragging.pointer = isTouch ? event.originalEvent.touches[0] : event;
			dragging.initX = dragging.pointer.pageX;
			dragging.initY = dragging.pointer.pageY;
			dragging.initPos = isSlidee ? pos.cur : hPos.cur;
			dragging.start = +new Date();
			dragging.time = 0;
			dragging.path = 0;
			dragging.delta = 0;
			dragging.locked = 0;
			dragging.history = [0, 0, 0, 0];
			dragging.pathToLock = isSlidee ? isTouch ? 30 : 10 : 0;

			// Bind dragging events
			$doc.on(isTouch ? dragTouchEvents : dragMouseEvents, dragHandler);

			// Pause ongoing cycle
			self.pause(1);

			// Add dragging class
			(isSlidee ? $slidee : $handle).addClass(o.draggedClass);

			// Trigger moveStart event
			trigger('moveStart');

			// Keep track of a dragging path history. This is later used in the
			// dragging release swing calculation when dragging SLIDEE.
			if (isSlidee) {
				historyID = setInterval(draggingHistoryTick, 10);
			}
		}

		/**
		 * Handler for dragging scrollbar handle or SLIDEE.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function dragHandler(event) {
			dragging.released = event.type === 'mouseup' || event.type === 'touchend';
			dragging.pointer = dragging.touch ? event.originalEvent[dragging.released ? 'changedTouches' : 'touches'][0] : event;
			dragging.pathX = dragging.pointer.pageX - dragging.initX;
			dragging.pathY = dragging.pointer.pageY - dragging.initY;
			dragging.path = sqrt(pow(dragging.pathX, 2) + pow(dragging.pathY, 2));
			dragging.delta = o.horizontal ? dragging.pathX : dragging.pathY;

			if (!dragging.released && dragging.path < 1) return;

			// We haven't decided whether this is a drag or not...
			if (!dragging.init) {
				// If the drag path was very short, maybe it's not a drag?
				if (dragging.path < o.dragThreshold) {
					// If the pointer was released, the path will not become longer and it's
					// definitely not a drag. If not released yet, decide on next iteration
					return dragging.released ? dragEnd() : undefined;
				}
				else {
					// If dragging path is sufficiently long we can confidently start a drag
					// if drag is in different direction than scroll, ignore it
					if (o.horizontal ? abs(dragging.pathX) > abs(dragging.pathY) : abs(dragging.pathX) < abs(dragging.pathY)) {
						dragging.init = 1;
					} else {
						return dragEnd();
					}
				}
			}

			stopDefault(event);

			// Disable click on a source element, as it is unwelcome when dragging
			if (!dragging.locked && dragging.path > dragging.pathToLock && dragging.slidee) {
				dragging.locked = 1;
				dragging.$source.on(clickEvent, disableOneEvent);
			}

			// Cancel dragging on release
			if (dragging.released) {
				dragEnd();

				// Adjust path with a swing on mouse release
				if (o.releaseSwing && dragging.slidee) {
					dragging.swing = (dragging.delta - dragging.history[0]) / 40 * 300;
					dragging.delta += dragging.swing;
					dragging.tweese = abs(dragging.swing) > 10;
				}
			}

			slideTo(dragging.slidee ? round(dragging.initPos - dragging.delta) : handleToSlidee(dragging.initPos + dragging.delta));
		}

		/**
		 * Stops dragging and cleans up after it.
		 *
		 * @return {Void}
		 */
		function dragEnd() {
			clearInterval(historyID);
			dragging.released = true;
			$doc.off(dragging.touch ? dragTouchEvents : dragMouseEvents, dragHandler);
			(dragging.slidee ? $slidee : $handle).removeClass(o.draggedClass);

			// Make sure that disableOneEvent is not active in next tick.
			setTimeout(function () {
				dragging.$source.off(clickEvent, disableOneEvent);
			});

			// Normally, this is triggered in render(), but if there
			// is nothing to render, we have to do it manually here.
			if (pos.cur === pos.dest && dragging.init) {
				trigger('moveEnd');
			}

			// Resume ongoing cycle
			self.resume(1);

			dragging.init = 0;
		}

		/**
		 * Check whether element is interactive.
		 *
		 * @return {Boolean}
		 */
		function isInteractive(element) {
			return ~$.inArray(element.nodeName, interactiveElements) || $(element).is(o.interactive);
		}

		/**
		 * Continuous movement cleanup on mouseup.
		 *
		 * @return {Void}
		 */
		function movementReleaseHandler() {
			self.stop();
			$doc.off('mouseup', movementReleaseHandler);
		}

		/**
		 * Buttons navigation handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function buttonsHandler(event) {
			/*jshint validthis:true */
			stopDefault(event);
			switch (this) {
				case $forwardButton[0]:
				case $backwardButton[0]:
					self.moveBy($forwardButton.is(this) ? o.moveBy : -o.moveBy);
					$doc.on('mouseup', movementReleaseHandler);
					break;

				case $prevButton[0]:
					self.prev();
					break;

				case $nextButton[0]:
					self.next();
					break;

				case $prevPageButton[0]:
					self.prevPage();
					break;

				case $nextPageButton[0]:
					self.nextPage();
					break;
			}
		}

		/**
		 * Mouse wheel delta normalization.
		 *
		 * @param  {Event} event
		 *
		 * @return {Int}
		 */
		function normalizeWheelDelta(event) {
			// wheelDelta needed only for IE8-
			scrolling.curDelta = ((o.horizontal ? event.deltaY || event.deltaX : event.deltaY) || -event.wheelDelta);
			scrolling.curDelta /= event.deltaMode === 1 ? 3 : 100;
			if (!itemNav) {
				return scrolling.curDelta;
			}
			time = +new Date();
			if (scrolling.last < time - scrolling.resetTime) {
				scrolling.delta = 0;
			}
			scrolling.last = time;
			scrolling.delta += scrolling.curDelta;
			if (abs(scrolling.delta) < 1) {
				scrolling.finalDelta = 0;
			} else {
				scrolling.finalDelta = round(scrolling.delta / 1);
				scrolling.delta %= 1;
			}
			return scrolling.finalDelta;
		}

		/**
		 * Mouse scrolling handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function scrollHandler(event) {
			// Mark event as originating in a Sly instance
			event.originalEvent[namespace] = self;
			// Don't hijack global scrolling
			var time = +new Date();
			if (lastGlobalWheel + o.scrollHijack > time && $scrollSource[0] !== document && $scrollSource[0] !== window) {
				lastGlobalWheel = time;
				return;
			}
			// Ignore if there is no scrolling to be done
			if (!o.scrollBy || pos.start === pos.end) {
				return;
			}
			var delta = normalizeWheelDelta(event.originalEvent);
			// Trap scrolling only when necessary and/or requested
			if (o.scrollTrap || delta > 0 && pos.dest < pos.end || delta < 0 && pos.dest > pos.start) {
				stopDefault(event, 1);
			}
			self.slideBy(o.scrollBy * delta);
		}

		/**
		 * Scrollbar click handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function scrollbarHandler(event) {
			// Only clicks on scroll bar. Ignore the handle.
			if (o.clickBar && event.target === $sb[0]) {
				stopDefault(event);
				// Calculate new handle position and sync SLIDEE to it
				slideTo(handleToSlidee((o.horizontal ? event.pageX - $sb.offset().left : event.pageY - $sb.offset().top) - handleSize / 2));
			}
		}

		/**
		 * Keyboard input handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function keyboardHandler(event) {
			if (!o.keyboardNavBy) {
				return;
			}

			switch (event.which) {
				// Left or Up
				case o.horizontal ? 37 : 38:
					stopDefault(event);
					self[o.keyboardNavBy === 'pages' ? 'prevPage' : 'prev']();
					break;

				// Right or Down
				case o.horizontal ? 39 : 40:
					stopDefault(event);
					self[o.keyboardNavBy === 'pages' ? 'nextPage' : 'next']();
					break;
			}
		}

		/**
		 * Click on item activation handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function activateHandler(event) {
			/*jshint validthis:true */

			// Ignore clicks on interactive elements.
			if (isInteractive(this)) {
				event.originalEvent[namespace + 'ignore'] = true;
				return;
			}

			// Ignore events that:
			// - are not originating from direct SLIDEE children
			// - originated from interactive elements
			if (this.parentNode !== $slidee[0] || event.originalEvent[namespace + 'ignore']) return;

			self.activate(this);
		}

		/**
		 * Click on page button handler.
		 *
		 * @param {Event} event
		 *
		 * @return {Void}
		 */
		function activatePageHandler() {
			/*jshint validthis:true */
			// Accept only events from direct pages bar children.
			if (this.parentNode === $pb[0]) {
				self.activatePage($pages.index(this));
			}
		}

		/**
		 * Pause on hover handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
		function pauseOnHoverHandler(event) {
			if (o.pauseOnHover) {
				self[event.type === 'mouseenter' ? 'pause' : 'resume'](2);
			}
		}

		/**
		 * Trigger callbacks for event.
		 *
		 * @param  {String} name Event name.
		 * @param  {Mixed}  argX Arguments passed to callbacks.
		 *
		 * @return {Void}
		 */
		function trigger(name, arg1) {
			if (callbacks[name]) {
				l = callbacks[name].length;
				// Callbacks will be stored and executed from a temporary array to not
				// break the execution queue when one of the callbacks unbinds itself.
				tmpArray.length = 0;
				for (i = 0; i < l; i++) {
					tmpArray.push(callbacks[name][i]);
				}
				// Execute the callbacks
				for (i = 0; i < l; i++) {
					tmpArray[i].call(self, name, arg1);
				}
			}
		}

		/**
		 * Destroys instance and everything it created.
		 *
		 * @return {Void}
		 */
		self.destroy = function () {
			// Remove the reference to itself
			Sly.removeInstance(frame);

			// Unbind all events
			$scrollSource
				.add($handle)
				.add($sb)
				.add($pb)
				.add($forwardButton)
				.add($backwardButton)
				.add($prevButton)
				.add($nextButton)
				.add($prevPageButton)
				.add($nextPageButton)
				.off('.' + namespace);

			// Unbinding specifically as to not nuke out other instances
			$doc.off('keydown', keyboardHandler);

			// Remove classes
			$prevButton
				.add($nextButton)
				.add($prevPageButton)
				.add($nextPageButton)
				.removeClass(o.disabledClass);

			if ($items && rel.activeItem != null) {
				$items.eq(rel.activeItem).removeClass(o.activeClass);
			}

			// Remove page items
			$pb.empty();

			if (!parallax) {
				// Unbind events from frame
				$frame.off('.' + namespace);
				// Restore original styles
				frameStyles.restore();
				slideeStyles.restore();
				sbStyles.restore();
				handleStyles.restore();
				// Remove the instance from element data storage
				$.removeData(frame, namespace);
			}

			// Clean up collections
			items.length = pages.length = 0;
			last = {};

			// Reset initialized status and return the instance
			self.initialized = 0;
			return self;
		};

		/**
		 * Initialize.
		 *
		 * @return {Object}
		 */
		self.init = function () {
			if (self.initialized) {
				return;
			}

			// Disallow multiple instances on the same element
			if (Sly.getInstance(frame)) throw new Error('There is already a Sly instance on this element');

			// Store the reference to itself
			Sly.storeInstance(frame, self);

			// Register callbacks map
			self.on(callbackMap);

			// Save styles
			var holderProps = ['overflow', 'position'];
			var movableProps = ['position', 'webkitTransform', 'msTransform', 'transform', 'left', 'top', 'width', 'height'];
			frameStyles.save.apply(frameStyles, holderProps);
			sbStyles.save.apply(sbStyles, holderProps);
			slideeStyles.save.apply(slideeStyles, movableProps);
			handleStyles.save.apply(handleStyles, movableProps);

			// Set required styles
			var $movables = $handle;
			if (!parallax) {
				$movables = $movables.add($slidee);
				$frame.css('overflow', 'hidden');
				if (!transform && $frame.css('position') === 'static') {
					$frame.css('position', 'relative');
				}
			}
			if (transform) {
				if (gpuAcceleration) {
					$movables.css(transform, gpuAcceleration);
				}
			} else {
				if ($sb.css('position') === 'static') {
					$sb.css('position', 'relative');
				}
				$movables.css({ position: 'absolute' });
			}

			// Navigation buttons
			if (o.forward) {
				$forwardButton.on(mouseDownEvent, buttonsHandler);
			}
			if (o.backward) {
				$backwardButton.on(mouseDownEvent, buttonsHandler);
			}
			if (o.prev) {
				$prevButton.on(clickEvent, buttonsHandler);
			}
			if (o.next) {
				$nextButton.on(clickEvent, buttonsHandler);
			}
			if (o.prevPage) {
				$prevPageButton.on(clickEvent, buttonsHandler);
			}
			if (o.nextPage) {
				$nextPageButton.on(clickEvent, buttonsHandler);
			}

			// Scrolling navigation
			$scrollSource.on(wheelEvent, scrollHandler);

			// Clicking on scrollbar navigation
			if ($sb[0]) {
				$sb.on(clickEvent, scrollbarHandler);
			}

			// Click on items navigation
			if (itemNav && o.activateOn) {
				$frame.on(o.activateOn + '.' + namespace, '*', activateHandler);
			}

			// Pages navigation
			if ($pb[0] && o.activatePageOn) {
				$pb.on(o.activatePageOn + '.' + namespace, '*', activatePageHandler);
			}

			// Dragging navigation
			$dragSource.on(dragInitEvents, { source: 'slidee' }, dragInit);

			// Scrollbar dragging navigation
			if ($handle) {
				$handle.on(dragInitEvents, { source: 'handle' }, dragInit);
			}

			// Keyboard navigation
			$doc.on('keydown', keyboardHandler);

			if (!parallax) {
				// Pause on hover
				$frame.on('mouseenter.' + namespace + ' mouseleave.' + namespace, pauseOnHoverHandler);
				// Reset native FRAME element scroll
				$frame.on('scroll.' + namespace, resetScroll);
			}

			// Mark instance as initialized
			self.initialized = 1;

			// Load
			load(true);

			// Initiate automatic cycling
			if (o.cycleBy && !parallax) {
				self[o.startPaused ? 'pause' : 'resume']();
			}

			// Return instance
			return self;
		};
	}

	Sly.getInstance = function (element) {
		return $.data(element, namespace);
	};

	Sly.storeInstance = function (element, sly) {
		return $.data(element, namespace, sly);
	};

	Sly.removeInstance = function (element) {
		return $.removeData(element, namespace);
	};

	/**
	 * Return type of the value.
	 *
	 * @param  {Mixed} value
	 *
	 * @return {String}
	 */
	function type(value) {
		if (value == null) {
			return String(value);
		}

		if (typeof value === 'object' || typeof value === 'function') {
			return Object.prototype.toString.call(value).match(/\s([a-z]+)/i)[1].toLowerCase() || 'object';
		}

		return typeof value;
	}

	/**
	 * Event preventDefault & stopPropagation helper.
	 *
	 * @param {Event} event     Event object.
	 * @param {Bool}  noBubbles Cancel event bubbling.
	 *
	 * @return {Void}
	 */
	function stopDefault(event, noBubbles) {
		event.preventDefault();
		if (noBubbles) {
			event.stopPropagation();
		}
	}

	/**
	 * Disables an event it was triggered on and unbinds itself.
	 *
	 * @param  {Event} event
	 *
	 * @return {Void}
	 */
	function disableOneEvent(event) {
		/*jshint validthis:true */
		stopDefault(event, 1);
		$(this).off(event.type, disableOneEvent);
	}

	/**
	 * Resets native element scroll values to 0.
	 *
	 * @return {Void}
	 */
	function resetScroll() {
		/*jshint validthis:true */
		this.scrollLeft = 0;
		this.scrollTop = 0;
	}

	/**
	 * Check if variable is a number.
	 *
	 * @param {Mixed} value
	 *
	 * @return {Boolean}
	 */
	function isNumber(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	}

	/**
	 * Parse style to pixels.
	 *
	 * @param {Object}   $item    jQuery object with element.
	 * @param {Property} property CSS property to get the pixels from.
	 *
	 * @return {Int}
	 */
	function getPx($item, property) {
		return 0 | round(String($item.css(property)).replace(/[^\-0-9.]/g, ''));
	}

	/**
	 * Make sure that number is within the limits.
	 *
	 * @param {Number} number
	 * @param {Number} min
	 * @param {Number} max
	 *
	 * @return {Number}
	 */
	function within(number, min, max) {
		return number < min ? min : number > max ? max : number;
	}

	/**
	 * Saves element styles for later restoration.
	 *
	 * Example:
	 *   var styles = new StyleRestorer(frame);
	 *   styles.save('position');
	 *   element.style.position = 'absolute';
	 *   styles.restore(); // restores to state before the assignment above
	 *
	 * @param {Element} element
	 */
	function StyleRestorer(element) {
		var self = {};
		self.style = {};
		self.save = function () {
			if (!element || !element.nodeType) return;
			for (var i = 0; i < arguments.length; i++) {
				self.style[arguments[i]] = element.style[arguments[i]];
			}
			return self;
		};
		self.restore = function () {
			if (!element || !element.nodeType) return;
			for (var prop in self.style) {
				if (self.style.hasOwnProperty(prop)) element.style[prop] = self.style[prop];
			}
			return self;
		};
		return self;
	}

	// Local WindowAnimationTiming interface polyfill
	(function (w) {
		rAF = w.requestAnimationFrame
			|| w.webkitRequestAnimationFrame
			|| fallback;

		/**
		* Fallback implementation.
		*/
		var prev = new Date().getTime();
		function fallback(fn) {
			var curr = new Date().getTime();
			var ms = Math.max(0, 16 - (curr - prev));
			var req = setTimeout(fn, ms);
			prev = curr;
			return req;
		}

		/**
		* Cancel.
		*/
		var cancel = w.cancelAnimationFrame
			|| w.webkitCancelAnimationFrame
			|| w.clearTimeout;

		cAF = function(id){
			cancel.call(w, id);
		};
	}(window));

	// Feature detects
	(function () {
		var prefixes = ['', 'Webkit', 'Moz', 'ms', 'O'];
		var el = document.createElement('div');

		function testProp(prop) {
			for (var p = 0, pl = prefixes.length; p < pl; p++) {
				var prefixedProp = prefixes[p] ? prefixes[p] + prop.charAt(0).toUpperCase() + prop.slice(1) : prop;
				if (el.style[prefixedProp] != null) {
					return prefixedProp;
				}
			}
		}

		// Global support indicators
		transform = testProp('transform');
		gpuAcceleration = testProp('perspective') ? 'translateZ(0) ' : '';
	}());

	// Expose class globally
	w[className] = Sly;

	// jQuery proxy
	$.fn[pluginName] = function (options, callbackMap) {
		var method, methodArgs;

		// Attributes logic
		if (!$.isPlainObject(options)) {
			if (type(options) === 'string' || options === false) {
				method = options === false ? 'destroy' : options;
				methodArgs = Array.prototype.slice.call(arguments, 1);
			}
			options = {};
		}

		// Apply to all elements
		return this.each(function (i, element) {
			// Call with prevention against multiple instantiations
			var plugin = Sly.getInstance(element);

			if (!plugin && !method) {
				// Create a new object if it doesn't exist yet
				plugin = new Sly(element, options, callbackMap).init();
			} else if (plugin && method) {
				// Call method
				if (plugin[method]) {
					plugin[method].apply(plugin, methodArgs);
				}
			}
		});
	};

	// Default options
	Sly.defaults = {
		slidee:     null,  // Selector, DOM element, or jQuery object with DOM element representing SLIDEE.
		horizontal: false, // Switch to horizontal mode.

		// Item based navigation
		itemNav:        null,  // Item navigation type. Can be: 'basic', 'centered', 'forceCentered'.
		itemSelector:   null,  // Select only items that match this selector.
		smart:          false, // Repositions the activated item to help with further navigation.
		activateOn:     null,  // Activate an item on this event. Can be: 'click', 'mouseenter', ...
		activateMiddle: false, // Always activate the item in the middle of the FRAME. forceCentered only.

		// Scrolling
		scrollSource: null,  // Element for catching the mouse wheel scrolling. Default is FRAME.
		scrollBy:     0,     // Pixels or items to move per one mouse scroll. 0 to disable scrolling.
		scrollHijack: 300,   // Milliseconds since last wheel event after which it is acceptable to hijack global scroll.
		scrollTrap:   false, // Don't bubble scrolling when hitting scrolling limits.

		// Dragging
		dragSource:    null,  // Selector or DOM element for catching dragging events. Default is FRAME.
		mouseDragging: false, // Enable navigation by dragging the SLIDEE with mouse cursor.
		touchDragging: false, // Enable navigation by dragging the SLIDEE with touch events.
		releaseSwing:  false, // Ease out on dragging swing release.
		swingSpeed:    0.2,   // Swing synchronization speed, where: 1 = instant, 0 = infinite.
		elasticBounds: false, // Stretch SLIDEE position limits when dragging past FRAME boundaries.
		dragThreshold: 3,     // Distance in pixels before Sly recognizes dragging.
		interactive:   null,  // Selector for special interactive elements.

		// Scrollbar
		scrollBar:     null,  // Selector or DOM element for scrollbar container.
		dragHandle:    false, // Whether the scrollbar handle should be draggable.
		dynamicHandle: false, // Scrollbar handle represents the ratio between hidden and visible content.
		minHandleSize: 50,    // Minimal height or width (depends on sly direction) of a handle in pixels.
		clickBar:      false, // Enable navigation by clicking on scrollbar.
		syncSpeed:     0.5,   // Handle => SLIDEE synchronization speed, where: 1 = instant, 0 = infinite.

		// Pagesbar
		pagesBar:       null, // Selector or DOM element for pages bar container.
		activatePageOn: null, // Event used to activate page. Can be: click, mouseenter, ...
		pageBuilder:          // Page item generator.
			function (index) {
				return '<li>' + (index + 1) + '</li>';
			},

		// Navigation buttons
		forward:  null, // Selector or DOM element for "forward movement" button.
		backward: null, // Selector or DOM element for "backward movement" button.
		prev:     null, // Selector or DOM element for "previous item" button.
		next:     null, // Selector or DOM element for "next item" button.
		prevPage: null, // Selector or DOM element for "previous page" button.
		nextPage: null, // Selector or DOM element for "next page" button.

		// Automated cycling
		cycleBy:       null,  // Enable automatic cycling by 'items' or 'pages'.
		cycleInterval: 5000,  // Delay between cycles in milliseconds.
		pauseOnHover:  false, // Pause cycling when mouse hovers over the FRAME.
		startPaused:   false, // Whether to start in paused sate.

		// Mixed options
		moveBy:        300,     // Speed in pixels per second used by forward and backward buttons.
		speed:         0,       // Animations speed in milliseconds. 0 to disable animations.
		easing:        'swing', // Easing for duration based (tweening) animations.
		startAt:       null,    // Starting offset in pixels or items.
		keyboardNavBy: null,    // Enable keyboard navigation by 'items' or 'pages'.

		// Classes
		draggedClass:  'dragged', // Class for dragged elements (like SLIDEE or scrollbar handle).
		activeClass:   'active',  // Class for active items and pages.
		disabledClass: 'disabled' // Class for disabled navigation elements.
	};
}(jQuery, window));;// JavaScript Document
var Activities = Activities || {};
Activities.base = function(){
	this.complete = false;
	this.content = null;
	this.page = 0;
	this.setToComplete = function(){
		if(!this.complete){
			this.complete=true;
			Global.controller.pageComplete();
		}
		
	}
};
;// JavaScript Document
Activities.ClickReveal = function(){	
	var _base; 
	var _pageNumber;
	var _pageObject;
	var _clickers=[];
	var _holder;
	var _options;
	var THIS = this;
	var _openPopup;
	var _openClicker;
		
	this.buildActivity = function(pageObject, holder){
		_base = new Activities.base();
		_holder = holder;	
		_pageObject = pageObject;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		var opts = $(_pageObject.pagexml[_pageObject.pageposition]).children("clickrevealOptions")[0];
		var rawClickers = _pageObject.pagexml[_pageObject.pageposition].getElementsByTagName("clickreveal");		
		_options={	
			delayActivation:opts.getAttribute("delayactivation"),
			closeButton: opts.getAttribute("closebutton") == "yes" ? true:false
		}

		for(var i=0,ii=rawClickers.length;i<ii;i++){	
			_clickers.push(
				{
					clickerraw: rawClickers[i],
					clickerpageobj: new Models.page("click reveal"),
					clickericon: rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue,
					clickericonover: (Helpers.imageExists(rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_over", _pageObject.images))?rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_over":null,
					clickericonselected: (Helpers.imageExists(rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_selected", _pageObject.images))?rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_selected":null,
					clickericondone: (Helpers.imageExists(rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_done", _pageObject.images))?rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_done":null,
					clickerx: rawClickers[i].getElementsByTagName("clicker")[0].getAttribute("x"),
					clickery: rawClickers[i].getElementsByTagName("clicker")[0].getAttribute("y"),
					clickerreveal: rawClickers[i].getElementsByTagName("clicker")[0].getAttribute("revealDelay"),
					popupx: rawClickers[i].getAttribute("x"),
					popupy: rawClickers[i].getAttribute("y"),
					popupheight: rawClickers[i].getAttribute("height"),
					popupwidth: rawClickers[i].getAttribute("width"),
					popupbg: (rawClickers[i].getAttribute("bg")!=="no")?true:false, 
					popuppages: rawClickers[i].getElementsByTagName("page"),
					popupnumberofpages: rawClickers[i].getElementsByTagName("page").length,					
					popupageon:0,
					popupid:_prefix+"popup"+i,
					popup:null,																				
					seen: false,
					//clickerpages: clickerraw.getElementsByTagName("page")
				}
			);
		}
		var tl = new TimelineLite();
		for(var i=0,ii=_clickers.length;i<ii;i++){
			for(var a=0,aa=_pageObject.images.length;a<aa;a++){
				if(_pageObject.images[a].id === _clickers[i].clickericon){	

					var btn = new Helpers.buttonImage();
					btn.setId(_prefix+"-"+i+"-clickreveal");
					btn.setState1Image(Helpers.findImage(_clickers[i].clickericon, _pageObject.images));
					if(_clickers[i].clickericonover){btn.setState2Image(Helpers.findImage(_clickers[i].clickericonover, _pageObject.images));}
					if(_clickers[i].clickericonselected){btn.setState3Image(Helpers.findImage(_clickers[i].clickericonselected, _pageObject.images));}
					if(_clickers[i].clickericondone){ btn.setState4Image(Helpers.findImage(_clickers[i].clickericondone, _pageObject.images));}
					btn.drawButton(_holder);
					_clickers[i].clicker = btn.getButton();
					_clickers[i].btnObject = btn;
					var tl = new TimelineLite();
					tl.set(_clickers[i].clicker, {position:"absolute", left:_clickers[i].clickerx, top:_clickers[i].clickery-10, opacity:0});
					tl.append(new TweenLite(_clickers[i].clicker, 0.5, {top:_clickers[i].clickery, opacity:1, delay:_clickers[i].clickerreveal}));	
					_pageObject.addToReset(tl);
				}					
			}
			
			_clickers[i].clickerpageobj.numberofscreens = _clickers[i].popupnumberofpages;
			_clickers[i].clickerpageobj.pagexml = _clickers[i].clickerraw.getElementsByTagName("page");
			_clickers[i].clickerpageobj.linkActivities(_clickers[i].clickerpageobj);
			_clickers[i].clickerpageobj.sounds = _pageObject.sounds;
			_clickers[i].clickerpageobj.images = _pageObject.images;
			_clickers[i].clickerpageobj.manifest = _pageObject.manifest;
			_clickers[i].clickerpageobj.transcripts = _pageObject.transcripts;
		}	
		
		var tn = new TweenMax.delayedCall(_options.delayActivation, activateClickers);
		_pageObject.addToReset(tn);	
	};
	this.popupClosed = function(name){
		for(var i=0,ii=_clickers.length;i<ii;i++){
			if(name===_clickers[i].popupid){
				_clickers[i].btnObject.setState("done");
			}
		}
	};
	function activateClickers(){
		for(var i=0,ii=_clickers.length;i<ii;i++){
			//_clickers[i].btnObject.setState("active");
			$(_clickers[i].clicker).css({'cursor':'pointer'}).on('click', {cl:i}, launchPopup);
			_pageObject.addToResetEventListeners(_clickers[i].clicker);
		}
	}
	function launchPopup(event){	
		if(_openPopup)_openPopup.removeFromStage();	
		if(_openClicker)_openClicker.btnObject.setState("done");
		var a = event.data.cl;
		_clickers[a].btnObject.setState("selected");
		if(_clickers[a].popup!=null){
			_clickers[a].popup.removeFromStage();
		}
		var popup = new Helpers.popup();
		popup.setWidth(_clickers[a].popupwidth);
		popup.setHeight(_clickers[a].popupheight);
		popup.setX(_clickers[a].popupx);
		popup.setY(_clickers[a].popupy);
		popup.setName(_clickers[a].popupid);
		popup.setClosebtn(_options.closeButton);
		popup.setOwnerObject(THIS);
		popup.setClass((_clickers[a].popupbg)?"feedbackpopup":"invisiblepopup");
		popup.addToStage(_holder);	
		_clickers[a].seen=true;
		_clickers[a].popup=popup;
		
		for(var i=0,ii=_clickers[a].clickerpageobj.activities.length;i<ii;i++){
			
			if(_clickers[a].clickerpageobj.activities[i].pageNumber == _clickers[a].clickerpageobj.pageposition){
				Factory.activityStore.createActivity(_clickers[a].clickerpageobj.activities[i].name, _clickers[a].clickerpageobj, $("#"+popup.name)[0]);
			}
		}
		
		if(_clickers[a].clickerpageobj.pagexml[_clickers[a].clickerpageobj.pageposition].getAttribute("sound")!=null || _clickers[a].clickerpageobj.pagexml[_clickers[a].clickerpageobj.pageposition].getAttribute("sound")!=undefined){
			popup.includeSound(true);
			Global.soundController.playSound(_clickers[a].clickerpageobj.pagexml[_clickers[a].clickerpageobj.pageposition].getAttribute("sound"), _clickers[a].clickerpageobj);
		}
		
		if(checkComplete()){
			_base.setToComplete();
		}
		_openPopup = popup;
		_openClicker = _clickers[a];
	}
	function checkComplete(){
		for(var i=0,ii=_clickers.length;i<ii;i++){
			if(!_clickers[i].seen){
				return false;
			}
		}
		return true;
	}
};// JavaScript Document
Activities.TextActivity = function(){	
	var base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _statements=[];
	var _prefix;
	
	this.buildActivity = function(pageObject, holder){
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		base = new Activities.base();	
		_holder = holder;
		base.page = _pageNumber;
		_pageObject = pageObject;
		var statements = $(_pageObject.pagexml[_pageObject.pageposition]).children("statement");		
		
		for(var i=0,ii=statements.length;i<ii;i++){
			_statements.push(
				{
					text: statements[i].childNodes[0].nodeValue,
					delay: Number(statements[i].getAttribute("delay")),
					x: Number(statements[i].getAttribute("x")),
					y: Number(statements[i].getAttribute("y")) + 10,
					width: Number(statements[i].getAttribute("width")),
					align: (statements[i].getAttribute("align"))?statements[i].getAttribute("align"):"left",
					remove: (statements[i].getAttribute("remove"))?statements[i].getAttribute("remove"):null
				}
			)
		}	
		placeText();
	}	
	function placeText(){
		for(var i=0,ii=_statements.length;i<ii;i++){
			$(_holder).append("<p id=\"st-"+_prefix+"-"+i+"\" class=\"statement\">"+_statements[i].text+"</p>");
			TweenLite.set($("#st-"+_prefix+"-"+[i]), {left:_statements[i].x, top:_statements[i].y-10, width:_statements[i].width, opacity: 0, textAlign:_statements[i].align});	
			var f = new TimelineLite();
			f.to($("#st-"+_prefix+"-"+[i]), 0.5, {delay:_statements[i].delay, left:_statements[i].x, top:_statements[i].y, opacity: 1});
			if(_statements[i].remove)f.to($("#st-"+_prefix+"-"+[i]), 0.2, {autoAlpha:0}, "+="+_statements[i].remove);	
			_pageObject.addToReset(f);												
		}
	}
}
Activities.BulletActivity = function(){	
	var base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _statements=[];
	var _prefix;
	
	this.buildActivity = function(pageObject, holder){
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		base = new Activities.base();	
		_holder = holder;
		base.page = _pageNumber;
		_pageObject = pageObject;
		var statements = $(_pageObject.pagexml[_pageObject.pageposition]).children("bullet");
		
		
		for(var i=0,ii=statements.length;i<ii;i++){
			_statements.push(
				{
					text: statements[i].childNodes[0].nodeValue,
					delay: statements[i].getAttribute("delay"),
					x: statements[i].getAttribute("x"),
					y: statements[i].getAttribute("y"),
					width: statements[i].getAttribute("width"),
					remove: (statements[i].getAttribute("remove"))?statements[i].getAttribute("remove"):null
				}
			)
		}	
		placeText();
	}	
	function placeText(){
		for(var i=0,ii=_statements.length;i<ii;i++){
			$(_holder).append("<p id=\"bu-"+_prefix+"-"+i+"\" class=\"bullet\">"+_statements[i].text+"</p>");
			TweenLite.set($("#bu-"+_prefix+"-"+[i]), {left:_statements[i].x, top:_statements[i].y-10, width:_statements[i].width, opacity: 0});
			
			var f = new TimelineLite();
			f.to($("#bu-"+_prefix+"-"+[i]), 0.5, {delay:_statements[i].delay, left:_statements[i].x, top:_statements[i].y, opacity: 1});
			if(_statements[i].remove)f.to($("#bu-"+_prefix+"-"+[i]), 0.2, {autoAlpha:0}, "+="+_statements[i].remove);	
			_pageObject.addToReset(f);															
		}
	}
}
Activities.ActivityText = function(){	
	var base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _raw;
	var _items = [];
	var _prefix;
	
	this.buildActivity = function(pageObject, holder){
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition+"-act-";
		base = new Activities.base();	
		_holder = holder;
		base.page = _pageNumber;
		_pageObject = pageObject;
		
		_raw = $(_pageObject.pagexml[_pageObject.pageposition]).children("instructionOptions");
		for(var i=0,ii=_raw.length;i<ii;i++){
			_items.push(
				{					
					x:_raw[i].getAttribute("x"),
					y:_raw[i].getAttribute("y"),
					width:_raw[i].getAttribute("width"),
					delay: _raw[i].getAttribute("delay"),
					style: (_raw[i].getAttribute("style") !="slide") ? "normal" : "slide",
					text: _raw[i].getElementsByTagName("instruction")[0].textContent,
					sound: _raw[i].getAttribute("sound"),
					id: "in-"+_prefix+"-"+i,		
				}
			)
		}
		placeText();	
	}
	function placeText(){
		for(var i=0,ii=_items.length;i<ii;i++){
			if(_items[i].style==="normal"){
				$(_holder).append("<p id=\""+_items[i].id+"\" class=\"normalinstruction\">"+_items[i].text+"</p>");	
				TweenLite.set($("#"+_items[i].id), {left:_items[i].x, top:_items[i].y-10, width:_items[i].width, opacity: 0});	
				var f = TweenLite.to($("#"+_items[i].id), 0.5, {delay:_items[i].delay, left:_items[i].x, top:_items[i].y, opacity: 1});	
				_pageObject.addToReset(f);		
			}else if(_items[i].style==="slide"){
				$(_holder).append("<p id=\""+_items[i].id+"\" class=\"slideinstruction\">"+_items[i].text+"</p>");
				TweenLite.set($("#"+_items[i].id), {left:_items[i].x - 2000, top:_items[i].y-10, width:680, opacity: 0, skewX:40});	
				var tl = new TimelineLite();
				tl.append(TweenLite.to($("#"+_items[i].id), 0.3, {delay:_items[i].delay, left:_items[i].x, top:_items[i].y, opacity: 1, skewX:10}));
				tl.to($("#"+_items[i].id), 0.2, {skewX:-10, left:_items[i].x});
				tl.to($("#"+_items[i].id), 0.15, {skewX:10, left:_items[i].x});
				tl.to($("#"+_items[i].id), 0.1, {skewX:0});
				_pageObject.addToReset(tl);
			}
		}
	}
};// JavaScript Document
Activities.DragDropToTargets = function(){	
"use strict";
	var _base; 
	var _pageObject;
	var _holder;
	var _prefix;
	var _targets = [];
	var _numberoftargets;
	var _draggers = [];
	var _numberofdraggers;
	var _draggables=[];
	var _selectedDragger;
	var _options;
	var tl;
	var _popup;
	var _orderPosition;
	var _numberInOrders;
	var _usingOrder = false;
	
	this.buildActivity = function(pageObject, holder){
		_base = new Activities.base();
		_pageObject = pageObject;
		_holder = holder;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		tl = new TimelineLite();
		_pageObject.addToReset(tl);	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("draganddrop")[0];	
		_options = {
			delay: xmlcontent.getAttribute("delay"),
			targetVisible: (xmlcontent.getAttribute("targetVisible")==="yes")?true:false,
			shufflePositions: (xmlcontent.getAttribute("shufflePositions")==="yes")?true:false,
			oneAtTime: (xmlcontent.getAttribute("oneAtTime")==="yes")?true:false
			
		};
		var targets = xmlcontent.getElementsByTagName("target");
		
		_numberoftargets=targets.length;
		for(var i=0;i<_numberoftargets;i++){
			var target={
				name: targets[i].getAttribute("name"),
				x: Number(targets[i].getAttribute("targetx")),
				y: Number(targets[i].getAttribute("targety")),
				width: Number(targets[i].getAttribute("targetWidth")),
				height: Number(targets[i].getAttribute("targetHeight")),
				image: targets[i].firstChild.nodeValue,
				id: _prefix+"target-"+i
			};
			_targets.push(target);
		}
		var drags = xmlcontent.getElementsByTagName("drag");
		_numberofdraggers=drags.length;
	
	//	var draggers = xmlcontent.getElementsByTagName("dragger");
		
		for(i=0;i<_numberofdraggers;i++){
			var draggers = drags[i].getElementsByTagName("dragger")[0];
			var dragger={
				name: draggers.getAttribute("name"),
				x: Number(draggers.getAttribute("startingx")),
				y: Number(draggers.getAttribute("startingy")),
				targetname: draggers.getAttribute("target"),
				image: draggers.firstChild.nodeValue,
				scalex: (draggers.getAttribute("scalex"))?Number(draggers.getAttribute("scalex")):1,
				scaley: (draggers.getAttribute("scaley"))?Number(draggers.getAttribute("scaley")):1,
				startScaleX: (draggers.getAttribute("startScaleX"))?Number(draggers.getAttribute("startScaleX")):1,
				startScaleY: (draggers.getAttribute("startScaleY"))?Number(draggers.getAttribute("startScaleY")):1,
				finishx: (draggers.getAttribute("finishx"))?Number(draggers.getAttribute("finishx")):undefined,
				finishy: (draggers.getAttribute("finishy"))?Number(draggers.getAttribute("finishy")):undefined,
				class: (draggers.getAttribute("class"))?Number(draggers.getAttribute("class")):undefined,
				order: assignOrder(draggers.getAttribute("order")),
				id: _prefix+"dragger-"+i,
				landed:false
			};
			var cfb = (drags[i].getElementsByTagName("cfeedback"))?drags[i].getElementsByTagName("cfeedback")[0]:undefined;
			dragger.cfb = (cfb)?createFbObj(cfb):undefined;
			var icfb = (drags[i].getElementsByTagName("icfeedback"))?drags[i].getElementsByTagName("icfeedback")[0]:undefined;
			dragger.icfb = (icfb)?createFbObj(icfb):undefined;
			_draggers.push(dragger);
		}
		for(i=0;i<_numberofdraggers;i++){
			
			for(var a=0,aa=_targets.length;a<aa;a++){
				if(_targets[a].name===_draggers[i].targetname){
					_draggers[i].width=_targets[a].width;
					_draggers[i].height=_targets[a].height;
					_draggers[i].target = _targets[a];
					break;
				}
			}
			if(_draggers[i].order && _draggers[i].order > 0){
				_usingOrder=true;
				addOrder(_draggers[i].order);
			}
			
		}
		if(_usingOrder){
			for(i=0;i<_numberofdraggers;i++){
				
				if(!_draggers[i].order || _draggers[i].order < 0){
					_draggers[i].landed=true;
				}
			}
		}
		
		if(_options.shufflePositions){shuffleYs();}
		placeTargets();
		placeDraggers();
		var t = new TweenMax.delayedCall(_options.delay, revealAndActivate);
		_pageObject.addToReset(t);
	};
	function assignOrder(string){
		if(!string){ 
			return undefined;
		}else if(string !== ""){
			return Number(string);
		}else{
			return -1;	
		}
	}
	function addOrder(order){
		if(!_numberInOrders)_numberInOrders=[];
		for(var i=0;i<_numberInOrders.length;i++){
			if(_numberInOrders[i].order==order){
				_numberInOrders[i].required++;
				return;	
			}
		}
		_orderPosition=1;
		_numberInOrders.push({
			order:order,
			required:1,
			landed:0	
		});	
		
	};
	function checkInOrder(order, array, position){
		if(!order)return true;
		if(order === position){
			for(var i=0;i<array.length;i++){
				if(array[i].order==order){
					array[i].landed++;
					if(array[i].landed === array[i].required){
						_orderPosition++;
					}
					return true;
				}
			}
		}
		return false;
	}
	function createFbObj(cfb){	
		return {
				text: cfb.firstChild.nodeValue,
				x: Number(cfb.getAttribute("x")),
				y: Number(cfb.getAttribute("y")),	
				width: Number(cfb.getAttribute("width")),
				height: Number(cfb.getAttribute("height")),	
				tickcross: (cfb.getAttribute("tickCross")!=="yes")?false:true,	
				tickcrossX: (cfb.getAttribute("tickCrossX"))?Number(cfb.getAttribute("tickCrossX")):undefined,	
				tickcrossY: (cfb.getAttribute("tickCrossY"))?Number(cfb.getAttribute("tickCrossY")):undefined,	
				background: (cfb.getAttribute("fbbg")!=="no")?true:false,	
				closeBtn: (cfb.getAttribute("closeBtn")!=="no")?true:false,	
				sound: (cfb.getAttribute("sound"))?cfb.getAttribute("sound"):undefined,	
			};
	}
	function placeTargets(){
		for(var i=0,ii=_targets.length;i<ii;i++){
			
			var image = Helpers.findImage(_targets[i].image, _pageObject.images);
		
			if(image){	
				var im = Helpers.addImage(_targets[i].image, _pageObject.images, _holder);
				$(im.pic).attr("id",_targets[i].id);
				TweenLite.set($("#"+_targets[i].id),{position: "absolute", x: _targets[i].x, y: _targets[i].y, opacity:0});
			}else{
				$(_holder).append("<div id=\""+_targets[i].id+"\"></div>");
				if(_targets[i].image!=="invisible"){
					$("#"+_targets[i].id).addClass("drag-drop-target");	
				}
				TweenLite.set($("#"+_targets[i].id),{position: "absolute", x: _targets[i].x, y: _targets[i].y, width: _targets[i].width, height: _targets[i].height, opacity:0});
			}		
		}
	}
	function placeDraggers(){
		for(var i=0,ii=_draggers.length;i<ii;i++){
			var image = Helpers.findImage(_draggers[i].image, _pageObject.images);
			if(image){	
			_draggers[i].width = image.width;
			_draggers[i].height = image.height;
				if(_draggers[i].class){
					$(image).addClass(_draggers[i].class);	
				}
				_draggers[i].imageobj = Helpers.addImage(_draggers[i].image, _pageObject.images, _holder);
				TweenLite.set(_draggers[i].imageobj.pic, {position: "absolute", x: _draggers[i].x, y: _draggers[i].y, width:_draggers[i].width*_draggers[i].startScaleX, height:_draggers[i].height*_draggers[i].startScaleY, opacity:0});
				$(_draggers[i].imageobj.pic).attr("id",_draggers[i].id).addClass("drag-drop-drag");	
				_draggers[i].width = _draggers[i].imageobj.width;
				_draggers[i].height = _draggers[i].imageobj.height;
			}else{
				$(_holder).append("<div id=\""+_draggers[i].id+"\" class=\"drag-drop-text-drag drag-drop-drag\"><p id=\""+_draggers[i].id+"-text\">"+_draggers[i].image+"</p ></div>");
				
				TweenLite.set($("#"+_draggers[i].id),{position: "absolute", x: _draggers[i].x, y: _draggers[i].y, width: _draggers[i].width, height: _draggers[i].height, opacity:0});				
				var py = Helpers.verticalAlignText($("#"+_draggers[i].id+"-text"), $("#"+_draggers[i].id));
				TweenLite.set($("#"+_draggers[i].id+"-text"),{y:py});
				
			}
		}
	}
	function revealAndActivate(){
		for(var i=0;i<_numberoftargets;i++){
			tl.to($("#"+_targets[i].id), 0.5,{ opacity:1},0);
		}
		for(i=0;i<_numberofdraggers;i++){
			tl.to($("#"+_draggers[i].id), 0.5,{ opacity:1},0);		
		}
		var droppables = $(".drag-drop-drag");
		var overlap = "50%";
		var SX, SY, value = Global.model.zoom;
		Draggable.create(droppables, {
			type:"x,y",
			//bounds: _holder,
			onPress:function(){
				SX = this.x;
				SY = this.y;
				value = Global.model.zoom;
			},
			onDrag:function(){
				if(!createjs.BrowserDetect.isFirefox){
					var ratio = (1/value)-1;
					TweenMax.set(this.target,{ x:"+="+(this.x-SX)*ratio , y:"+="+(this.y-SY)*ratio });
				}
			},
			onRelease:function(e){
				var id = this.target.getAttribute("id");
				for(i=0;i<_numberofdraggers;i++){
					if(_draggers[i].id === id){	
						if(_draggers[i].target && this.hitTest($("#"+_draggers[i].target.id), overlap) && checkInOrder(_draggers[i].order, _numberInOrders, _orderPosition)){
							this.disable();
							
							if(_draggers[i].finishx){
								var t = TweenLite.to($("#"+id), 0.5,{ x:_draggers[i].finishx, y:_draggers[i].finishy, width:_draggers[i].width*_draggers[i].scalex, height:_draggers[i].height*_draggers[i].scaley},0);
								_pageObject.addToReset(t);
							}else{
								var u = TweenLite.to($("#"+id), 0.5,{ x:_draggers[i].target.x, y:_draggers[i].target.y, scaleX:_draggers[i].scalex, scaleY:_draggers[i].scaley},0);
								_pageObject.addToReset(u);
							}
							_draggers[i].landed=true;
							if(checkComplete()){
								_base.setToComplete();	
							}
							if(_draggers[i].cfb){
								showFb(_draggers[i].cfb);
							}
						}else{
							var a =TweenLite.to($("#"+id), 0.5,{ x:_draggers[i].x, y:_draggers[i].y });
							_pageObject.addToReset(a);
							if(_draggers[i].icfb){
								showFb(_draggers[i].icfb);
							}						
						}
						break;
					}
				}
			}
		});
	}
	function showFb(fbObj){
		 closeFb();
		var popup;
		popup = new Helpers.popup();
		popup.setWidth(fbObj.width);
		popup.setHeight(fbObj.height);
		popup.setX(fbObj.x);
		popup.setY(fbObj.y);
		popup.setName(_prefix+"feedback");
		popup.setClosebtn(true);	
		popup.addToStage(_holder);	
		popup.addText(fbObj.text);		
		if(fbObj.sound){
			Global.soundController.playSound(fbObj.sound, _pageObject);
		}
		_popup=popup;
	}
	function closeFb(){		  			
		if(_popup){_popup.removeFromStage();}else{
			Global.soundController.stopSound();
		}
	}
	function checkComplete(){
		for(var i=0;i<_numberofdraggers;i++){
			if(!_draggers[i].landed && _draggers[i].target){
				return false;
			}			
		}
		return true;
	}
	function shuffleYs(){
		var ys = [];
		for(var i=0;i<_numberofdraggers;i++){	
			ys.push({y:_draggers[i].y, x:_draggers[i].x});
		}
    	Helpers.shuffleArray(ys);
		for(i=0;i<_numberofdraggers;i++){	
			_draggers[i].y = ys[i].y;
			_draggers[i].x = ys[i].x;
		}			
	}
};
;// JavaScript Document
Activities.DragDropIntoList=function(){
	"use strict";
	var _base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _prefix;
	var _targets =[];
	var _numberoftargets;
	var _draggers = [];
	var _numberofdraggers;
	var _draggables=[];
	var _bHeight;
	var _options;
	var _popup;
	var _finalfb;
	var tl;
	
	this.buildActivity = function(pageObject, holder){
		_base = new Activities.base();
		_pageObject = pageObject;
		_holder = holder;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		tl = new TimelineLite();
		_pageObject.addToReset(tl);	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("selectOptions")[0];		
		_options = {
			delay: xmlcontent.getAttribute("delay"),
			draggerFontSize: Number(xmlcontent.getAttribute("draggerFontSize")),
			shufflePositions: (xmlcontent.getAttribute("shufflePos")==="true")?true:false,
			bottomPadding: Number(xmlcontent.getAttribute("bottomPadding")),
			yBetween: (xmlcontent.getAttribute("yBetween"))?Number(xmlcontent.getAttribute("yBetween")):undefined
		};
		var targets = $(xmlcontent).children("target");
		_numberoftargets = targets.length;
		for(var i=0;i<_numberoftargets;i++){		
			_targets.push(
				{
					x: Number(targets[i].getAttribute("x")),	
					y: Number(targets[i].getAttribute("y")),	
					width: Number(targets[i].getAttribute("width")),	
					height: Number(targets[i].getAttribute("height")),	
					toppadding: Number(targets[i].getAttribute("lfromtop")),
					name: targets[i].getAttribute("number"),
					colour: Helpers.convertColour(targets[i].getAttribute("colour")),
					textcolour: Helpers.convertColour(targets[i].getAttribute("tColour")),
					title: (targets[i].firstChild)?targets[i].firstChild.nodeValue:false,
					id: _prefix+"-list-"+i,
					numberRequired:0,
					numberOn:0,
					targetObject:undefined,
					draggersOn:[]
				}
			);
			var tfbxml = (targets[i].getElementsByTagName("FB"))?targets[i].getElementsByTagName("FB")[0]:undefined;
		}
		
		var draggers = $(xmlcontent).children("option");
		_numberofdraggers = draggers.length;
		for(i=0;i<_numberofdraggers;i++){	
		 	var dr = draggers[i].getElementsByTagName("dragger")[0];
			_draggers[i] = 
				{
					x: 	Number(dr.getAttribute("x")),
					y: 	(_options.yBetween && i>0)? _draggers[i-1].y + _draggers[i-1].height + _options.yBetween :Number(dr.getAttribute("y")),	
					delay: 	Number(dr.getAttribute("delay")),
					colour: Helpers.convertColour(dr.getAttribute("colour")),
					roColour: Helpers.convertColour(dr.getAttribute("roColour")),
					tColour: Helpers.convertColour(dr.getAttribute("tColour")),
					width: Number(dr.getAttribute("width")),
					height: Number(dr.getAttribute("height")),
					text: dr.firstChild.nodeValue,
					cfb: undefined,
					id: _prefix+"-dr-"+i,
					landed:false
				};
				
			for(var a=0;a<_numberoftargets;a++){	
				if(draggers[i].getElementsByTagName("correct")[0].firstChild.nodeValue === _targets[a].name ){	
					_draggers[i].target=_targets[a];
					_targets[a].numberRequired++;
				}
			}
			var cfbxml = (draggers[i].getElementsByTagName("correctfb"))?draggers[i].getElementsByTagName("correctfb")[0]:undefined;
			
			if(cfbxml){
				var cfb = {
					x: 	Number(cfbxml.getAttribute("x")),
					y: 	Number(cfbxml.getAttribute("y")),	
					width: Number(cfbxml.getAttribute("width")),
					height: Number(cfbxml.getAttribute("height")),
					sound: cfbxml.getAttribute("sound"),
					text: cfbxml.firstChild.nodeValue
				};
				_draggers[i].cfb = cfb;
			}
			
		}
		var finalfb = ($(xmlcontent).children("fb"))?$(xmlcontent).children("fb")[0]:undefined;		
		if(finalfb){
			_finalfb = {
				x: 	Number(finalfb.getAttribute("x")),
				y: 	Number(finalfb.getAttribute("y")),	
				width: Number(finalfb.getAttribute("width")),
				height: Number(finalfb.getAttribute("height")),
				sound: finalfb.getAttribute("sound"),
				text: finalfb.firstChild.nodeValue
			};
		}
		if(_options.shufflePositions){
			var ys = [];
			for(i=0;i<_numberofdraggers;i++){	
				ys.push({x:_draggers[i].x, y:_draggers[i].y});
			}
			Helpers.shuffleArray(ys);
			for(i=0;i<_numberofdraggers;i++){	
				_draggers[i].y = ys[i].y;
				_draggers[i].x = ys[i].x;
			}			
		}
		var t = new TweenMax.delayedCall(_options.delay, placeTargets);
		_pageObject.addToReset(t);
	};
	function placeTargets(){
		var tl2 = new TimelineLite();
		_pageObject.addToReset(tl2);	
		for(var i=0;i<_numberoftargets;i++){	
			if(_targets[i].title){
				var li = new Helpers.listBox();
				li.setId(_targets[i].id);
				li.setHeight(_targets[i].height);
				li.setWidth(_targets[i].width);
				li.setTextColour(_targets[i].textcolour);
				li.drawBox(_holder);	
				$("#"+_targets[i].id).append("<p class=\"list-box-heading\">"+_targets[i].title+"</p>");
				TweenLite.set($("#"+_targets[i].id), {top: _targets[i].y, left: _targets[i].x, opacity:0});
			}else{
				$(_holder).append('<div id="'+_targets[i].id+'"></div>');
				TweenLite.set($("#"+_targets[i].id), {position:"absolute", top: _targets[i].y, left: _targets[i].x, width:_targets[i].width, height:_targets[i].height, opacity:0});
			}
		}
		placeDrags();
		revealAndActivate();
	}
	function placeDrags(){
		for(var i=0;i<_numberofdraggers;i++){
			var tl3 = new TimelineLite();
			_pageObject.addToReset(tl3);		
			var dr = new Helpers.Button(_draggers[i].text);
			dr.setWidth(_draggers[i].width);
			dr.setHeight(_draggers[i].height);
			dr.setButtonColour(_draggers[i].colour);
			dr.setFontColour(_draggers[i].tColour);
			dr.setId(_draggers[i].id);
			dr.drawButton(_holder);
			TweenLite.set($("#"+_draggers[i].id), {y: _draggers[i].y, x: _draggers[i].x, opacity:0});
		}
	}
	function revealAndActivate(){
		for(var i=0;i<_numberoftargets;i++){
			tl.to($("#"+_targets[i].id), 0.3,{ opacity:1}, 0.5);
		}
		var droppables = [];
		for(i=0;i<_numberofdraggers;i++){			
			tl.to($("#"+_draggers[i].id), 0.3,{ opacity:1}, 0.5);	
			droppables.push($("#"+_draggers[i].id));	
		}
		var SX, SY, value = Global.model.zoom;	
		var dr = Draggable.create(droppables, {
			type:"x,y",
			//bounds:_holder,
			onPress:function(){
				SX = this.x;
				SY = this.y;
				value = Global.model.zoom;
			},
			onDrag:function(){
				if(!createjs.BrowserDetect.isFirefox){
					var ratio = (1/value)-1;
					TweenMax.set(this.target,{ x:"+="+(this.x-SX)*ratio , y:"+="+(this.y-SY)*ratio });
				}
			},
			onRelease:release
		});
		
	}

	function release(e){
		var overlap = "50%";
		var id = this.target.getAttribute("id");
		for(var i=0;i<_numberofdraggers;i++){
			if(_draggers[i].id === id){
				if(_draggers[i].target && this.hitTest($("#"+_draggers[i].target.id), overlap)){
					var xx = _draggers[i].target.x + ((_draggers[i].target.width/2) - (_draggers[i].width/2));
					var yy = _draggers[i].target.y + _draggers[i].target.toppadding;
					for(var a=0,aa=_draggers[i].target.draggersOn.length;a<aa;a++){
						yy+= _draggers[i].target.draggersOn[a].height;
						yy+= _options.bottomPadding;
					}
					TweenLite.to($("#"+id), 0.5,{ x: xx, y:yy},0);				
					_draggers[i].landed=true;
					_draggers[i].target.draggersOn.push(_draggers[i]);
					_draggers[i].target.numberOn++;
					if(checkComplete()){
						_base.setToComplete();	
						if(_finalfb){
							showFb(_finalfb);
						}
					}
					if(_draggers[i].cfb){
						showFb(_draggers[i].cfb);
					}
					this.disable();
					_pageObject.addToResetEventListeners($("#"+id));	
				}else{
					TweenLite.to($("#"+id), 0.5,{ x:_draggers[i].x, y:_draggers[i].y });						
				}
				break;
			}
		}
	}
	function showFb(fbObj){
		 closeFb();
		var popup;
		popup = new Helpers.popup();
		popup.setWidth(fbObj.width);
		popup.setHeight(fbObj.height);
		popup.setX(fbObj.x);
		popup.setY(fbObj.y);
		popup.setName("feedback");
		popup.setClosebtn(true);	
		popup.addToStage(_holder);	
		popup.addText(fbObj.text);		
		if(fbObj.sound){
			Global.soundController.playSound(fbObj.sound, _pageObject);
		}
		_popup=popup;
	}
	function closeFb(){		  			
		if(_popup){_popup.removeFromStage();}else{
			Global.soundController.stopSound();
		}
	}
	function checkComplete(){
		for(var i=0;i<_numberoftargets;i++){
			if(_targets[i].numberOn !== _targets[i].numberRequired){
				return false;
			}			
		}
		return true;
	}
};;// JavaScript Document
Activities.DragFromScrollerIntoList = function(){	
	var _base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _prefix;
	var _scroller;
	var _targets;
	var _numberoftargets;
	var _smallImageMaxWidth;
	var _smallMaxHeight;
	var _draggers;
	var _numberofdraggers;
	var _largestIconWidth = 0;
	var _sly;
	var _draggables=[];
	var _selectedDragger;
	var _bHeight;
	var _popup;
	var _liItems = [];
	var tl;
	var THIS=this;
	
	this.buildActivity = function(pageObject, holder){
		_base = new Activities.base();
		_pageObject = pageObject;
		_holder = holder;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		tl = new TimelineLite();
		_pageObject.addToReset(tl);	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("selectOptions")[0];		
		_bHeight = Number($(xmlcontent).children("buttonheight") > 0) ? Number($(xmlcontent).children("buttonheight")) : 50;
		_smallImageMaxWidth = ($(xmlcontent).children("smallImageMaxWidth")[0])? Number($(xmlcontent).children("smallImageMaxWidth")[0].firstChild.nodeValue) : false;
		_smallMaxHeight = ($(xmlcontent).children("smallMaxHeight")[0])? Number($(xmlcontent).children("smallMaxHeight")[0].firstChild.nodeValue) : false;
		var targets = $(xmlcontent).children("target");
		_numberoftargets = targets.length;
		_targets=[];
		for(var i=0;i<_numberoftargets;i++){		
			_targets.push(
				{
					x: Number(targets[i].getAttribute("x")),	
					y: Number(targets[i].getAttribute("y")),	
					width: Number(targets[i].getAttribute("width")),	
					height: Number(targets[i].getAttribute("height")),	
					toppadding: Number(targets[i].getAttribute("lfromtop")),
					name: targets[i].getAttribute("number"),
					colour: Helpers.convertColour(targets[i].getAttribute("lfromtop")),
					textcolour: Helpers.convertColour(targets[i].getAttribute("tColour")),
					revealdelay: Number(targets[i].getAttribute("delay")),
					fontsize: Number(targets[i].getAttribute("fontSize")),
					title: (targets[i].firstChild)?targets[i].firstChild.nodeValue:"",
					id: _prefix+"-list-"+i,
					numberRequired:0,
					numberOn:0,
					shadow: (targets[i].getAttribute("addShadow") !== "true") ? false : true,
				}
			);
			var tfbxml = (targets[i].getElementsByTagName("FB"))?targets[i].getElementsByTagName("FB")[0]:undefined;					
			if(tfbxml){
				var tfb = {
					width: Number(tfbxml.getAttribute("width")),
					height: Number(tfbxml.getAttribute("height")),
					x: Number(tfbxml.getAttribute("x")),
					y: Number(tfbxml.getAttribute("y")),
					bgVisible: tfbxml.getAttribute("bgVisible") !== "no" ? true : false,
					closeButton: tfbxml.getAttribute("closeBtn") !== "no" ? true : false,
					tickCross: tfbxml.getAttribute("tickCross") === "yes" ? true : false,
					tickCrossX: Number(tfbxml.getAttribute("tickCrossX")),
					tickCrossY: Number(tfbxml.getAttribute("tickCrossY")),
					tickCrossMaxSize: Number(tfbxml.getAttribute("tcMaxSize")),
					activities: tfbxml.getElementsByTagName("activity"),
					rawpage: tfbxml
				};
				_targets[i].feedback = tfb;
			}
		}
		_draggers=[];
		var draggers = $(xmlcontent).children("option");
		_numberofdraggers = draggers.length;
		for(i=0;i<_numberofdraggers;i++){	
			var dr = draggers[i].getElementsByTagName("dragger")[0];
			var title = draggers[i].getElementsByTagName("title")[0];

			var coFeedback = draggers[i].getElementsByTagName("cFB")[0];
			var icoFeedback = draggers[i].getElementsByTagName("icFB")[0];
			_draggers[i]=
				{
					id: _prefix+"-dr-"+i,
					width: Number(dr.getAttribute("width")),	
					height: Number(dr.getAttribute("height")),	
					backgroundcolour: Helpers.convertColour(dr.getAttribute("bColour")),
					delay: Number(dr.getAttribute("delay")),
					title: title.firstChild.nodeValue,
					correctTarget: draggers[i].getElementsByTagName("correct")[0].firstChild.nodeValue,
					iconimage: draggers[i].getElementsByTagName("iconImage")[0].firstChild.nodeValue,
					complete: false,	
				};	
			
			if(coFeedback){
				var cF = {
					width: Number(coFeedback.getAttribute("width")),
					height: Number(coFeedback.getAttribute("height")),
					x: Number(coFeedback.getAttribute("x")),
					y: Number(coFeedback.getAttribute("y")),
					bgVisible: coFeedback.getAttribute("bgVisible") === "yes" ? true : false,
					closeButton: coFeedback.getAttribute("closeBtn") === "yes" ? true : false,
					tickCross: coFeedback.getAttribute("tickCross") === "yes" ? true : false,
					tickCrossX: Number(coFeedback.getAttribute("tickCrossX")),
					tickCrossY: Number(coFeedback.getAttribute("tickCrossY")),
					tickCrossMaxSize: Number(coFeedback.getAttribute("tcMaxSize")),
					activities: coFeedback.getElementsByTagName("activity"),
					rawpage: coFeedback
				};
				_draggers[i].cFeedback = cF;
			}
			if(icoFeedback){
				var icF = {
					width: Number(icoFeedback.getAttribute("width")),
					height: Number(icoFeedback.getAttribute("height")),
					x: Number(icoFeedback.getAttribute("x")),
					y: Number(icoFeedback.getAttribute("y")),
					bgVisible: icoFeedback.getAttribute("bgVisible") === "yes" ? true : false,
					closeButton: icoFeedback.getAttribute("closeBtn") === "yes" ? true : false,
					tickCross: icoFeedback.getAttribute("tickCross") === "yes" ? true : false,
					tickCrossX: Number(icoFeedback.getAttribute("tickCrossX")),
					tickCrossY: Number(icoFeedback.getAttribute("tickCrossY")),
					tickCrossMaxSize: Number(icoFeedback.getAttribute("tcMaxSize")),
					activities: icoFeedback.getElementsByTagName("activity"),
					rawpage: icoFeedback						
				};
				_draggers[i].icoFeedback = icF;
			}
			for(var a=0;a<_numberoftargets;a++){
				if(_draggers[i].correctTarget === _targets[a].name){
					_draggers[i].target = _targets[a];
					_draggers[i].target.numberRequired++;
				}
			}	
		}
		_scroller={
			x: Number(xmlcontent.getAttribute("scrollerx")),
			y: Number(xmlcontent.getAttribute("scrollery"))-10,		
			delayActivation: xmlcontent.getAttribute("delayActivation"),	
			width: Number(xmlcontent.getAttribute("scrollerNumberVisible")) * (_draggers[0].width + 5),
			height: _draggers[0].height + 5,
			delayReveal: xmlcontent.getAttribute("scrollerdelay"),	
		};
		
		placeLists();
		tl.append(new TweenMax.delayedCall(_scroller.delayReveal, placeDrags));	
	};
	function placeLists(){
		var tl2 = new TimelineLite();
		_pageObject.addToReset(tl2);	
		for(var i=0;i<_numberoftargets;i++){
			if(_targets[i].shadow){
				$(_holder).append("<div id=\""+_targets[i].id+"\"></div>");
				if(_targets[i].image!=="invisible"){
					$("#"+_targets[i].id).addClass("drag-drop-target-in-list").css;	
				}
				TweenLite.set($("#"+_targets[i].id),{position: "absolute", x: _targets[i].x, y: _targets[i].y, width: _targets[i].width, height: _targets[i].height, opacity:0});
				tl2.to($("#"+_targets[i].id), 0.3,{ opacity:1}, _targets[i].revealdelay);
			}else{
				var li = new Helpers.listBox();
				li.setId(_targets[i].id);
				li.setHeight(_targets[i].height);
				li.setWidth(_targets[i].width);
				li.setTextColour(_targets[i].textcolour);
				li.drawBox(_holder);	
				$("#"+_targets[i].id).append("<p class=\"list-box-heading\">"+_targets[i].title+"</p>");
				TweenLite.set($("#"+_targets[i].id), {top: _targets[i].y, left: _targets[i].x, opacity:0});
				tl2.to($("#"+_targets[i].id), 0.3,{ opacity:1}, _targets[i].revealdelay);
			}
			
		}
	}
	
	function placeDrags(){
	
		_scroller.id = _prefix+"-dr-scroller";
		$(_holder).append("<div id=\""+_scroller.id+"\" class=\"wrap\"><div id=\"scrollholder"+_prefix+"\" class=\"frame oneperframe\ style=\"overflow: hidden\"><ul id=\"scrollulvert\" class=\"slidee\"></ul></div></div></div>");
		TweenLite.set($("#"+_scroller.id), {top: _scroller.y, left: _scroller.x, width: _scroller.width, height: _scroller.height, opacity:0});
		
		for(var i=0;i<_numberofdraggers;i++){
			_draggers[i].id = _prefix+"-drag-"+i;
			$("#scrollulvert").append("<li id=\""+_prefix+"-scrollulvertli-"+i+"\"><div class=\"icon-ind-holder\" id=\""+_prefix+"icon-ind-holder-"+i+"\"></div></li>");
			TweenLite.set($("#"+_prefix+"-scrollulvertli-"+i), {autoAlpha:0});
			if(i===0){
				$("#"+_prefix+"-scrollulvertli-"+i).addClass("active");
				TweenLite.set($("#"+_prefix+"-scrollulvertli-"+i), {autoAlpha:1});
			}
			
			var thatid = _prefix+"-drag-"+i+"-ic";
			var c = new Helpers.iconBox();
			c.setId(thatid);
			c.setHeight(_draggers[i].height);
			//c.setWidth(_draggers[i].width);
			c.setWidth(_scroller.width -5);
			c.drawIcon("#"+_prefix+"icon-ind-holder-"+i);
			_draggers[i].dragObj = c;
			_draggers[i].drag = $("#"+_prefix+"icon-ind-holder-"+i);
			_draggables[i]= _draggers[i].drag;	 	
			var holder = $("#"+thatid+" .iconbox-inner");
			_draggers[i].image = Helpers.addImage(_draggers[i].iconimage, _pageObject.images, holder);	
			_draggers[i].imagewidth = _draggers[i].image.width;
			_draggers[i].imageheight = _draggers[i].image.height;	
			
			$(holder).append("<p class=\"draggertitle\" id=\"draggertitle-"+i+"\">"+_draggers[i].title+"</p>");
			
			TweenLite.set($("#draggertitle-"+i), {padding:0, margin:0});		
			_largestIconWidth = (_draggers[i].image && (_draggers[i].image.width > _largestIconWidth)) ? _draggers[i].image.width : _largestIconWidth;		
		}
		for(i=0;i<_numberofdraggers;i++){
			var holder = $("#"+_prefix+"-drag-"+i+"-ic"+" .iconbox-inner");
			var y = Helpers.verticalAlignImage(_draggers[i].image, holder);
			TweenLite.set(_draggers[i].image.pic, {top: y, left:10, width:_draggers[i].image.width, height:_draggers[i].image.height });
			TweenLite.set($("#draggertitle-"+i), {left: _largestIconWidth+10, margin:"0 5px"});
			var e = Helpers.verticalAlignText($("#draggertitle-"+i), $("#draggertitle-"+i).parent());
			TweenLite.set($("#draggertitle-"+i), {top: e});
		}
		
		
		
		var $frame  = $('#scrollholder'+_prefix+'');
		var $wrap   = $frame.parent();
			
		$(_holder).append("<a id=\""+_prefix+"-scrollleft\" class=\"scrollerleft scrollcontrol\"><div class=\"scarrow arrow-left\"></div></a>");
		$(_holder).append("<a id=\""+_prefix+"-scrollright\" class=\"scrollerright scrollcontrol\"><div class=\"scarrow arrow-right\"></div></a>");
		
		TweenLite.set($("#"+_prefix+"-scrollleft"), {height: _scroller.height-20, left:_scroller.x-35, top: _scroller.y+9});
		TweenLite.set($("#"+_prefix+"-scrollright"), {height: _scroller.height-20, left: _scroller.x+_scroller.width+10,  top: _scroller.y+9});
		
		var y1 = ($("#"+_prefix+"-scrollleft").height() /2) - 10;
				
		TweenLite.set($(".scrollcontrol div"), {top:y1, left:3});
		
		$("#"+_prefix+"-scrollright").on('click', function(){
			var active =  $("#scrollulvert li.active");
			 scrollItem(true, active);			
		});
		$("#"+_prefix+"-scrollleft").on('click', function(){
			var active =  $("#scrollulvert li.active");
			scrollItem(false, active);
		});
		tl2 = new TimelineLite();
		_pageObject.addToReset(tl2);	
		tl2.to($("#"+_scroller.id), 0.3,{ opacity:1});
		activateDrags();
		
	}
	function scrollItem(forwards, active){
		if(forwards){
			if($(active).next().is('li')){
				$(active).removeClass("active").next().addClass("active");
			}
		}else{
			if($(active).prev().is('li')){
				
				$(active).removeClass("active").prev().addClass("active");
			}
		}
		setLiWidths();
	}
	function checkScroller(){
		$("#scrollulvert li").each(function(){
			if($(this).hasClass("active")){
				return;
			}
		});
		$("#scrollulvert li").first().addClass("active");
		setLiWidths(true);
	}
	function setLiWidths(instant){
	
		var t = (instant)?0:0.3;
		$("#scrollulvert li").each(function(){
			if($(this).hasClass("active")){
				TweenLite.to($(this), t, {autoAlpha:1});
			}else{
				TweenLite.to($(this), t, {autoAlpha:0});
			}
		});
	}
	
	function activateDrags(){	
	
		$(_draggers).each(function(){
			var that = this;
			var element = $(this.drag.children()[0]);
			var wrapper = element.parent().parent();
			var offset = element.position();
			var value = (!createjs.BrowserDetect.isChrome)?Global.model.zoom:1;
			var scope = {
				clone: element.clone().addClass("clone").prependTo(_holder),
				element: element,
				wrapper:wrapper,
				width: wrapper.outerWidth(),
				dropped: false,
				moved: false,
				dragger: that,
				get x() { return (
						(getPosition(wrapper, offset).x) * 1/value
					); 
				},
				get y() { return (
						(getPosition(wrapper, offset).y) * 1/value
					);				
				}
			};

			scope.draggable = createDraggable(scope);	
			element.on("mousedown touchstart", scope, startDraggable);
			
		});		
	}
	
	function startDraggable(event){
		var dr = event.data;
		_selectedDragger = dr.dragger;
		TweenLite.set(dr.element, { autoAlpha: 0 });
		var img = ($(dr.element.children(".iconbox-inner")[0]).children("img")[0]);
		var cloneImg = $(dr.clone.children(".iconbox-inner")[0]).children("img")[0];
		if(cloneImg)$(dr.clone.children(".iconbox-inner")[0]).children("img")[0].remove();
		$(img).prependTo(dr.clone.children(".iconbox-inner")[0]);
		TweenLite.set(dr.clone, { x: dr.x, y: dr.y, autoAlpha: 1});
		dr.draggable.startDrag(event.originalEvent);
	}
	
	function createDraggable(dr) {
		 var clone   = dr.clone;
		 var wrapper = dr.wrapper;
		 var dscale =  _targets[0].width / (_scroller.width);
		 var SX, SY, value = Global.model.zoom;		
		  dr.draggable = new Draggable(clone, {
			//bounds: _holder,
			onPress:function(){
				SX = this.x;
				SY = this.y;
				value = Global.model.zoom;
			},
			onDrag    : collapseSpace,
			onRelease : dropTile,
	
		  });	
		  return dr.draggable;
		  
		  
		  function collapseSpace(){
			if(!createjs.BrowserDetect.isFirefox){
				var ratio = (1/value)-1;
				TweenMax.set(this.target,{ x:"+="+(this.x-SX)*ratio , y:"+="+(this.y-SY)*ratio });
			}  
    		if (!dr.moved) {
     			 if (!this.hitTest(wrapper)) {
        			dr.moved = true;
        			//var r = TweenLite.to(wrapper, 0.3, { width: 0});
					var active = $(_selectedDragger.drag.parent());
					if($(active).is(':last-child')){
						scrollItem(false, active);
					}else{
						scrollItem(true, active);	
					}
					
					//_pageObject.addToReset(r);
				}
			  }
		  }
		  function dropTile(){
			 
			  var className = undefined;
			  var draggerId = dr.dragger.dragObj.getId();
			  var dragger = $("#"+draggerId);
			  var draggerIn = $("#"+draggerId+" .iconbox-inner");
			  
			  var icon;
			  var text;
			  if (this.hitTest("#"+dr.dragger.target.id, "50%")) {
				  var h = (_smallMaxHeight)?_smallMaxHeight:_bHeight;
				   icon = draggerIn.children(["img"])[0];
				   var iconwidth = $(icon).width();
				   var iconheight = $(icon).height();
				   text = draggerIn.children(["p"])[1];
				
					var y = Number(dr.dragger.target.y + dr.dragger.target.toppadding + (dr.dragger.target.numberOn * (h + 2)));
					$(_selectedDragger.drag.parent()).remove();
				    dr.dragger.dragObj.removeBg(_holder);
					
					var a = TweenLite.to(dragger, 0.3, {height:h, width:dr.dragger.target.width-5, overflow:"hidden"});
					_pageObject.addToReset(a);
				 	var scale = (_bHeight-5) / iconheight;
					var iconScale = (_smallImageMaxWidth && (scale * iconwidth > _smallImageMaxWidth))?_smallImageMaxWidth / iconwidth : scale;
					var iwidth = iconwidth * iconScale;
					var iheight = iconheight * iconScale;
					var b = TweenLite.to(icon, 0.3, {width:iwidth, height:iheight, top:2, left:5});
					_pageObject.addToReset(b);
					var textx = (iconScale * iconwidth)+5;
					var c = TweenLite.to(text, 0.3, {left:textx, width:dr.dragger.target.width-75, top:h/2, fontSize:13});
					var d = TweenLite.to(clone, 0.3, {x: dr.dragger.target.x, y: y, onComplete:fixText});	
					_pageObject.addToReset(c);
					_pageObject.addToReset(d);
						
			  		className = "+=dropped";
					dr.dragger.target.numberOn++;
					dr.draggable.disable();
					dr.dragger.complete=true;
					if(dr.dragger.cFeedback){ showFb(dr.dragger.cFeedback);}
					if(dr.dragger.target.feedback && checkTargetComplete(dr.dragger.target)){ showFb(dr.dragger.target.feedback); }			
					if(checkComplete()){
						_base.setToComplete();
					}					
				}else{
					moveBack(dr, className);
					if(dr.dragger.icoFeedback){ showFb(dr.dragger.icoFeedback);}
				}
				function fixText(){
					var h = (_smallMaxHeight)?_smallMaxHeight:_bHeight;
					var theight = $(text).height();
					var e = TweenLite.to(text, 0.1, {top:(h-theight)/2});
					_pageObject.addToReset(e);
					var imheight = $(icon).height();
					var e2 = TweenLite.to(icon, 0.1, {top:(h-imheight)/2});
					checkScroller();
				}
		  }
	}
	function closeFb(){		  			
		if(_popup && !_popup.invisible){
			_popup.removeFromStage();
		}else{
			 Global.soundController.stopSound();
		}	 
	}
	// MOVE BACK :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	function moveBack(dr, className) {
	  var clone   = dr.clone;
	  var element = dr.element;
	  var wrapper = dr.wrapper;
	
	  TweenLite.to(clone, 0.3, { scale: 1, autoAlpha: 1, x: dr.x, y: dr.y, onComplete: done });
	
	  if (className) TweenLite.to([element, clone], 0.3, { className: className });
	
	  function done() {
		dr.moved = false;
		TweenLite.set(clone, { autoAlpha: 0 });
		var active =  $("#scrollulvert li.active");
		$(active).removeClass("active");
		$(element.parent().parent()).addClass("active");
		setLiWidths(true);
		TweenLite.set(element, { autoAlpha: 1 });
		var img = ($(clone.children(".iconbox-inner")[0]).children("img")[0]);
		$(img).prependTo(element.children(".iconbox-inner")[0]);
	  }
	}
	function showFb(fbObj){
		
		closeFb();
		var popup;
		if(fbObj.activities.length>0){
			popup = new Helpers.popup();
			popup.setWidth(fbObj.width);
			popup.setHeight(fbObj.height);
			popup.setX(fbObj.x);
			popup.setY(fbObj.y);
			popup.setName("feedback");
			popup.setClosebtn(fbObj.closeButton);		
			popup.addToStage(_holder);
			
		}else{
			popup={};
		}
		popup.pageObject = new Models.page("popup obj");
		popup.pageObject.numberofscreens = fbObj.rawpage.getElementsByTagName("page").length;
		popup.pageObject.pagexml = fbObj.rawpage.getElementsByTagName("page");		
		popup.pageObject.sounds = _pageObject.sounds;
		popup.pageObject.images = _pageObject.images;
		popup.pageObject.manifest = _pageObject.manifest;
		popup.pageObject.transcripts = _pageObject.transcripts;
		_popup = popup;
		if(fbObj.activities.length>0){
			popup.invisible=false;
			for(var i=0,ii=fbObj.activities.length;i<ii;i++){
				Factory.activityStore.createActivity(fbObj.activities[i].firstChild.nodeValue, popup.pageObject, $("#feedback")[0]);
			}
			if(popup.pageObject.pagexml[popup.pageObject.pageposition].getAttribute("sound")!=null || popup.pageObject.pagexml[popup.pageObject.pageposition].getAttribute("sound")!=undefined){
				popup.includeSound(true);
				Global.soundController.playSound(popup.pageObject.pagexml[popup.pageObject.pageposition].getAttribute("sound"), popup.pageObject);
			}
		}else if(fbObj.activities.length < 1 && (popup.pageObject.pagexml[0].getAttribute("sound")!=null || popup.pageObject.pagexml[0].getAttribute("sound")!=undefined)){
			Global.soundController.playSound(popup.pageObject.pagexml[0].getAttribute("sound"), popup.pageObject);
			popup.invisible=true;
		}
		
	}

	function closeOpenFeedback(){
		
	}
	function getPosition(wrapper, offset) {
	
		var position1 = wrapper.offset();
	  	var position2 = $(_holder).offset();
	
	 	return {
			x: position1.left - position2.left + offset.left,
			y: position1.top  - position2.top  + offset.top
	  	};
	}
	function checkComplete(){
		for(var i=0,ii=_draggers.length;i<ii;i++){
			if(!_draggers[i].complete){
				return false;
			}
		}
		return true;
	}
	function checkTargetComplete(target){
		if(target.numberRequired === target.numberOn){
			return true;	
		}else{
				return false;
		}
	}
};;// JavaScript Document
Activities.OrderItems=function(){
	var _base; 
	var _pageNumber;
	var _pageObject;
	var tl;
	var _items=[];
	var _targets=[];
	var _droppables=[];
	var _defs=[];
	var _holder;
	var _options;
	var _checkButton;
	var _prefix;
	var _numberofitems;
	var _termObjectSelected;
	var _cfeedback;
	var _icfeedback;
	var _orderedShuffled=[];
	var _originalYs=[];
	var _shuffledYs=[];
	var _posInfos=[];
	var targetIndex;
	var _popup;
	var _checked = false;
		
	this.buildActivity = function(pageObject, holder){
		CSSPlugin.defaultTransformPerspective=500;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		_base = new Activities.base();
		_holder = holder;	
		_pageObject = pageObject;
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("draganddrop")[0];
		_options = {	
			targetsDelay: Number(xmlcontent.getAttribute("targetsdelay")),
			dragsDelay: Number(xmlcontent.getAttribute("dragsDelay")),
			activateDelay: Number(xmlcontent.getAttribute("activateDelay")),
		};
		var doneXml = $(xmlcontent).children("doneBtn")[0];
		_checkButton = {	
			colour:Helpers.convertColour(doneXml.getAttribute("colour")),
			roColour: Helpers.convertColour(doneXml.getAttribute("roColour")),
			text: doneXml.getAttribute("text"),
			x: Number(doneXml.getAttribute("x")),
			y: Number(doneXml.getAttribute("y")),
			width: Number(doneXml.getAttribute("width")),
			height: Number(doneXml.getAttribute("height"))
		};
		var draggersxml = $(xmlcontent).children("dragger");
		_numberofitems = draggersxml.length;
		var ys=[];
		for(var i=0,ii=_numberofitems;i<ii;i++){
			ys.push(Number(draggersxml[i].getAttribute("targety")));
		}
		Helpers.shuffleArray(ys);
		for(var i=0,ii=_numberofitems;i<ii;i++){	
			var dr={
				width: Number(draggersxml[i].getAttribute("width")),
				height: Number(draggersxml[i].getAttribute("height")),
				currentY: ys[i],
				colour: Helpers.convertColour(draggersxml[i].getAttribute("colour")),
				roColour: Helpers.convertColour(draggersxml[i].getAttribute("roColour")),
				fontSize: Number($(draggersxml[i]).children("text")[0].getAttribute("fSize")),
				fontColour: Helpers.convertColour($(draggersxml[i]).children("text")[0].getAttribute("fColour")),
				text: $(draggersxml[i]).children("text")[0].firstChild.nodeValue,
				icon: ($(draggersxml[i]).children("libraryicon")[0])?$(draggersxml[i]).children("libraryicon")[0].firstChild.nodeValue:null,
				iconMaxSize: ($(draggersxml[i]).children("libraryicon")[0])?Number($(draggersxml[i]).children("libraryicon")[0].getAttribute("maxSize")):null,
				id: _prefix+"-dragger-"+i,
				y: ys[i],
				x: Number(draggersxml[i].getAttribute("targetx")),
				position:i
			};
			var tar={
				width: Number(draggersxml[i].getAttribute("width")),
				height: Number(draggersxml[i].getAttribute("height")),
				x: Number(draggersxml[i].getAttribute("targetx")),
				y: Number(draggersxml[i].getAttribute("targety")),
				id: _prefix+"-target-"+i,
				correctOnTarget: dr
			};
			_items.push(dr);
			_targets.push(tar);

		}
		for(i=0,ii=_numberofitems;i<ii;i++){
			for(var a=0;a<_numberofitems;a++){
				if(_targets[i].y===_items[a].y){				
					_targets[i].draggerOnTarget = _items[a];
					_items[a].targetOn = _targets[i];
					break;
				}
			}
		}
		
		cfbxml = $(xmlcontent).children("correctfeedback")[0];
		_correctFb = {
			x: Number(cfbxml.getAttribute("x")),
			y: Number(cfbxml.getAttribute("y")),
			width: Number(cfbxml.getAttribute("width")),
			height: Number(cfbxml.getAttribute("height")),
			sound: cfbxml.getAttribute("sound"),
			text: cfbxml.firstChild.nodeValue,
			fontColour: Helpers.convertColour(cfbxml.getAttribute("fontColour")),
		};
		icfbxml = $(xmlcontent).children("incorrectfeedback")[0];
		_incorrectFb = {
			x: Number(icfbxml.getAttribute("x")),
			y: Number(icfbxml.getAttribute("y")),
			width: Number(icfbxml.getAttribute("width")),
			height: Number(icfbxml.getAttribute("height")),
			sound: icfbxml.getAttribute("sound"),
			text: icfbxml.firstChild.nodeValue,
			fontColour: Helpers.convertColour(icfbxml.getAttribute("fontColour")),
			hideOnReorder: (icfbxml.getAttribute("hideOnReorder") && icfbxml.getAttribute("hideOnReorder")==="false")? false:true
		};		
		//shuffleYs();
		placeTargets();
		var t = new TweenMax.delayedCall(_options.dragsDelay, placeDraggers);
		_pageObject.addToReset(t);
		var e = new TweenMax.delayedCall(_options.activateDelay, setDraggers);
		_pageObject.addToReset(e);
		
	};

	function placeTargets(){
		for(var i=0,ii=_numberofitems;i<ii;i++){
			$(_holder).append("<div id=\""+_targets[i].id+"\" class=\"drag-drop-target\"></div>");
			TweenLite.set($("#"+_targets[i].id),{position: "absolute", x: _targets[i].x, y: _targets[i].y, width: _targets[i].width, height: _targets[i].height});				
		}
	}
	function placeDraggers(){
		var xOfText = 5;
		for(i=0,ii=_numberofitems;i<ii;i++){
			var dr = new Helpers.listBox();
			dr.setWidth(_items[i].width);
			dr.setHeight(_items[i].height);
			dr.setColour(_items[i].colour);
			dr.setOverColour("#74cc78");
			dr.setSelectColour("#fe7a7a");
			dr.setTextColour(_items[i].fontColour);
			dr.setId(_items[i].id);
			dr.drawBox(_holder);
			
			TweenLite.set($("#"+_items[i].id), {y: _items[i].y, x: _items[i].x+40, opacity:0});
			TweenLite.set($("#"+_items[i].id+" .listbox-gradient"),{position:"absolute"});
			
			if(_items[i].icon){
				_items[i].image = Helpers.addImage(_items[i].icon, _pageObject.images, $("#"+_items[i].id));	
				var scale = (function(){

					if(_items[i].iconMaxSize / _items[i].image.height < _items[i].iconMaxSize / _items[i].image.width){
						return _items[i].iconMaxSize / _items[i].image.height;
					}else{
						return _items[i].iconMaxSize / _items[i].image.width;
					}
				})();
				_items[i].image.scaledwidth = _items[i].image.width*scale;
				TweenLite.set(_items[i].image.pic,{width:_items[i].image.scaledwidth, height:_items[i].image.height*scale, y:0 - (((_items[i].image.height*scale)-_items[i].height)/2)});
				xOfText = (_items[i].image.scaledwidth > xOfText) ? _items[i].image.scaledwidth : xOfText;	
			}
			
			$("#"+_items[i].id).append('<p>'+_items[i].text+'</p>');
			_items[i].obj = dr;
			_items[i].drag = $("#"+_items[i].id);
			
			
		}
	
		for(i=0,ii=_numberofitems;i<ii;i++){
			
			if(_items[i].icon){
				TweenLite.set(_items[i].image.pic,{x:(xOfText / 2) - (_items[i].image.scaledwidth / 2)});	
			}
		
			TweenLite.set($("#"+_items[i].id+" p"),{position:"absolute", paddingRight:5, left:xOfText+5});
			var e = Helpers.verticalAlignText($("#"+_items[i].id+" p"), $("#"+_items[i].id));
			TweenLite.set($("#"+_items[i].id+" p"),{top:e});
			var a = TweenLite.to($("#"+_items[i].id), 0.3,{ x: _items[i].x, opacity:1, delay: i*0.05});
			_pageObject.addToReset(a);
		}
	}
	function placeCheckAnswerButton(){
		_checkButton.button = new Helpers.Button(_checkButton.text);
		_checkButton.button.setHeight(_checkButton.height);
		_checkButton.button.setWidth(_checkButton.width);
		_checkButton.button.setButtonColour(_checkButton.colour);
		
		_checkButton.button.setRollOverColour(_checkButton.roColour);
		_checkButton.id=_prefix+"-checkanswer";
		_checkButton.button.setId(_checkButton.id);		
		_checkButton.button.drawButton(_holder);	
		TweenLite.set($("#"+_checkButton.id),{ left: _checkButton.x, top: _checkButton.y});	
		$("#"+_checkButton.id).on('click', function(){
			for(var i=0;i<_numberofitems;i++){
				_droppables[i].disable();
				if(_targets[i].draggerOnTarget === _targets[i].correctOnTarget){
					_targets[i].correct=true;
					//_targets[i].draggerOnTarget.obj.setState("over");	
				}else{
					_targets[i].correct=false;	
					_targets[i].draggerOnTarget.obj.setState("selected");
				}
				_targets[i].draggerOnTarget.obj.removeInteraction();
			}
			
			if(checkCorrect()){
				showFb(_correctFb, true);	
			}else{
				showFb(_incorrectFb, false);
			}
			_checkButton.button.removeFromStage();
		});
	}
	function checkCorrect(){
		for(var i=0;i<_numberofitems;i++){
			if(!_targets[i].correct){
				return false;	
			}
		}
		return true;	
	}
	function setDraggers(){
		$(_items).each(function(){
			var that = this;
			var element = $(this.drag);
			var wrapper = element.parent();
			var offset = element.position();
			var scope = {
				element: element,
				wrapper:wrapper,
				width: wrapper.outerWidth(),
				dropped: false,
				moved: false,
				dragger: that,
				get y() { return element; }
			};

			scope.draggable = createDraggable(scope);	
			_droppables.push(scope.draggable);
			element.on("mousedown touchstart", scope, activateDragger);			
		});		
		
	}
	
	function createDraggable(dr) {
		 var wrapper = dr.wrapper;
		 var clone= dr.element; 
		var SX, SY, value = Global.model.zoom;
		dr.draggable = new Draggable(clone, {
			type:"y", 
			onDrag    : checkYs,
			onRelease : dropTile,
			//bounds: _holder,
			onPress:function(){
				SX = this.x;
				SY = this.y;
				value = Global.model.zoom;
			},
		  });	
		  return dr.draggable;  
		  
		  function checkYs(){
			  if(!createjs.BrowserDetect.isFirefox){
					var ratio = (1/value)-1;
					TweenMax.set(this.target,{ x:"+="+(this.x-SX)*ratio , y:"+="+(this.y-SY)*ratio });
				}
				if(_targets[targetIndex - 1] && dr.draggable.y < _targets[targetIndex - 1].y+ _targets[targetIndex - 1].height){
					var e = TweenLite.to(_targets[targetIndex - 1].draggerOnTarget.drag, 0.3, {y:_targets[targetIndex].y});	
					_pageObject.addToReset(e);
					_targets[targetIndex].draggerOnTarget = _targets[targetIndex - 1].draggerOnTarget;		
					_targets[targetIndex].draggerOnTarget.targetOn=	_targets[targetIndex];	
					_targets[targetIndex - 1].draggerOnTarget = dr.dragger;
					dr.dragger.targetOn = _targets[targetIndex - 1];
					findTargetIndex(dr);					
				}
				if(_targets[targetIndex + 1] && dr.draggable.y > _targets[targetIndex + 1].y){
					var f = TweenLite.to(_targets[targetIndex + 1].draggerOnTarget.drag, 0.3, {y:_targets[targetIndex].y});
					_pageObject.addToReset(f);
					_targets[targetIndex].draggerOnTarget = _targets[targetIndex + 1].draggerOnTarget;
					_targets[targetIndex].draggerOnTarget.targetOn=	_targets[targetIndex];	
					_targets[targetIndex + 1].draggerOnTarget = dr.dragger;
					dr.dragger.targetOn = _targets[targetIndex + 1];
					findTargetIndex(dr);
				}	
		  }
		  function dropTile(){
			 if(!_checked){
				  placeCheckAnswerButton();
				  _checked=true;
			 }
			 for(var i=0;i<_numberofitems;i++){
				var e = TweenLite.to(_targets[i].draggerOnTarget.drag, 0.3, {y:_targets[i].y});
				 _pageObject.addToReset(e);
			 }
		  }
	}
	function activateDragger(event){
		var dr = event.data;
		findTargetIndex(dr)
		dr.draggable.startDrag(event.originalEvent);
	}
	function showCorrectOrder(){
		for(var i=0;i<_numberofitems;i++){
			if(!_targets[i].correct){
				var e = TweenLite.to(_targets[i].correctOnTarget.drag, 0.5, {y:_targets[i].y});
				_pageObject.addToReset(e);
			}	
		}
		
	}
	function findTargetIndex(dr){
		$(_targets).each(function(index){
			if(dr.dragger.targetOn===this){
				targetIndex = index;
				return;
			}
		});
	}
	function showFb(fbObj, cor){
		closeFb();
		var popup;
		popup = new Helpers.popup();
		popup.setWidth(fbObj.width);
		popup.setHeight(fbObj.height);
		popup.setX(fbObj.x);
		popup.setY(fbObj.y);
		popup.setName("feedback-order");
		popup.setClosebtn(false);	
		popup.addToStage(_holder);	
		popup.addText(fbObj.text);	
			
		if(fbObj.sound){
			Global.soundController.playSound(fbObj.sound, _pageObject);
		}
		_popup=popup;
		if(!cor){
			var b = new Helpers.Button("Show answer");
			b.setWidth(200);
			var bId = _prefix+"-viewanswer";
			b.setId(bId);
			var by = fbObj.height - 50;
			var bx = fbObj.width - 220	
			b.drawButton("#feedback-order");

			TweenLite.set($("#"+bId),{ left: bx, top: by});
			$("#"+bId).on('click', function(){ 
			 	var t = new TweenMax.delayedCall(0.5, showCorrectOrder);
				_pageObject.addToReset(t);
				var e = new TweenMax.delayedCall(2, returnColours);
				_pageObject.addToReset(e);
				if(fbObj.hideOnReorder){popup.removeFromStage()}else{b.setState("inactive");};
				
				_base.setToComplete();
			});
		}else{
			_base.setToComplete();	
		}
	}
	function returnColours(){
		for(var i=0;i<_numberofitems;i++){
			_items[i].obj.setState("active");
			_items[i].obj.removeInteraction();
		}
	}
	function closeFb(){		  			
		if(_popup){_popup.removeFromStage();}else{
			Global.soundController.stopSound();
		}
	}
	function compare(a, b){
		if(a.currentY < b.currentY){
			return -1;	
		}
		if(a.currentY > b.currentY){
			return 1;	
		}
		return 0;
	}
};;// JavaScript Document
Activities.QuestionSeriesWithResponse = function(){	
	"use strict";
	var _base; 
	var _pageObject;
	var _holder;
	var _prefix;
	var _questions = [];
	var _numberofquestions;
	var _options;
	var _questionOn=0;
	var tl;
	
	this.buildActivity = function(pageObject, holder){
		_base = new Activities.base();
		_pageObject = pageObject;
		_holder = holder;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		tl = new TimelineLite();
		_pageObject.addToReset(tl);	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("QuestionSeries")[0];	
		_options = {
			delay: xmlcontent.getAttribute("delay"),
			transition: xmlcontent.getAttribute("transition"),
			x: Number(xmlcontent.getAttribute("x")),
			y: Number(xmlcontent.getAttribute("y"))
		}
		var questions = xmlcontent.getElementsByTagName("question");
		_numberofquestions = questions.length;
		for(var i=0;i<_numberofquestions;i++){
			var question={
				width: questions[i].getAttribute("width"),
				height: questions[i].getAttribute("height"),
				text: questions[i].getElementsByTagName("questiontext")[0].firstChild.nodeValue,
				sound: questions[i].getElementsByTagName("questiontext")[0].getAttribute("sound"),
				id: _prefix+"-panel-"+i,
			};
			var answers = questions[i].getElementsByTagName("answer");
			var answersObj = [];
			for(var a=0, aa=answers.length;a<aa;a++){
				var answer ={
					correct: (answers[a].getAttribute("correct")==="1")?true:false,	
					delay: Number(answers[a].getAttribute("delay")),
					width: Number(answers[a].getAttribute("width")),
					height: Number(answers[a].getAttribute("height")),
					colour: Helpers.convertColour(answers[a].getAttribute("colour")),
					fontColour: Helpers.convertColour(answers[a].getAttribute("fColour")),
					fontSize: Number(answers[a].getAttribute("fSize")),
					x: Number(answers[a].getAttribute("x")),
					y: Number(answers[a].getAttribute("y")),
					fontAlign: (answers[a].getAttribute("align"))?answers[a].getAttribute("align"):"left",
					text: answers[a].firstChild.nodeValue	
				};
				answersObj.push(answer);
			}
			question.answers = answersObj;
			var feedback = questions[i].getElementsByTagName("feedback")[0];	
			var fb ={
				width: Number(feedback.getAttribute("width")),
				height: Number(feedback.getAttribute("height")),
				x: Number(feedback.getAttribute("x")),
				y: Number(feedback.getAttribute("y")),
				correctText: feedback.getElementsByTagName("correctFeedback")[0].firstChild.nodeValue,
				correctSound: feedback.getElementsByTagName("correctFeedback")[0].getAttribute("sound"),
				incorrectText: feedback.getElementsByTagName("incorrectFeedback")[0].firstChild.nodeValue,
				incorrectSound: feedback.getElementsByTagName("incorrectFeedback")[0].getAttribute("sound"),
			};	
			question.feedback = fb;
			_questions.push(question);		
		}		
		var t = new TweenMax.delayedCall(_options.delay, placeQuestions);
		_pageObject.addToReset(t);	
	};
	function placeQuestions(){
		
		for(var i=0;i<_numberofquestions;i++){		
			$(_holder).prepend("<div id=\""+_questions[i].id+"\" class=\"question-panel\"><p>"+_questions[i].text+"</p><div id=\""+_questions[i].id+"-qup\" class=\"question-panel-answers\"></div></div>");
			TweenLite.set($("#"+_questions[i].id), {position:"absolute", top: _options.y, left: _options.x, width:_questions[i].width, height: _questions[i].height, opacity:0});
			TweenLite.set($("#"+_questions[i].id+" p"), {position:"absolute", top: -30, left: 10, width:_questions[i].width -20, opacity:0});
			TweenLite.set($("#"+_questions[i].id+" .question-panel-answers"), {position:"absolute", top: _questions[i].answers[0].y-3, height: _questions[i].height - _questions[i].answers[0].y, left: 0, width:"100%"});
			for(var a=0,aa=_questions[i].answers.length;a<aa;a++){
				_questions[i].answers[a].buttonid = _questions[i].id+"-qup-"+a+"-div"; 
				$("#"+_questions[i].id+"-qup").append("<div id=\""+_questions[i].answers[a].buttonid+"\" class=\"question-panel-answers-div question-panel-answers-div-"+i+"\"><p id=\""+_questions[i].id+"-qup-"+a+"\" class=\"question-panel-answers-a\">"+_questions[i].answers[a].text+"</p></div>");

				TweenLite.set($("#"+_questions[i].answers[a].buttonid), {height:(_questions[i].height - _questions[i].answers[0].y) / aa, textAlign:"center", x: -_questions[i].width-10});
				var py = Helpers.verticalAlignText($("#"+_questions[i].id+"-qup-"+a), $("#"+_questions[i].id+"-qup-"+a+"-div"));
				TweenLite.set($("#"+_questions[i].id+"-qup-"+a), {y:py, fontSize:_questions[i].answers[a].fontSize});
				
				
				
			}
		}
		revealQu()
		activateQuestions(true);
	}
	function revealQu(){
		tl.to($("#"+_questions[_questionOn].id), 0.3,{ opacity:1});
		tl.to($("#"+_questions[_questionOn].id+" p"), 0.2,{ top:10, opacity:1 }, "+=0.3");
		tl.to($("#"+_questions[_questionOn].answers[0].buttonid), 0.3,{ x:0 }, "+=0.3");
		for(var i=1,ii=_questions[_questionOn].answers.length;i<ii;i++){
			tl.to($("#"+_questions[_questionOn].answers[i].buttonid), 0.3,{ x:0 }, "-=0.1");
		}
		if(_questions[_questionOn].sound!=undefined){
			Global.soundController.playSound(_questions[_questionOn].sound, _pageObject);
		}
	}
	function removeQu(){
		tl.to($("#"+_questions[_questionOn].id), 0.2,{ left:0, autoAlpha:0});
		tl.to($("#"+_prefix+"-panel-next-"+_questionOn), 0.2,{ top:600, autoAlpha:0});
		tl.to($("#"+_prefix+"-popup-"+_questionOn), 0.2,{ x:+50, autoAlpha:0}, "-=0.1");
		
	}
	function activateQuestions(on){
		var ii = _questions[_questionOn].answers.length;
		var btn;
		switch(on){
			case true:
				for(var i=0;i<ii;i++){
					btn = $("#"+_questions[_questionOn].answers[i].buttonid);	
					TweenLite.set(btn, {cursor:"pointer"});
					btn.on("click", {pressed:i}, selectAnswer);
					_pageObject.addToResetEventListeners(btn);	
				}	
			break;	
			case false:
				for(var i=0;i<ii;i++){
					btn = $("#"+_questions[_questionOn].answers[i].buttonid);	
					TweenLite.set(btn, {cursor:"default"});
					btn.off();
				}
			break; 
		}
	}
	
	function selectAnswer(e){
		activateQuestions(false);
		var selected = e.data.pressed;
		if(_questions[_questionOn].answers[selected].correct){
			showFeedback(true);
				
			$(".question-panel-answers-div-"+_questionOn).off();
		}else{
			showFeedback(false);
			$("#"+_questions[_questionOn].answers[selected].buttonid).addClass("question-panel-answer-incorrect");	
		}
	}
	function showFeedback(correct){
		
		var popup = new Helpers.popup();
		popup.setWidth(_questions[_questionOn].feedback.width);
		popup.setHeight(_questions[_questionOn].feedback.height);
		popup.setName(_prefix+"-popup-"+_questionOn);
		popup.setClosebtn(false);
		popup.setX(_questions[_questionOn].feedback.x);
		popup.setY(_questions[_questionOn].feedback.y);
		popup.addToStage(_holder);	
		var text = (correct)?_questions[_questionOn].feedback.correctText:_questions[_questionOn].feedback.incorrectText;
		var sound = (correct)?_questions[_questionOn].feedback.correctSound:_questions[_questionOn].feedback.incorrectSound;
		$("#"+popup.name).prepend("<p class=\"p10\">"+text+"</p>");
		if(sound != null || sound != undefined){
			popup.includeSound(true);
			Global.soundController.playSound(sound, _pageObject);
		}
		for(var i=0,ii=_questions[_questionOn].answers.length;i<ii;i++){
			var btn = $("#"+_questions[_questionOn].answers[i].buttonid);
			if(_questions[_questionOn].answers[i].correct){
				btn.addClass("question-panel-answer-correct");		
			}
		}
		addNextBtn();
	}
	function addNextBtn(){
		if(_questionOn<(_numberofquestions - 1)){
			var continueBtn = new Helpers.Button("Next Question");				
			continueBtn.setId(_prefix+"-panel-next-"+_questionOn);
			continueBtn.setWidth(100);
			continueBtn.drawButton(_holder);
			
			TweenLite.set($("#"+_prefix+"-panel-next-"+_questionOn),{ left: _questions[_questionOn].feedback.x+_questions[_questionOn].feedback.width - 110, top:_questions[_questionOn].feedback.y+_questions[_questionOn].feedback.height +20});
			$("#"+_prefix+"-panel-next-"+_questionOn).on("click",function(){
				$("#"+_prefix+"-panel-next-"+_questionOn).off();
				removeQu();
				_questionOn++;
				revealQu();
				activateQuestions(true);
			});
		}else{
			_base.setToComplete();	
		}
	}
};;// JavaScript Document
Activities.ScenarioSeriesWithSelectionBtns = function(){
	"use strict";
	var _base; 
	var _pageObject;
	var _holder;
	var _prefix;
	var _questions = [];
	var _numberofquestions;
	var _options;
	var _questionOn=0;
	var tl;
	
	this.buildActivity = function(pageObject, holder){
		_base = new Activities.base();
		_pageObject = pageObject;
		_holder = holder;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		tl = new TimelineLite();
		_pageObject.addToReset(tl);	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("questionSeries")[0];	
		_options = {
			delay: xmlcontent.getAttribute("delay"),
			x: Number(xmlcontent.getAttribute("x")),
			y: Number(xmlcontent.getAttribute("y"))
		}
		var questions = xmlcontent.getElementsByTagName("question");
		_numberofquestions = questions.length;
		for(var i=0;i<_numberofquestions;i++){
			var question={
				width: questions[i].getAttribute("width"),
				height: questions[i].getAttribute("height"),
				text: questions[i].getElementsByTagName("questiontext")[0].firstChild.nodeValue,
				sound: questions[i].getElementsByTagName("questiontext")[0].getAttribute("sound"),
				image: (questions[i].getElementsByTagName("questionImage")[0])?questions[i].getElementsByTagName("questionImage")[0].firstChild.nodeValue:undefined,
				imagex: (questions[i].getElementsByTagName("questionImage")[0])?questions[i].getElementsByTagName("questionImage")[0].getAttribute("x"):undefined,
				imagey: (questions[i].getElementsByTagName("questionImage")[0])?questions[i].getElementsByTagName("questionImage")[0].getAttribute("y"):undefined,
				effect: (questions[i].getElementsByTagName("questionImage")[0] && questions[i].getElementsByTagName("questionImage")[0].getAttribute("applyEffect")==="yes")?true:false,
				id: _prefix+"-panel-"+i,
				answerPanelX: Number(questions[i].getAttribute("answerPanelX"))+_options.x,
				answerPanelColour: Helpers.convertColour(questions[i].getAttribute("answerPanelColour")),
				answerPanelHeight: Number(questions[i].getAttribute("answerPanelHeight")),
				answerPanelWidth: Number(questions[i].getAttribute("answerPanelWidth")),
			};
			var answers = questions[i].getElementsByTagName("answer");
			var answersObj = [];
			for(var a=0, aa=answers.length;a<aa;a++){
				var answer ={
					correct: (answers[a].getAttribute("correct")==="1")?true:false,	
					delay: Number(answers[a].getAttribute("delay")),
					width: Number(answers[a].getAttribute("width")),
					height: Number(answers[a].getAttribute("height")),
					colour: Helpers.convertColour(answers[a].getAttribute("colour")),
					fontColour: Helpers.convertColour(answers[a].getAttribute("fontColour")),
					selectedColour: Helpers.convertColour(answers[a].getAttribute("selColour")),
					fontSize: Number(answers[a].getAttribute("fontSize")),
					x: Number(answers[a].getAttribute("x")),
					y: Number(answers[a].getAttribute("y")),
					fontAlign: (answers[a].getAttribute("align"))?answers[a].getAttribute("align"):"left",
					text: answers[a].firstChild.nodeValue,
					selected:false	
				};
				answersObj.push(answer);

			}
			question.answers = answersObj;
			var feedback = questions[i].getElementsByTagName("feedback")[0];	
			var fb ={
				width: Number(feedback.getAttribute("width")),
				height: Number(feedback.getAttribute("height")),
				x: Number(feedback.getAttribute("x")),
				y: Number(feedback.getAttribute("y")),
				correctText: feedback.getElementsByTagName("correctFeedback")[0].firstChild.nodeValue,
				correctSound: feedback.getElementsByTagName("correctFeedback")[0].getAttribute("sound"),
				incorrectText: feedback.getElementsByTagName("incorrectFeedback")[0].firstChild.nodeValue,
				incorrectSound: feedback.getElementsByTagName("incorrectFeedback")[0].getAttribute("sound"),
			};	
			question.feedback = fb;
			var caXml = questions[i].getElementsByTagName("checkBtn")[0];
			var continueBtn = new Helpers.Button(caXml.firstChild.nodeValue);				
			continueBtn.setId(_prefix+"-panel-check-"+i);
			continueBtn.setWidth(Number(caXml.getAttribute('width')));
			continueBtn.setHeight(Number(caXml.getAttribute('height')));
			continueBtn.setButtonColour(Helpers.convertColour(caXml.getAttribute('colour')));
			continueBtn.setRollOverColour(Helpers.convertColour(caXml.getAttribute('roColour')));
			continueBtn.setFontColour(Helpers.convertColour(caXml.getAttribute('fontColour')));
			continueBtn.setFontSize(Number(caXml.getAttribute('fontSize')));
			question.continueBtn = {
				x:(Number(caXml.getAttribute('x'))+_options.x),
				btn:continueBtn,
				id:_prefix+"-panel-check-"+i
			};
			_questions.push(question);	
		}
		
		var t = new TweenMax.delayedCall(_options.delay, showQuestion);
		_pageObject.addToReset(t);	
		//_pageObject.addToReset(t);	
	};
	function placeQuestion(){
		
			$(_holder).prepend("<div id=\""+_questions[_questionOn].id+"\" class=\"question-panel\"><p>"+_questions[_questionOn].text+"</p><div id=\""+_questions[_questionOn].id+"-qimage\" class=\"question-panel-answers\"></div></div>");
			TweenLite.set($("#"+_questions[_questionOn].id), {position:"absolute", top: _options.y, left: _options.x, width:_questions[_questionOn].width, height: _questions[_questionOn].height, opacity:0});
			TweenLite.set($("#"+_questions[_questionOn].id+" p"), {position:"absolute", top: -30, left: 10, width:_questions[_questionOn].width -20, opacity:0});
			TweenLite.set($("#"+_questions[_questionOn].id+" .question-panel-answers"), {position:"absolute", top: _questions[_questionOn].answers[0].y-3, height: _questions[_questionOn].height - _questions[_questionOn].answers[0].y, left: 0, width:"100%"});

			if(_questions[_questionOn].image){
				_questions[_questionOn].imageObj = Helpers.addImage(_questions[_questionOn].image, _pageObject.images, $("#"+_questions[_questionOn].id));	
				TweenLite.set($(_questions[_questionOn].imageObj.pic), {x: _questions[_questionOn].imagex,y: _questions[_questionOn].imagey})
				if(_questions[_questionOn].effect){
					$(_questions[_questionOn].imageObj.pic).addClass("apply-effect");
				}
			}
			
		
		//activateQuestions(true);
	}

	function placeAnswers(){
			
			$(_holder).prepend("<div id=\""+_questions[_questionOn].id+"-answers\" class=\"question-panel\"><div id=\""+_questions[_questionOn].id+"-qup\" class=\"question-panel-answers\"></div></div>");
			TweenLite.set($("#"+_questions[_questionOn].id+"-answers"), {position:"absolute", top: _options.y, left: _questions[_questionOn].answerPanelX, width:_questions[_questionOn].answerPanelWidth, height: _questions[_questionOn].answerPanelHeight, opacity:0});
			
			for(var a=0,aa=_questions[_questionOn].answers.length;a<aa;a++){
				_questions[_questionOn].answers[a].buttonid = _questions[_questionOn].id+"-qup-"+a+"-div"; 
				$("#"+_questions[_questionOn].id+"-qup").append("<div id=\""+_questions[_questionOn].answers[a].buttonid+"\" class=\"question-panel-answers-div question-panel-answers-div-"+_questionOn+"\"><p id=\""+_questions[_questionOn].id+"-qup-"+a+"\" class=\"question-panel-answers-a\">"+_questions[_questionOn].answers[a].text+"</p></div>");	
				
				TweenLite.set($("#"+_questions[_questionOn].answers[a].buttonid), {height:(_questions[_questionOn].answerPanelHeight) / aa, textAlign:"center", x: _questions[_questionOn].answerPanelWidth+20, cursor:"pointer"});
				var py = Helpers.verticalAlignText($("#"+_questions[_questionOn].id+"-qup-"+a), $("#"+_questions[_questionOn].id+"-qup-"+a+"-div"));
				TweenLite.set($("#"+_questions[_questionOn].id+"-qup-"+a), {y:py, fontSize:_questions[_questionOn].answers[a].fontSize});			
		}
	}
	function revealQuestion(){
		tl.to($("#"+_questions[_questionOn].id), 0.3,{ opacity:1});
		tl.to($("#"+_questions[_questionOn].id+" p"), 0.2,{ top:10, opacity:1 }, "+=0.3");
		if(_questions[_questionOn].sound!=undefined){
			Global.soundController.playSound(_questions[_questionOn].sound, _pageObject);
		}	
		_questions[_questionOn].continueBtn.btn.drawButton(_holder);
		_questions[_questionOn].continueBtn.btn.setState('inactive');
		TweenLite.set($("#"+_questions[_questionOn].continueBtn.id), {position:"absolute", left: _questions[_questionOn].continueBtn.x, top:_options.y + _questions[_questionOn].answerPanelHeight + 20  });
		
		//tl.to($("#"+_questions[_questionOn].answers[0].buttonid), 0.3,{ x:0 }, "+=0.3");
	}
	function revealAnswers(){
		tl.to($("#"+_questions[_questionOn].id+"-answers"), 0.3,{ opacity:1 });	
		for(var i=0,ii=_questions[_questionOn].answers.length;i<ii;i++){	
			tl.to($("#"+_questions[_questionOn].answers[i].buttonid), 0.3,{ x:0 }, "-=0.1");	
			$("#"+_questions[_questionOn].answers[i].buttonid).on("click", {pressed: _questions[_questionOn].answers[i]}, selectAnswer);
		}		
	}
	function selectAnswer(e){
		var selected = e.data.pressed;
		if(selected.selected){
			$("#"+selected.buttonid).removeClass("selected");
			selected.selected=false;
		}else{
			$("#"+selected.buttonid).addClass("selected");
			selected.selected=true;
		}
		activateCheck();
	}
	
	function showFeedback(){
		var correct = correctSelections();
		var fb;
		var sound;
		if(correct){
			fb = _questions[_questionOn].feedback.correctText;
			sound = _questions[_questionOn].feedback.correctSound;
		}else{
			fb = _questions[_questionOn].feedback.incorrectText;
			sound = _questions[_questionOn].feedback.incorrectSound;
		}
		if(sound){
			Global.soundController.playSound(sound, _pageObject);
		}
		$(_holder).prepend("<div id=\""+_questions[_questionOn].id+"-feedback\" class=\"question-series-feedback-panel\"><p>"+fb+"</p></div>");
		TweenLite.set($("#"+_questions[_questionOn].id+"-feedback"), {width:_questions[_questionOn].feedback.width, height:_questions[_questionOn].feedback.height, x:_options.x+100, y:_options.y+10});
		TweenLite.set($("#"+_questions[_questionOn].id+"-feedback p"), {width:_questions[_questionOn].feedback.width - 40, x:20, y:30, opacity:0});	
		tl.to($("#"+_questions[_questionOn].id+"-feedback"), 0.2, {x:Number(_questions[_questionOn].width)+Number(_options.x-10)});	
		tl.to($("#"+_questions[_questionOn].id+"-feedback p"),0.3, {opacity:1});
		for(var i=0,ii=_questions[_questionOn].answers.length;i<ii;i++){
			$("#"+_questions[_questionOn].answers[i].buttonid).off();
		}
		
		$("#"+_questions[_questionOn].continueBtn.id).off();
		if(_questionOn<_numberofquestions-1){
			_questions[_questionOn].continueBtn.btn.setText("Next Question");
			_questions[_questionOn].continueBtn.btn.setState("active");
			$("#"+_questions[_questionOn].continueBtn.id).on("click", moveOn);
		}else{
			_questions[_questionOn].continueBtn.btn.removeFromStage();
			_base.setToComplete();	
		}
		
	}
	function activateCheck(){
		$("#"+_questions[_questionOn].continueBtn.id).off();
		var no=0
		for(var i=0,ii=_questions[_questionOn].answers.length;i<ii;i++){
			if(_questions[_questionOn].answers[i].selected){
				no++;
			
				break;
			}
		}
		if(no>0){
			_questions[_questionOn].continueBtn.btn.setState("active");
			$("#"+_questions[_questionOn].continueBtn.id).on("click", showFeedback);
		}else{
			_questions[_questionOn].continueBtn.btn.setState("inactive");
			$("#"+_questions[_questionOn].continueBtn.id).off();
		}
		
	}
	function correctSelections(){
		var correct = true;
		for(var i=0,ii=_questions[_questionOn].answers.length;i<ii;i++){
			
			if(_questions[_questionOn].answers[i].correct){
				$("#"+_questions[_questionOn].answers[i].buttonid).addClass("question-panel-answer-correct");	
			}else{
				$("#"+_questions[_questionOn].answers[i].buttonid).addClass("question-panel-answer-incorrect");	
			}
			if(_questions[_questionOn].answers[i].correct !== _questions[_questionOn].answers[i].selected){
				correct = false;	
			}
		}
		return correct;
	}
	function moveOn(){	
		_questions[_questionOn].continueBtn.btn.removeFromStage();
		tl.to($("#"+_questions[_questionOn].id+"-feedback"), 0.2,{ x:_options.x, autoAlpha:0});
		tl.to($("#"+_questions[_questionOn].id+"-answers"), 0.2,{ x:+20, autoAlpha:0}, 0);
		tl.to($("#"+_questions[_questionOn].id), 0.3,{ left:0, autoAlpha:0});
		tl.to($("#"+_prefix+"-panel-next-"+_questionOn), 0.3,{ y:+50, autoAlpha:0});
		tl.to($("#"+_prefix+"-popup-"+_questionOn), 0.3,{ x:+20, autoAlpha:0, onComplete:showQuestion}, "-=0.1");
		_questionOn++;
		
	}
	function showQuestion(){
		placeQuestion();
		placeAnswers();
		revealQuestion();
		revealAnswers();	
	}
};;// JavaScript Document
Activities.DefinitionMatcher= function(){	
	var _base; 
	var _pageNumber;
	var _pageObject;
	var tl;
	var _terms=[];
	var _defs=[];
	var _holder;
	var _options;
	var _checkButton;
	var _prefix;
	var _numberofitems;
	var _termObjectSelected;
	var _cfeedback;
	var _icfeedback;
	var _orderedShuffled=[];
	var tl;
		
	this.buildActivity = function(pageObject, holder){
		CSSPlugin.defaultTransformPerspective=500;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		_base = new Activities.base();
		_holder = holder;	
		_pageObject = pageObject;
		tl = new TimelineLite();
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("matcherOptions")[0];
		_options = {
			
			delayreveal: Number((xmlcontent).getAttribute("delay")),
			delayactivation: Number((xmlcontent).getAttribute("delayactivation")),
			leftbuttonwidth: Number($(xmlcontent).children("leftbuttonwidth")[0].firstChild.nodeValue),
			rightbuttonwidth: Number($(xmlcontent).children("rightbuttonwidth")[0].firstChild.nodeValue),
			buttonheight: Number($(xmlcontent).children("buttonheight")[0].firstChild.nodeValue),
			leftColumnX: Number($(xmlcontent).children("leftColumnX")[0].firstChild.nodeValue),
			startingY: Number($(xmlcontent).children("startingY")[0].firstChild.nodeValue),
			paddingBetween: Number($(xmlcontent).children("paddingBetween")[0].firstChild.nodeValue),
			paddingBelow: Number($(xmlcontent).children("paddingBelow")[0].firstChild.nodeValue),
			termBgColour: $(xmlcontent).children("termBgColour")[0].firstChild.nodeValue,
			termRollColour: $(xmlcontent).children("termRollColour")[0].firstChild.nodeValue,
			termSelectColour: $(xmlcontent).children("termSelectColour")[0].firstChild.nodeValue,
			defBgColour: Helpers.convertColour($(xmlcontent).children("defBgColour")[0].firstChild.nodeValue),
			defRollColour: Helpers.convertColour($(xmlcontent).children("defRollColour")[0].firstChild.nodeValue),
			defSelectColour: Helpers.convertColour($(xmlcontent).children("defSelectColour")[0].firstChild.nodeValue),
		};
		_checkButton = {
			 width: Number($(xmlcontent).children("checkBtn")[0].getAttribute("width")),
			 height: Number($(xmlcontent).children("checkBtn")[0].getAttribute("height")),
			 bColour: Helpers.convertColour($(xmlcontent).children("checkBtn")[0].getAttribute("bColour")),
			 roColour: Helpers.convertColour($(xmlcontent).children("checkBtn")[0].getAttribute("roColour")),
			 fontColour: Helpers.convertColour($(xmlcontent).children("checkBtn")[0].getAttribute("fontColour")),
			 fontSize: $(xmlcontent).children("checkBtn")[0].getAttribute("fontSize"),
			 placed:false
		};
		_cfeedback = {
			width: Number($(xmlcontent).children("correctfeedback")[0].getAttribute("width")),
			height: Number($(xmlcontent).children("correctfeedback")[0].getAttribute("height")),
			sound: $(xmlcontent).children("correctfeedback")[0].getAttribute("sound"),
			fontColour: Helpers.convertColour($(xmlcontent).children("correctfeedback")[0].getAttribute("fontColour")),
			text: $(xmlcontent).children("correctfeedback")[0].firstChild.nodeValue
		};
		_icfeedback = {
			width: Number($(xmlcontent).children("incorrectfeedback")[0].getAttribute("width")),
			height: Number($(xmlcontent).children("incorrectfeedback")[0].getAttribute("height")),
			sound: $(xmlcontent).children("incorrectfeedback")[0].getAttribute("sound"),
			fontColour: Helpers.convertColour($(xmlcontent).children("incorrectfeedback")[0].getAttribute("fontColour")),
			text: $(xmlcontent).children("incorrectfeedback")[0].firstChild.nodeValue
		};
		var couples = $(xmlcontent).children("couple");
		_numberofitems = couples.length;

		for(var i=0;i<_numberofitems;i++){		
			_terms.push(
				{
					fontColour: Helpers.convertColour($(couples[i]).children("term")[0].getAttribute("fontColour")),	
					fontSize:  $(couples[i]).children("term")[0].getAttribute("fontSize"),
					text:  $(couples[i]).children("term")[0].firstChild.nodeValue,
					y: _options.startingY + (i * _options.buttonheight) + (i * _options.paddingBetween),
				}
			);
			_defs.push(
				{
					fontColour:  Helpers.convertColour($(couples[i]).children("definition")[0].getAttribute("fontColour")),	
					fontSize:  $(couples[i]).children("definition")[0].getAttribute("fontSize"),
					text:  $(couples[i]).children("definition")[0].firstChild.nodeValue,
					correctY: _options.startingY + (i * _options.buttonheight) + (i * _options.paddingBetween),
				}
			);
		}
		shuffleYs();
		placeCouples();
		
		var d1 = new TweenMax.delayedCall(_options.delayreveal, revealCouples);
		var d2 = new TweenMax.delayedCall(_options.delayactivation, activateTerms);
		//var d3 = new TweenMax.delayedCall(_options.delayactivation, placeCheckAnswerButton);
		_pageObject.addToReset(d1);
		_pageObject.addToReset(d2);
		//_pageObject.addToReset(d3);
	};
	function shuffleYs(){
		var ys = [];
		for(var i=0;i<_numberofitems;i++){	
			ys.push(_defs[i].correctY);
		}
    	Helpers.shuffleArray(ys);
		for(i=0;i<_numberofitems;i++){	
			_defs[i].currentY = ys[i];
		}			
	}
	function placeCheckAnswerButton(){
		_checkButton.button = new Helpers.Button("Check Answer");
		_checkButton.button.setHeight(_checkButton.height);
		_checkButton.button.setWidth(_checkButton.width);
		_checkButton.button.setFontColour(_checkButton.fontColour);
		_checkButton.button.setFontSize(_checkButton.fontSize);
		_checkButton.button.setButtonColour(_checkButton.bColour);
		_checkButton.button.setRollOverColour(_checkButton.roColour);
		
		var cbId = _prefix+"-checkanswer";
		_checkButton.id=cbId;
		_checkButton.button.setId(cbId);
		
		_checkButton.button.drawButton(_holder);
		//_checkButton.button.setState("inactive");
		_checkButton.y = _options.startingY - _checkButton.height - 10;
		_checkButton.x = _options.leftColumnX + _options.leftbuttonwidth + _options.rightbuttonwidth + _options.paddingBetween - _checkButton.width;		
		
		TweenLite.set($("#"+cbId),{ left: _checkButton.x, top: _checkButton.y});
		
	}
	function placeCouples(){	
		var rightX = _options.paddingBetween+_options.leftColumnX+_options.leftbuttonwidth;
		for(var i=0,ii=_numberofitems;i<ii;i++){
			var thisid = _prefix+"-term-"+i;
			_terms[i].id=thisid;
			var b = new Helpers.listBox();
			b.setId(thisid);
			b.setHeight(_options.buttonheight);
			b.setWidth(_options.leftbuttonwidth);
			b.setTextColour(_terms[i].fontColour);
			b.drawBox(_holder);
			_terms[i].button = b;
			$("#"+thisid).append("<a id=\""+_prefix+"-termtext-"+i+"\">"+_terms[i].text+"</a>");		
			TweenLite.set($("#"+thisid),{ left: _options.leftColumnX, top: _terms[i].y, opacity:0,  rotationX:90})
			$("#"+thisid).css({
				'font-size': _terms[i].fontSize +"px",
				'position': 'absolute',
				
			});
			
			$("#"+_prefix+"-termtext-"+i).css({
				'position': 'absolute',
				'left':'10px',
				'width': (_options.leftbuttonwidth - 20)+"px",
				'top': (_options.buttonheight/2) - ($("#"+_prefix+"-termtext-"+i).height() / 2) +"px"		
			});
			$("#"+_prefix+"-termtext-"+i).css({
				'top': (_options.buttonheight/2) - ($("#"+_prefix+"-termtext-"+i).height() / 2) +"px"		
			});
			var thatid = _prefix+"-def-"+i;
			var c = new Helpers.iconBox();
			c.setId(thatid);
			_defs[i].id=thatid;
			c.setHeight(_options.buttonheight);
			c.setWidth(_options.rightbuttonwidth);
			c.seticonColour(_options.defBgColour);
			c.iconOverColour(_options.defRollColour);
			c.iconSelectColour(_options.defSelectColour);
			c.drawIcon(_holder);
			_defs[i].button = c;			
			$("#"+thatid).append("<a id=\""+_prefix+"-deftext-"+i+"\">"+_defs[i].text+"</a>");
			TweenLite.set($("#"+thatid),{ left: rightX, top: _defs[i].currentY-2, opacity:0, rotationX:90});
			
			$("#"+thatid).css({
				'position': 'absolute',
				'display': 'block',
				'width': _options.rightbuttonwidth,
				'font-size': _defs[i].fontSize +"px",
				'color': _defs[i].fontColour,
				
			});
			$("#"+_prefix+"-deftext-"+i).css({
				'position': 'absolute',
				'display':'block',	
				'left':'10px',	
				'width': (_options.rightbuttonwidth - 20)+"px"
			});
			$("#"+_prefix+"-deftext-"+i).css({
				'top': (_options.buttonheight/2) - ($("#"+_prefix+"-deftext-"+i).height() / 2) +"px",
			});
		}
	}
	function revealCouples(){

		var tl2 = new TimelineLite();	
		_pageObject.addToReset(tl2);
		for(var i=0,ii=_numberofitems;i<ii;i++){
			tl2.to($("#"+_terms[i].id), 0.5,{ opacity:1, rotationX:0 },0);
			tl2.to($("#"+_defs[i].id), 0.5,{ opacity:1, rotationX:0 }, 0.4);
		}
	}
	function activateTerms(){
		for(var i=0;i<_numberofitems;i++){
			_terms[i].button.setState("active");
		}
		$(".listbox-outer").on('click', function(e){ 
			var idSelected = e.currentTarget.getAttribute("id");
			
			for(var i=0;i<_numberofitems;i++){
				_terms[i].button.setState("active");
				if(_terms[i].id === idSelected){
					_termObjectSelected=_terms[i];
					
				}			
			}
			_termObjectSelected.button.setState("over");
			activateDefs();
			
		});
		_pageObject.addToResetEventListeners($(".listbox-outer"));
	}
	function activateDefs(){
		var tl3=new TimelineLite();
		_pageObject.addToReset(tl3);
		for(var i=0;i<_numberofitems;i++){
			_defs[i].button.setState("active");
		}
		$(".iconbox-outer").on('click', function(e){ 
			var idSelected = e.currentTarget.getAttribute("id");
			var defToReplace;
			var defSelected;
			for(var i=0;i<_numberofitems;i++){
				
				if(_defs[i].id === idSelected){
					defSelected = _defs[i];
					_defs[i].button.setState("selected");
				}
						
				if(_defs[i].currentY === _termObjectSelected.y){
					defToReplace = _defs[i];
					defToReplace.button.setState("selected");
				}
				_defs[i].button.removeInteraction();
			}
			defToReplace.currentY = defSelected.currentY;
			defSelected.currentY = _termObjectSelected.y;
			tl3.append(new TweenLite.to($("#"+idSelected), 0.5, {top:_termObjectSelected.y-2}),0);
			tl3.append(new TweenLite.to($("#"+defToReplace.id), 0.5, {top:defToReplace.currentY-2}),"-=0.4");
			if(!_checkButton.placed){	
				placeCheckAnswerButton();		
				//_checkButton.button.setState("active");
				$("#"+_checkButton.id).on('click', function(){
					deActivateTerms();
					deActivateDefs();
					Feedback(checkCorrect());
					$("#"+_checkButton.id).off();
					_checkButton.button.setState("inactive");
				});	
				_pageObject.addToResetEventListeners($("#"+_checkButton.id));	
				_checkButton.placed=true;		
			}
			deActivateDefs();
		});
		_pageObject.addToResetEventListeners($(".iconbox-outer"));
	}
	function deActivateDefs(){
		for(var i=0;i<_numberofitems;i++){
			_defs[i].button.removeInteraction();	
		}
		$(".iconbox-outer").off();
	}
	function deActivateTerms(){
		for(var i=0;i<_numberofitems;i++){
			_terms[i].button.setState("active");	
		}
		$(".listbox-outer").off();
	}
	function checkCorrect(){
		var score = 0;
		for(var i=0;i<_numberofitems;i++){
			if(_defs[i].currentY === _defs[i].correctY){
				score++;	
				_defs[i].button.setState("correct");
			}else{
				_defs[i].button.setState("incorrect");
			}
			_defs[i].button.removeInteraction();
			_terms[i].button.removeInteraction();
		}
		
		return score === _numberofitems ? true : false;
		
	}
	function Feedback(done){
		if(done){
			var popup = new Helpers.popup();
			popup.setWidth(_cfeedback.width);
			popup.setHeight(_cfeedback.height);
			popup.setName(_prefix+"-popup-correct");
			popup.setClosebtn(true);
		
			popup.addToStage(_holder);	
			$("#"+popup.name).prepend("<p class=\"p10\">"+_cfeedback.text+"</p>");
			if(_cfeedback.sound != null || _cfeedback.sound != undefined){
				popup.includeSound(true);
				Global.soundController.playSound(_cfeedback.sound, _pageObject);
			}
			_base.setToComplete();
			for(var i=0;i<_numberofitems;i++){
				tl.append(new TweenLite.to($("#"+_defs[i].id+"-inner"), 0.5, {backgroundColor: _options.defBgColour}, 2));
			}
			
		}else{
			var popup = new Helpers.popup();
			popup.setWidth(_icfeedback.width);
			popup.setHeight(_icfeedback.height);
			popup.setName(_prefix+"-popup-incorrect");
			popup.setClosebtn(false);
		
			popup.addToStage(_holder);	
			$("#"+popup.name).append("<p class=\"p10\">"+_icfeedback.text+"</p>");
			if(_icfeedback.sound != null || _icfeedback.sound != undefined){
				popup.includeSound(true);
				Global.soundController.playSound(_icfeedback.sound, _pageObject);
			}
			
			
			var b = new Helpers.Button("View Correct Answer");
			b.setWidth(200);
			
			var bId = _prefix+"-viewanswer";
			b.setId(bId);
			b.drawButton("#"+popup.name);
			b.y = _options.startingY - _checkButton.height - 20;
			b.x = _options.leftbuttonwidth + _options.rightbuttonwidth + _options.paddingBetween;		
			
			var bx = _icfeedback.width - 220;
			var by = _icfeedback.height - 50;
			
			TweenLite.set($("#"+bId),{ left: bx, top: by});
			$("#"+bId).on('click', function(){ 
			
				
			 	for(var i=0;i<_numberofitems;i++){
					var tl = new TimelineLite();			
					tl.to($("#"+_defs[i].id), 0.5, {top:_defs[i].correctY-2});	
					tl.to($("#"+_defs[i].id+"-inner"), 0.5, {backgroundColor: _options.defBgColour}, "+=1");
				}
				popup.removeFromStage();
				_base.setToComplete();
			});
			_pageObject.addToResetEventListeners($("#"+bId));
			
		}
	}
};;// JavaScript Document
Activities.RadioButtons = function(){	
	var _base; 
	var _pageObject;
	var _groups=[];
	var _holder;
	var _options;
	var _numberofitems;
	var _prefix;
	var _checkButton;
	var _cFeedback;
	var _icoFeedback;
	var _popup;
		
	this.buildActivity = function(pageObject, holder){
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		_base = new Activities.base();
		_holder = holder;	
		_pageObject = pageObject;
	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("radiobuttonoptions")[0];
		_options = {
			showFb: xmlcontent.getAttribute("showFb"),
			delayReveal: Number(xmlcontent.getAttribute("revealdelay"))
		};
		var grXml= xmlcontent.getElementsByTagName("radioGroup");
		_numberofitems = grXml.length;
		for(var i=0;i<_numberofitems;i++){
			var group = {
				radio : [],
			};
			var radxml = grXml[i].getElementsByTagName("radio");
			for(var a=0,aa=radxml.length;a<aa;a++){
				var rad = {
					correct: (radxml[a].getAttribute("correct")==1)?true:false,
					x:Number(radxml[a].getAttribute("x")),
					y:Number(radxml[a].getAttribute("y")),
					width:Number(radxml[a].getAttribute("width")),
					id: "qu-"+i+"-an-"+a
				};
				group.radio[a] = rad;	
			}
			_groups.push(group);
			_groups[i].horizontal=true;
			for(a=1,aa=radxml.length;a<aa;a++){		
				if(_groups[i].radio[a].y!==_groups[i].radio[a-1].y){
					_groups[i].horizontal = false;
					break;
				}
			}
			var groupcfbxml = (grXml[i].getElementsByTagName("groupfbcorrect"))?grXml[i].getElementsByTagName("groupfbcorrect")[0]:undefined;
			if(groupcfbxml){
				var cfb = {
					x:Number(groupcfbxml.getAttribute("x")),
					y:Number(groupcfbxml.getAttribute("y")),
					width:Number(groupcfbxml.getAttribute("width")),
					height:Number(groupcfbxml.getAttribute("height")),
					sound:groupcfbxml.getAttribute("sound"),
					text:groupcfbxml.firstChild.nodeValue
				};
				group.cfb = cfb;
			}
			var groupicfbxml = (grXml[i].getElementsByTagName("groupfbincorrect"))?grXml[i].getElementsByTagName("groupfbincorrect")[0]:undefined;
			if(groupicfbxml){
				var icfb = {
					x:Number(groupicfbxml.getAttribute("x")),
					y:Number(groupicfbxml.getAttribute("y")),
					width:Number(groupicfbxml.getAttribute("width")),
					height:Number(groupicfbxml.getAttribute("height")),
					sound:groupicfbxml.getAttribute("sound"),
					text:groupicfbxml.firstChild.nodeValue
				};
				group.icfb = icfb;
			}
			
		}
		var grcfbXml= (xmlcontent.getElementsByTagName("feedbackcorrect"))?xmlcontent.getElementsByTagName("feedbackcorrect")[0]:undefined;
		if(grcfbXml){
			_cFeedback ={
				x:Number(grcfbXml.getAttribute("x")),
				y:Number(grcfbXml.getAttribute("y")),
				width:Number(grcfbXml.getAttribute("width")),
				height:Number(grcfbXml.getAttribute("height")),
				sound:grcfbXml.getAttribute("sound"),
				text:grcfbXml.firstChild.nodeValue
			};
		}
		var gricfbXml= (xmlcontent.getElementsByTagName("feedbackincorrect"))?xmlcontent.getElementsByTagName("feedbackincorrect")[0]:undefined;
		if(gricfbXml){
				_icoFeedback ={
				x:Number(gricfbXml.getAttribute("x")),
				y:Number(gricfbXml.getAttribute("y")),
				width:Number(gricfbXml.getAttribute("width")),
				height:Number(gricfbXml.getAttribute("height")),
				sound:gricfbXml.getAttribute("sound"),
				text:gricfbXml.firstChild.nodeValue
			};
		}
		var t = new TweenMax.delayedCall(_options.delayReveal, placeRadios);
		_pageObject.addToReset(t);	
	};
	function placeRadios(){
		for(var i=0;i<_numberofitems;i++){
			$(_holder).append("<div id=\"form-"+i+"\"></div>");
			for(var a=0,aa=_groups[i].radio.length;a<aa;a++){
				$("#form-"+i).append("<label for=\"qu-"+i+"-an-"+a+"\" class=\"removable\" id=\"qu-"+i+"-an-"+a+"-lab\"><input type=\"radio\" name=\"qu-"+i+"\" value=\"\" id=\""+_groups[i].radio[a].id+"\"><span></span></label>");	
				_groups[i].radio[a].id="qu-"+i+"-an-"+a;
				TweenLite.set($("#qu-"+i+"-an-"+a+"-lab"), {position:"absolute", left: _groups[i].radio[a].x, top: _groups[i].radio[a].y});	
			}
		}
		TweenMax.staggerFrom($('.removable'), 0.5, {opacity:0, y:"-=20"}, 0.05);
		switch(_options.showFb){
			case "select":
				$('input:radio').change(showFb);    
			break;
		}	  
	}
	function showFb(e){
		if(checkComplete()){
			var correct = 0;
			for(var i=0;i<_numberofitems;i++){
				if(_groups[i].correct){
					correct++;
				}
			}
			if(correct===_numberofitems){
				if(_cFeedback){
					showFeedback(true);
				}
				
			}else{
				if(_icoFeedback){
					showFeedback(false);
				}
			}
			_base.setToComplete();	
		}
		var name = e.target.getAttribute('name');
		var group = Number(name.substr(name.indexOf("-") + 1));
		if(_groups[group].correct && _groups[group].cfb){
			popupBox(_groups[group].cfb);
		}else if((!_groups[group].correct) && _groups[group].icfb){
		
			popupBox(_groups[group].icfb);
		}
	}
	function checkComplete(){
		var done=true;
		for(var i=0;i<_numberofitems;i++){
			if(!$("#form-"+i+" input[name='qu-"+i+"']").is(":checked")){
				_groups[i].done=false;
				done = false;
			}else{
				if(!_groups[i].done){
					for(var a=0,aa=_groups[i].radio.length;a<aa;a++){
						if($("input[name='qu-"+i+"']:checked", "#form-"+i).attr("id")==_groups[i].radio[a].id){
							_groups[i].radio[a].selected=true;
							if(_groups[i].radio[a].correct){
								_groups[i].correct=true;	
							}else{
								_groups[i].correct=false;
							}
							$("#"+_groups[i].radio[a].id).prop( "disabled", true );
						}else{
							_groups[i].radio[a].selected=false;
							$("#"+_groups[i].radio[a].id).prop( "disabled", true );
						}
					}
					if(_groups[i].horizontal){		
						$(_holder).append("<div id='td-"+i+"' class='bgs25'></div>");
						if(_groups[i].correct){
							$("#td-"+i).addClass("tickdiv");
						}else{
							$("#td-"+i).addClass("crossdiv");
						}
						TweenLite.set($("#td-"+i),{left:_groups[i].radio[_groups[i].radio.length-1].x + 30, top:_groups[i].radio[0].y-8} );
					}
				}	
				_groups[i].done=true;
			}
		}
		return done;	
	}
	function showFeedback(pass){
		var content = (pass)?_cFeedback:_icoFeedback
		popupBox(content);
	}
	function popupBox(o){
	
		closeFb();
		var popup = new Helpers.popup();
		popup.setWidth(o.width);
		popup.setHeight(o.height);
		popup.setName(_prefix+"-popup-feedback");
		popup.setClosebtn(true);
		popup.setX(o.x);
		popup.setY(o.y);
		popup.addToStage(_holder);	
		var text = o.text;
		var sound = o.sound;
		$("#"+popup.name).prepend("<p class=\"p10\">"+text+"</p>");
		if(sound != null || sound != undefined){
			popup.includeSound(true);
			Global.soundController.playSound(sound, _pageObject);
		}	
		_popup=popup;
		o.feedbackSeen=true;
	}
	function closeFb(){		  			
		if(_popup){_popup.removeFromStage();}else{
			Global.soundController.stopSound();
		}
	}
};;// JavaScript Document
Activities.SelectItems = function(){	
	var _base; 
	var _pageObject;
	var _clickers=[];
	var _holder;
	var _options;
	var _numberofitems;
	var _prefix;
	var _firstSelection = true;
	var _checkButton;
	var _cFeedback;
	var _icoFeedback;
	var _showingYourAnswers=false;
	var tl;
	var tap;
		
	this.buildActivity = function(pageObject, holder){
		CSSPlugin.defaultTransformPerspective=500;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		_base = new Activities.base();
		_holder = holder;	
		_pageObject = pageObject;
		tl = new TimelineLite();
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("selectItemsOptions")[0];
		_options = {
			delayActivation: Number($(xmlcontent).children("delayActivation")[0].firstChild.nodeValue),
			delayReveal: Number($(xmlcontent).children("delayReveal")[0].firstChild.nodeValue),
			shiftLeft: (xmlcontent.getElementsByTagName("shiftLeft")[0])?Number(xmlcontent.getElementsByTagName("shiftLeft")[0].firstChild.nodeValue):0
		};
		
		var clickers = $(xmlcontent).children("clickitem");
		_numberofitems = clickers.length;
		for(var i=0,ii=_numberofitems;i<ii;i++){
			
			var button = new Helpers.buttonImage();
			button.setId(_prefix+"-"+i+"-selectButton");
			button.setCorrect(Number($(clickers[i]).children("correct")[0].firstChild.nodeValue) === 0 ? false : true);
			button.setState1Image(Helpers.findImage($(clickers[i]).children("button")[0].firstChild.nodeValue, _pageObject.images));
			button.setState2Image(Helpers.findImage($(clickers[i]).children("button")[0].firstChild.nodeValue+"_over", _pageObject.images));
			button.setState3Image(Helpers.findImage($(clickers[i]).children("button")[0].firstChild.nodeValue+"_selected", _pageObject.images));
			
			_clickers.push({
				button:button,
				
				x: Number($(clickers[i]).children("x")[0].firstChild.nodeValue) - _options.shiftLeft,
				y: Number($(clickers[i]).children("y")[0].firstChild.nodeValue)
			});
			
		}
		
		_checkButton = {
			 width: Number($(xmlcontent).children("checkAnswerButton")[0].getAttribute("bWidth")),
			 height: Number($(xmlcontent).children("checkAnswerButton")[0].getAttribute("bHeight")),
			 x: Number($(xmlcontent).children("checkAnswerButton")[0].getAttribute("x")),
			 y: Number($(xmlcontent).children("checkAnswerButton")[0].getAttribute("y")),
			 bColour: Helpers.convertColour($(xmlcontent).children("checkAnswerButton")[0].getAttribute("bColour")),
			 roColour: Helpers.convertColour($(xmlcontent).children("checkAnswerButton")[0].getAttribute("bRoColour")),
			 selColour: Helpers.convertColour($(xmlcontent).children("checkAnswerButton")[0].getAttribute("bSelColour")),
			 fontColour: Helpers.convertColour($(xmlcontent).children("checkAnswerButton")[0].getAttribute("fontColour")),
			 fontSize: $(xmlcontent).children("checkAnswerButton")[0].getAttribute("fontSize")
		};
		_cfeedback = {
			width: Number($(xmlcontent).children("correctFb")[0].getAttribute("width")),
			height: Number($(xmlcontent).children("correctFb")[0].getAttribute("height")),
			x: Number($(xmlcontent).children("correctFb")[0].getAttribute("x")),
			y: Number($(xmlcontent).children("correctFb")[0].getAttribute("y")),
			sound: $(xmlcontent).children("correctFb")[0].getAttribute("sound"),
			fontColour: Helpers.convertColour($(xmlcontent).children("correctFb")[0].getAttribute("fontColour")),
			text: $(xmlcontent).children("correctFb")[0].firstChild.nodeValue
		};
		_icofeedback = {
			width: Number($(xmlcontent).children("incorrectFb")[0].getAttribute("width")),
			height: Number($(xmlcontent).children("incorrectFb")[0].getAttribute("height")),
			x: Number($(xmlcontent).children("incorrectFb")[0].getAttribute("x")),
			y: Number($(xmlcontent).children("incorrectFb")[0].getAttribute("y")),
			sound: $(xmlcontent).children("incorrectFb")[0].getAttribute("sound"),
			fontColour: Helpers.convertColour($(xmlcontent).children("incorrectFb")[0].getAttribute("fontColour")),
			text: $(xmlcontent).children("incorrectFb")[0].firstChild.nodeValue
		};
		var g = new TweenMax.delayedCall(_options.delayReveal, placeButtons);
		var t = new TweenMax.delayedCall(_options.delayActivation, activateButtons);
		_pageObject.addToReset(g);
		_pageObject.addToReset(t);
	};
	function placeButtons(){
		for(var i=0,ii=_numberofitems;i<ii;i++){
			_clickers[i].button.drawButton(_holder);
			_clickers[i].button.btn = _clickers[i].button.getButton();	
			
				
			TweenLite.set(_clickers[i].button.btn, {x:_clickers[i].x, y:_clickers[i].y, opacity:0, rotationY:90, position:"absolute"});
			var u = TweenLite.to(_clickers[i].button.btn, 0.5,{ opacity:1, rotationY:0, delay:0.05*i });		
			_pageObject.addToReset(u);
		}
	}
	function activateButtons(){
		for(var i=0,ii=_numberofitems;i<ii;i++){
			setUnselected(_clickers[i].button);
		}	
		placeCheckAnswerButton();
	}	
	function setTap() {
		tap = true;
		setTimeout(function () {
			tap = false;
		}, 500);
	}
	function setUnselected(btn){
		
		$(btn.btn).off();
		//btn.setState("active");
		btn.setBg(1);	
		btn.setSelected(false);
		$(btn.btn).css({'cursor':'pointer'}).on('touchend', function(){ 
			$(btn.btn).off();
			setSelected(btn);	
			setTap();
		}).on('click', function(){ 
			if(!tap){
				setSelected(btn);	
			}
		});
	}
	function setSelected(btn){
		if(_firstSelection){
			_firstSelection = false;
			_checkButton.button.setState("active");
			$("#"+_checkButton.id).on('click', function(){
				deActivateItems();
				Feedback(checkCorrect());
				$("#"+_checkButton.id).off();
				
			});
		}
		$(btn.btn).off();	
		//btn.setState("selected");	
		btn.setBg(3);	
		btn.setSelected(true);
		$(btn.btn).on('touchend', function(){ 
			$(btn.btn).off();
			setUnselected(btn);	
			setTap();		
		}).on('click', function(){ 
			if(!tap){
				setUnselected(btn);		
			}
		});
	}
	//function selectedEvent
	function placeCheckAnswerButton(){		
	
		_checkButton.button = new Helpers.Button("Check Answer");
		_checkButton.button.setHeight(_checkButton.height);
		_checkButton.button.setWidth(_checkButton.width);
		_checkButton.button.setFontColour(_checkButton.fontColour);
		//_checkButton.button.setFontSize(_checkButton.fontSize);
		_checkButton.button.setButtonColour(_checkButton.bColour);
		_checkButton.button.setRollOverColour(_checkButton.roColour);
		_checkButton.button.setSelectColour(_checkButton.selColour);
		
		_checkButton.toggleAnswers = new Helpers.Button("View Your Answer");
		_checkButton.toggleAnswers.setHeight(_checkButton.height);	
		_checkButton.toggleAnswers.setWidth(_checkButton.width);		
		_checkButton.toggleAnswers.setFontColour(_checkButton.fontColour);		
	//	_checkButton.toggleAnswers.setFontSize(_checkButton.fontSize);		
		_checkButton.toggleAnswers.setButtonColour(_checkButton.bColour);		
		_checkButton.toggleAnswers.setRollOverColour(_checkButton.roColour);		
		_checkButton.toggleAnswers.setSelectColour(_checkButton.selColour);
		
		var cbId = _prefix+"-checkanswer";
		_checkButton.id=cbId;
		_checkButton.button.setId(cbId);
		
		_checkButton.toggleAnswers.setId(_prefix+"-toggleanswer");
		
		_checkButton.button.drawButton(_holder);
		_checkButton.button.setState("inactive");
		_checkButton.y = _checkButton.y;
		_checkButton.x = _checkButton.x;		
		
		TweenLite.set($("#"+cbId),{ left: _checkButton.x, top: _checkButton.y});
		
	}
	function deActivateItems(){
		for(var i=0;i<_numberofitems;i++){
			_clickers[i].button.removeInteraction();	
		}
	}
	function checkCorrect(){
		for(var i=0;i<_numberofitems;i++){
			if(_clickers[i].button.getCorrect() !== _clickers[i].button.getSelected()){
				return false;
			}
		}
		return true;
	}
	function Feedback(done){
		var fb = (done)?_cfeedback:_icofeedback;
		var popup = new Helpers.popup();
		popup.setWidth(fb.width);
		popup.setHeight(fb.height);
		popup.setName(_prefix+"-popup-feedback");
		popup.setClosebtn(false);
		popup.setX(fb.x);
		popup.setY(fb.y);
		
		popup.addToStage(_holder);	
		$("#"+popup.name).prepend("<p class=\"t30 l20\">"+fb.text+"</p>");
		if(fb.sound != null || fb.sound != undefined){
			popup.includeSound(true);
			Global.soundController.playSound(fb.sound, _pageObject);
		}
		_checkButton.button.removeFromStage();
		if(fb === _cfeedback){	
			_base.setToComplete();		
		}else{
			var b = new Helpers.Button("View Correct Answer");
			b.setWidth(200);
				
			var bId = _prefix+"-viewanswer";
			b.setId(bId);
			b.drawButton("#"+popup.name);	
				
			var bx = fb.width - 220;
			var by = fb.height - 50;
				
			TweenLite.set($("#"+bId),{ left: bx, top: by});
			$("#"+bId).on('click tap', function(){ 
				_checkButton.toggleAnswers.drawButton(_holder);		
				TweenLite.set($("#"+_prefix+"-toggleanswer"),{left: _checkButton.x, top: _checkButton.y});
				$("#"+_prefix+"-toggleanswer").on('click tap', function(){ 
					toggleOptions();
				});		
				b.removeFromStage();
				showCorrectAnswers();	
				_base.setToComplete();		
			});
		}
	}
	function showCorrectAnswers(){
		_showingYourAnswers = false;
		for(var i=0,ii=_numberofitems;i<ii;i++){
			if(_clickers[i].button.getCorrect()){
				_clickers[i].button.setBg(3);
			}else{
				_clickers[i].button.setBg(1);
			}
		}	
	}
	function showYourAnswers(){
		_showingYourAnswers = true;
		for(var i=0,ii=_numberofitems;i<ii;i++){
			if(_clickers[i].button.getSelected()){
				_clickers[i].button.setBg(3);
			}else{
				_clickers[i].button.setBg(1);
			}
		}	
	}
	function toggleOptions(){
		if(_showingYourAnswers){
			
			showCorrectAnswers();
			$("#"+_prefix+"-toggleanswer p").text("View Your Answer");	
		}else{
		
			showYourAnswers();
			$("#"+_prefix+"-toggleanswer p").text("View Correct Answer");	
		}
	}
};;// JavaScript Document
Activities.Assessment = function(){	
	var _base; 
	var _pageNumber;
	var _pageObject;
	var _tl;
	var _prefix;
	var _holder;
	var _options;
	var _questionList = [];
	var _questions = [];
	var _currentPosition=0;
	var _continueBtn;
	var _pagesForReview=[];
	var _feedback=[];
	var _secondAttemptAtQu = false;
	var _score;
	var _scPerQu;
	
	this.buildActivity = function(pageObject, holder){
		CSSPlugin.defaultTransformPerspective=500;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		_base = new Activities.base();
		_holder = holder;	
		_pageObject = pageObject;
		_tl = new TimelineLite();
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("assessmentOptions")[0];
		_options = {
			tolerance: Number($(xmlcontent).children("tolerance")[0].firstChild.nodeValue),
			bgX: Number($(xmlcontent).children("bgX")[0].firstChild.nodeValue),
			bgY: Number($(xmlcontent).children("bgY")[0].firstChild.nodeValue),
			quFontColour:  Helpers.convertColour($(xmlcontent).children("quFontColour")[0].firstChild.nodeValue),
			quFontSize:  Number($(xmlcontent).children("quFontSize")[0].firstChild.nodeValue),
			quX:  Number($(xmlcontent).children("quX")[0].firstChild.nodeValue),
			quY:  Number($(xmlcontent).children("quY")[0].firstChild.nodeValue),
			numberOfQus:  Number($(xmlcontent).children("noofqspermod")[0].firstChild.nodeValue),
			ansPanelX:  Number($(xmlcontent).children("ansPanelX")[0].firstChild.nodeValue),
			ansPanelY:  Number($(xmlcontent).children("ansPanelY")[0].firstChild.nodeValue),
			ansPanelWidth:  Number($(xmlcontent).children("ansPanelWidth")[0].firstChild.nodeValue),
			ansFontSize:  Number($(xmlcontent).children("ansFontSize")[0].firstChild.nodeValue),
			ansBgColour:  Helpers.convertColour($(xmlcontent).children("ansBgColour")[0].firstChild.nodeValue),
			ansRoColour:  Helpers.convertColour($(xmlcontent).children("ansRoColour")[0].firstChild.nodeValue),
			ansSelColour:  Helpers.convertColour($(xmlcontent).children("ansSelColour")[0].firstChild.nodeValue),
		};
		_feedback = [{name:"passed"},{name:"tolwrong"},{name:"intolwrong"},{name:"intolfirstgowrong"},{name:"stillwrong"}];
		for(var i=0,ii=_feedback.length;i<ii;i++){
			_feedback[i].sound = $(xmlcontent).children(_feedback[i].name)[0].getAttribute("sound");
			_feedback[i].image = $(xmlcontent).children(_feedback[i].name)[0].getAttribute("image");
			_feedback[i].text = $(xmlcontent).children(_feedback[i].name)[0].firstChild.nodeValue;
		}
		var questions = xmlcontent.getElementsByTagName("question");
		for(i=0,ii=questions.length;i<ii;i++){
			var text = {
				content: $(questions[i]).children("text")[0].firstChild.nodeValue,
				width: $(questions[i]).children("text")[0].getAttribute("width"),
				sound: $(questions[i]).children("text")[0].getAttribute("sound"),
			};
			var answers = questions[i].getElementsByTagName("ans");
			var as = [];
			for(var a=0,aa=answers.length;a<aa;a++){
				var answer = {
					content: answers[a].firstChild.nodeValue,
					correct: (Number(answers[a].getAttribute("correct"))===1)?true:false,
					sound: answers[a].getAttribute("sound"),
					selected: false,
					id : _currentPosition+"-"+a
				};
				as.push(answer);
			}
			_questionList.push({
				qu: text,
				answers: as,
				answeredCorrectly:false,
				pageref: Number(questions[i].getAttribute("refPageNo"))
			});
		}
		_scPerQu = 100 / _options.numberOfQus;
		selectQuestions();
	};
	function selectQuestions(){
		_questions = Helpers.shuffleArray(_questionList);
		var i = _questions.length;
		while(_questions.length>_options.numberOfQus){
			_questions.splice(i, 1);
			i--;
		}
		for(var i=0,ii=_options.numberOfQus-1;i<ii;i++){
			Helpers.shuffleArray(_questions[_currentPosition].answers);	
		}	
		addQus();
		
	}
	function addQus(){
		$(_holder).append("<div id=\"question-bg\"><div id=\"qunumber\"><p id=\"Q\">Q</p></div></div>");
		_continueBtn = new Helpers.Button("Next Question");
		var cbId = _prefix+"-continue";
		_continueBtn.setId(cbId);
		_continueBtn.drawButton(_holder);
		_continueBtn.setState("inactive");
		var continueBtny = $("#question-bg").height() + _options.bgY +20;
		var continueBtnx = _options.bgX + $("#question-bg").width() - 160;	
		TweenLite.set($("#"+_continueBtn.getId()), {top:535, left:675})
		placeQuestion();		
	}
	function activateQu(){
		
		
		$("#form"+_currentPosition+" label").click(function(){
			if(_continueBtn.getState()!=="active"){
				_continueBtn.setState("active");	
				$("#"+_continueBtn.getId()).click(function(){
					var selected = $("#form"+_currentPosition+" input[type='radio']:checked").val();
					for(var i=0,ii=_questions[_currentPosition].answers.length;i<ii;i++){
						if(_questions[_currentPosition].answers[i].id === selected){
							_questions[_currentPosition].answers[i].selected = true;
						}
					}
					
					nextQuestion();
								
				});
			}
		});	
	}
	function placeQuestion(){
		var on = _currentPosition + 1;
		if(on == _options.numberOfQus){
			_continueBtn.setText("Submit answers");
		}
		$("#qunumber").append("<p id=\"qnumber\" class=\"removable\">"+on+" / "+_options.numberOfQus+"</p>");
		$("#question-bg").append("<p id=\"qu-"+_prefix+"-"+_currentPosition+"\" class=\"statement removable\">"+_questions[_currentPosition].qu.content+"</p><hr>");
		_tl.set($("#question-bg"), {position: "absolute", left:_options.bgX, top:_options.bgY, width:Helpers.horizontalCentreWidth(_options.bgX, $(_holder)), opacity: 1});	
		_tl.set($("#qu-"+_prefix+"-"+_currentPosition), {left:_options.quX - _options.bgX, top:(_options.quY-_options.bgY)-10, opacity: 1, color: _options.quFontColour});	

		var x = _options.ansPanelX - _options.bgX;
		$("#question-bg").append("<div id=\"form"+_currentPosition+"\" class=\"formbox removable\"></fieldset>");
		_tl.set($("#form"+_currentPosition), {position:"absolute", left:x, width:Helpers.horizontalCentreWidth(x, $("#question-bg")), top:_options.ansPanelY-_options.bgY, opacity: 1});	
		
		for(i=0;i<4;i++){
			$("#form"+_currentPosition).append("<label for=\"qu-"+_prefix+"-"+_currentPosition+"-an"+i+"\" class=\"removable\"><input type=\"radio\" name=\"qu-"+_prefix+"-"+_currentPosition+"\" value=\""+_questions[_currentPosition].answers[i].id+"\" id=\"qu-"+_prefix+"-"+_currentPosition+"-an"+i+"\"><span>"+_questions[_currentPosition].answers[i].content+"</span></label>");					
		}	
		
			
		
		activateQu();
	}
	function markAnswer(){
		for(var i=0;i<4;i++){
			if(_questions[_currentPosition].answers[i].selected && _questions[_currentPosition].answers[i].correct){
				_questions[_currentPosition].answeredCorrectly=true;
				break;
			}else{
			}
		}	
	}
	function nextQuestion(){
		_continueBtn.setState("inactive");
		$("#"+_continueBtn.getId()).off();
		markAnswer();
		if(_currentPosition+1<_options.numberOfQus){
			$(".removable").remove();
			_currentPosition++;
			placeQuestion();
		}else{
			calculateScore();
		}
	}
	function calculateScore(){
		var score = 0;
		var fbToSee;
		_score=0;
		_continueBtn.setState("inactive");
		$("#"+_prefix+"-continue").off();
		for(var i=0,ii=_questions.length;i<ii;i++){
			if(_questions[i].answeredCorrectly){
				score++;
				_score+=_scPerQu;		
			}else{
				_pagesForReview.push(_questions[i].pageref);
			}
		}
	
		var a=_questions.length;
		while (a--){
			if(_questions[a].answeredCorrectly){
				_questions.splice(a, 1);
			}
		}

		switch(_secondAttemptAtQu){
			case false:
				if(score === _options.numberOfQus){
					fbToSee = "passed";		
				}else if(score>=(_options.numberOfQus -_options.tolerance)){
					fbToSee = "tolwrong";
				}else if(score < (_options.numberOfQus -_options.tolerance)){
					fbToSee = "intolwrong";
				}	
			break;
			case true:
				if((score < _options.numberOfQus)){
					switch(Global.model.getAfterAssessment()){
						case false: 
							fbToSee = "stillwrong";
						break;
						case true:
							fbToSee = "intolwrong";
						break;
					}
				}else{
					fbToSee = "passed";
				}
			break;	
		}	
		showFb(fbToSee);
	}
	function showFb(type){	
		var fb;
		var im;
		var text;
		for(var i=0,ii=_feedback.length;i<ii;i++){
			if(_feedback[i].name === type){
				fb=_feedback[i];
				break;	
			}
		}
		View.clearContents(true);
		text = fb.text;
		$(_holder).append("<p id=\"assessment_fb\" class=\"statement\">"+fb.text+"</p>");
		
		
		if(type==="intolwrong"){
			Global.controller.failedAssessment(_score);
		}else if(type==="stillwrong"){
			switch(Global.model.getAfterAssessment()){
				case false: 
					Global.controller.miniCourse(Helpers.uniqueArray(_pagesForReview), _score);
				break;
				case true:
					Global.controller.failedAssessment(_score);		
				break;
			}		
		}else if(type==="tolwrong"){
			_secondAttemptAtQu = true;
			Global.controller.sendScore(_score);
			var btn = new Helpers.Button("Try again");
			var cbId = _prefix+"-btn";
			btn.setId(cbId);
			btn.drawButton(_holder);
			btn.setState("active");
			var continueBtny = $("#question-bg").height() + _options.bgY +20;
			var continueBtnx = _options.bgX + $("#question-bg").width() - 160;		
			TweenLite.set($("#"+cbId),{left: continueBtnx, top: continueBtny});
			$("#"+cbId).click(function(){
				_currentPosition=0;
				_options.numberOfQus = _questions.length;
				$(_holder).empty();
				addQus();
			});		
		}else if(type==="passed"){
			Global.controller.passedAssessment();
		}	
	}
};;// JavaScript Document
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
	
};// JavaScript Document
Activities.Video = function(){	
	var base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _videos=[];
	var _numberofvids;
	
	this.buildActivity = function(pageObject, holder){
		base = new Activities.base();	
		base.page = _pageNumber;
		_pageObject = pageObject;
		_videos = $(_pageObject.pagexml[_pageObject.pageposition]).children("placeVideo");
		_numberofvids = _videos.length;
		_holder = holder;
		placeVideo();
		
	};	
	function placeVideo(){
		
		for(var i=0;i<_pageObject.videoManifest.length;i++){
			for(var a=0,aa=_numberofvids;a<aa;a++){
				if(_pageObject.videoManifest[i].id == _videos[a].getAttribute("name")){
					
					$(_holder).append("<div id=\"stageVideoContainer"+i+"\" class='pf-container'></div>");
					var x = Number(_videos[a].getAttribute("x"));
					var y = Number(_videos[a].getAttribute("y"));
					TweenLite.set($("#stageVideoContainer"+i), {position:"absolute", left: x, top: y});	
					var myPlayer = new PlayerFramework.Player("stageVideoContainer"+i,
					{
						mediaPluginFallbackOrder: [ "VideoElementMediaPlugin", "SilverlightMediaPlugin" ],
						//mediaPluginFallbackOrder: [ "SilverlightMediaPlugin", "VideoElementMediaPlugin" ],
						//mediaPluginFallbackOrder: [ "HyperlinkMediaPlugin" ],
						width: Number(_videos[a].getAttribute("width")),
						height: Number(_videos[a].getAttribute("height")),
						//poster: "../media/bigbuck.png",
						sources:
						[
							{
								src: _pageObject.videoManifest[i].src,
								type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
							},					
						]
					});
					
				}//end if
				
				
			}
			
		}	
		$(".pf-full-browser-control").remove();	
	}
};;// JavaScript Document
var Models = Models || {};		
Models.global = function(){
	"use strict";
	this.modTitle,
	this.courseTitle,
	this.numberOfPages,
	this.pageOn,
	this.currentPageObject,
	this.pages = [],
	this.secondAttemptPages = [],
	this.secondAttemptNumberOfPages,
	this.onAfterAssessment = false,
	this.development = false,
	this.sidePanels=[],
	this.zoom = 1,
	this.zoomBrowser,
	this.scorm = false,
	this.scormInitialised = false,
	this.scormProgress = [],
	this.scormBookmark = 0,
	this.scormCompletion,
	this.manifestLoading = 0,
	this.setScormProgressString = function(v){
		
		if(v===undefined || v==="" || v==="0"){
			
			for(var i=0;i<this.numberOfPages;i++){
				this.scormProgress.push("0");
			}
		}else{
			this.scormProgress = v.split(",");
		}
		
	},
	this.setScormBookmark = function(v){
		this.scormBookmark = v;
	},
	this.setCompletion = function(v){
		this.scormCompletion = v;
	},
	this.addSidePanel = function(p){
		this.sidePanels.push(p);	
	},
	
	this.setModTitle = function(t){
		this.modTitle = t;	
	},
	this.setCourseTitle = function(t){
		this.courseTitle = t;	
	},
	this.setNumberOfPages = function(t){
		this.numberOfPages = t;	
	},
	this.setScorm = function(t){
		this.scorm = t;
	},
	this.setPageOn = function(t){
		this.pageOn = t;
		this.currentPageObject= this.pages[t];	
	},
	this.setPageObject = function(p){
		this.currentPageObject=p;	
	},
	this.addPageToArray = function(p){
		this.pages.push(p);
	},
	this.setAfterAssessment = function(p){
		this.onAfterAssessment = p;
	},
	this.getAfterAssessment = function(){
		return this.onAfterAssessment;
	},
	this.setAllPagesIncomplete = function(){
		for(var i=0;i<this.numberOfPages;i++){
			this.pages[i].completed=false;
		}		
	},
	this.setAllPagesComplete = function(){
		for(var i=0;i<this.numberOfPages;i++){
			this.pages[i].setComplete(true);
		}
	},
	this.setPageIncomplete = function(a){
		if(this.pages[a-1] != undefined){
			this.pages[a-1].setComplete(false);
		}else{
				
		}
	},
	this.setPageUnavailable = function(a){
		if(this.pages[a-1] != undefined){
			this.pages[a-1].setAvailable(false);
		}else{
					
		}
	},
	this.setSecondAttemptPages = function(){
		this.secondAttemptNumberOfPages=0;
		for(var i=0,ii=this.numberOfPages;i<ii;i++){
			if(!this.pages[i].completed){
				this.secondAttemptPages.push(this.pages[i]);
				this.secondAttemptNumberOfPages++;
			}	
		}
	},
	this.setZoomBrowser = function(val){
		this.zoomBrowser = val;
	},
	this.setZoom = function(val){
		if(this.zoomBrowser){
			if (val){
				this.zoom = val;	
			}else{
				var w = window.innerWidth;
				var h = window.innerHeight;
				
				var ratio = ((1009 * (h/661))<= w)?(h/662):(w/1009);
				this.zoom = ratio;	
			}
		}
	}
};
Models.page = function(n){
	THIS=this;
	this.name = n;
	this.images = [];
	this.sounds = [];
	this.videos = [];
	this.customjs = [];
	this.transcripts = [];
	this.activities = [];	
	this.loaded = false;
	this.route;
	this.xml;
	this.pagexml = [];
	this.pageposition = 0;
	this.title;
	this.percentLoaded = 0;
	this.manifest =[];
	var secondmanifest =[];
	this.videoManifest =[];
	this.numberOfScreens = 1;
	this.completed =false;
	this.available=false;
	this.timeLinesToReset = [];
	this.eventsToReset = [];
	this.timedProgression = [];
	this.continueBtn = [];
	this.noSound = [];
	this.noRemove = [];
	this.stopSound=[];
	this.interval = undefined;
	this.queue = undefined;
	this.queueReady = false;

	
	this.loadData = function(){			
		var preload = new createjs.LoadQueue(false);		
		preload.on("fileload", xmlloaded, this);
		preload.loadFile(this.route);		
	};
	
	this.addToReset = function(tl){
		this.timeLinesToReset.push(tl);
	}
	this.addToResetEventListeners = function(tl){
		this.eventsToReset.push(tl);
	}
	this.pageReset = function(){
		for(var i=0, ii=this.timeLinesToReset.length; i<ii; i++){
			this.timeLinesToReset[i].kill();
		}
		for(i=0, ii=this.eventsToReset.length; i<ii; i++){
			$(this.eventsToReset[i]).off();
		}
		this.pageposition=0;
		this.timeLinesToReset=[];
		if(this.interval)clearInterval(this.interval);
		
	}
	this.setAvailable = function(e){
		this.available = e;	
	};
	function xmlloaded(e){
		this.xml = e.result.documentElement;	
		var ee = this.xml.getElementsByTagName("page");
		for(var i=0, ii=ee.length; i<ii; i++){		
			if(ee[i].parentNode.parentNode.nodeName == '#document'){		
				this.pagexml.push(ee[i]);
			}else{
			
			}
		}
		this.numberOfScreens = this.pagexml.length;
		var tr = this.xml.getElementsByTagName("transcript");
		
		for(i=0, ii=tr.length; i<ii; i++){
			this.transcripts.push({
				sound:tr[i].getAttribute("sound"),
				text:tr[i].firstChild.nodeValue
			});			
		}
		var nodes = [];			
		if(this.xml.getElementsByTagName("LoaderMax")[0] && this.xml.getElementsByTagName("LoaderMax")[0].childNodes.length>0){
			nodes = this.xml.getElementsByTagName("LoaderMax")[0].childNodes;			
		}
		
		for(i=0, ii=nodes.length; i<ii;i++){
		
			if(nodes[i].nodeType===1){
				
				var a = {
					src:nodes[i].getAttribute("url"),
					id:nodes[i].getAttribute("name")							
				};
				
				if(nodes[i].hasAttribute("extras")){				
					var additions = nodes[i].getAttribute("extras").replace(/ /g,'').split(",");
					for(var j=0,jj=additions.length;j<jj;j++){
						var newSrc = a.src.replace(/\.swf$/, '_'+additions[j]+".png");
						var newId = a.id;
						newId +='_'+additions[j];
						var extras = {
							src: newSrc,
							id: newId
						};
						this.manifest.push(extras);
						
					}
				}
				if(nodes[i].hasAttribute("replaceext")){
					var replacement = nodes[i].getAttribute("replaceext").replace(/ /g,'');					
					a.src = a.src.replace(/\.swf$/, '.'+replacement);
					if(replacement==="mp4"){
						this.videoManifest.push(a);	
					}else{
						this.manifest.push(a);
					}
				}else{
					var ext = a.src.substr(a.src.lastIndexOf('.')+1);	
					if(ext == "mp4"){
						this.videoManifest.push(a);	
					}
					this.manifest.push(a);
				}
				
			}			
		}
		fixSwf(this);	
		loadManifest(this);	
		this.linkActivities(this);
		
	}
	function fixSwf(th){	
		for(var i=0, ii=th.manifest.length;i<ii;i++){	
		
			var ext = th.manifest[i].src.substr(th.manifest[i].src.lastIndexOf('.')+1);		
			if(ext == "swf"){
				th.manifest[i].src = th.manifest[i].src.substr(0, th.manifest[i].src.lastIndexOf('.')+1) + "png";
				
			}
		}			
	}
	function loadManifest(th){
		th.queue = new createjs.LoadQueue(true);
		th.queue.installPlugin(createjs.Sound);
		th.queue.on("fileload", assetLoaded, th);
		th.queue.on("complete", allLoaded, th);
		th.queue.on("error", function(e){
			if(e.data && e.data.ext === "png"){
				var src = e.data.src.substr(0, e.data.src.lastIndexOf('.')+1) + "js";			
				th.queue.loadFile({id:e.data.id, src:src});
			}	
		});
		//queue.loadManifest(th.manifest);
		th.queue.on("progress", function(){
			th.percentLoaded = Math.round(th.queue.progress * 100);			
		});
		if(th === Global.model.pages[0]){	
			Global.controller.chooseLoader();	
		}
	}
	function vidLoaded(e){
		e.item.vid = e.result;				
		e.item.width = e.result.width;
		e.item.height = e.result.height;
		this.videos.push(e.item);
	}
	function assetLoaded(e){
	
		switch(e.item.ext){
			
			case "mp3":
				e.item.sound = e.result;
				this.sounds.push(e.item);
				
				break;
				
			case "png":
				e.item.pic = e.result;
				e.item.width = e.result.width;
				e.item.height = e.result.height;
				this.images.push(e.item);
				break;
				
			case "mp4":
				e.item.vid = e.result;
				e.item.width = e.result.width;
				e.item.height = e.result.height;
				this.videos.push(e.item);
				break;
				
			case "js":
				e.item.namespace = e.item.src.substr(0, e.item.src.lastIndexOf('/')).substring(e.item.src.indexOf("/") + 1).substring(e.item.src.indexOf("/") + 2);
				this.customjs.push(e.item);
				break;
				
		}			
	}
	
	
	function allLoaded(e){
		this.loaded = true;	
		Global.controller._loading=false;
		Global.controller.chooseLoader();	
	}
	function displayError(e){
		
	}
	
	this.linkActivities = function (th){
		for(var i=0;i<th.numberOfScreens;i++){	
			var actsinpage = $(th.pagexml[i]).children("activities").children("activity");
			var tt = (th.pagexml[i].getAttribute("noRemove")==="true")?true:false;
			this.noRemove.push(tt);
			var cb = (th.pagexml[i].getAttribute("continueBtn")==="true")?true:false;
			var continueBt = {
				exists: cb	
			}
			if(cb){
				continueBt.x = (th.pagexml[i].getAttribute("continueBtnX"))?Number(th.pagexml[i].getAttribute("continueBtnX")):null;
				continueBt.y = (th.pagexml[i].getAttribute("continueBtnY"))?Number(th.pagexml[i].getAttribute("continueBtnY")):null;
				continueBt.text = (th.pagexml[i].getAttribute("continueBtnText"))?th.pagexml[i].getAttribute("continueBtnText"):"Continue";
			}
			
			
			this.continueBtn.push(continueBt);
			if(th.pagexml[i].getAttribute("clearTime") != undefined){
				this.timedProgression.push(Number(th.pagexml[i].getAttribute("clearTime")));
				
				
			}else{
				this.timedProgression.push(null);
			}
		/*	var ns = (th.pagexml[i].getAttribute("noSoundHTML")==="true")?true:false;
			this.noSound.push(ns);*/
			for(var a=0,aa=actsinpage.length;a<aa;a++){
				var obj = {
					name: actsinpage[a].childNodes[0].nodeValue,
					pageNumber: i,
					
				};
				th.activities.push(obj);	
			}
		
			if(th.pagexml[i].getAttribute("stopSoundWithTransition") != undefined && th.pagexml[i].getAttribute("stopSoundWithTransition")==="true"){
				this.stopSound.push(true);
			}else{
				this.stopSound.push(false);	
			}
		}
		return th.activities;
	};
	this.setComplete = function(c){
		this.completed = c;
		
	};
}
;// JavaScript Document
function moduleXmlloader(){}
(function(){
	var THIS = this;
	var loaderitems, information, pagexml;
	var master;
	
	this.loadXml = function(path, controller){		
		master = controller;
		var preload = new createjs.LoadQueue(false);
		preload.on("fileload", handleFileComplete);
		preload.on("error", displayError);
		preload.loadFile(path);	
	};
	this.loadGlossary = function(path, controller){
		var preload = new createjs.LoadQueue(false);	
		preload.on("fileload", controller.handleXml);
		preload.on("error", displayError);
		preload.loadFile(path);		
	};
	function displayError(e){
		
	}
	function handleFileComplete(event){
		var res = event.result.documentElement;		
		loaderitems = [];		
		pagesxml = [];			
		
		loaderitems = res.getElementsByTagName("XMLLoader");
		Global.model.setCourseTitle(res.getElementsByTagName("coursetitle")[0].childNodes[0].nodeValue);
		Global.model.setModTitle(res.getElementsByTagName("modtitle")[0].childNodes[0].nodeValue);
		if( res.getElementsByTagName("iAmDeveloping")[0]){
			Global.model.development = (res.getElementsByTagName("iAmDeveloping")[0].childNodes[0].nodeValue == "true") ? true:false; 
		}
		if( res.getElementsByTagName("scorm")[0]){
			Global.model.setScorm((res.getElementsByTagName("scorm")[0].childNodes[0].nodeValue === "true") ? true:false);
			if(Global.model.scorm){
				Global.scormController = new Controllers.scormController();
				Global.model.scormInitialised = Global.scormController.loadPage();
			}
		}
		
		View.addCourseTitle();
		pagesxml = res.getElementsByTagName("page");	
		Global.model.setNumberOfPages(pagesxml.length);		
		var pages=[];
		for (var i=0,ii=pagesxml.length;i<ii;i++){		
			
			var p = new Models.page(loaderitems[i].getAttribute("name"));				
			p.route = loaderitems[i].getAttribute("url");					
			Global.model.addPageToArray(p);		
			getTitle(p);
			if(Global.model.development && !Global.model.scormInitialised){
				p.setComplete(true);
				p.setAvailable(true);				
			}else if(Global.model.development && Global.model.scormInitialised){
				p.setComplete(false);
				p.setAvailable(true);
			}else if(!Global.model.development && Global.model.scormInitialised){
				if(Global.model.scormProgress[i] === "1"){
					p.setComplete(true);
				}else{
					p.setComplete(false);	
				}	
				if(!Global.model.pages[i-1] || Global.model.pages[i-1].completed) p.setAvailable(true);			
			}
			p.loadData();
		}	
		Global.menuController.setMenu(Global.model.pages);
		if(Global.model.scormInitialised && Global.model.scormBookmark>0){
			master.setBookmarkPopup();
		}else{
			master.setPage(0);
		}
						
	}
	function getTitle(p){
		for (var i=0,ii=pagesxml.length;i<ii;i++){		
			if(pagesxml[i].getAttribute("xmlName") == p.name){					
				p.title = pagesxml[i].childNodes[0].nodeValue;				
				break;					
			}		
		}		
	}
	
			
}).apply(moduleXmlloader);;// JavaScript Document
var Controllers = Controllers || {};		
Controllers.master = function(){		
	
	var _pageArray=[];
	this.currentPage = 0;
	this.pages = [];
	var _glossaryController;
	var _button = "ape";
	var _loading = false;
	var THIS = this;		
	this.begin = function(){					
		moduleXmlloader.loadXml("modxml/modulexml.xml", this);
		this.setPageArray("normal");
		if(Global.model.zoomBrowser){
			resizeView();
			$(window).resize(function(){
				resizeView();
			});
		}
		function resizeView(){
			Global.model.setZoom();
			View.resizeView();
		}
	};	
	this.loadGlossary = function(){
		var glController = new Controllers.glossaryController();
		glController.setGlossary();	
		moduleXmlloader.loadGlossary("../common/globalxml/glossary.xml", glController);
		_glossaryController = glController;
		_glossaryController.addButton($("#btn-glossary"));
		_glossaryController.activateButton(_glossaryController);
	};
	this.loadHelp = function(){
		var hlController = new Controllers.helpController();
		hlController.setHelp();	
		hlController.activateButton($("#btn-help"), hlController);
	};
	this.chooseLoader = function(p){
		if(!THIS._loading){
			if(p){
				loadQueue(p, p.manifest);	
			}else{		
				var f = findFirstRequiredLoader();
				if(typeof f==='number'){
					loadQueue(_pageArray[f]);		
				}
			}
		}
	}
	function loadQueue(page){	
		console.log(page);
		console.log(page.manifest);
				if(page.queue){
					console.log("WE HAVE A QUEUE");
					page.queue.loadManifest(page.manifest);
					THIS._loading=true;
				}else{
					console.log("WE DONT HAVE A QUEUE");
					setTimeout(function(){loadQueue(page, page.manifest);}, 500);
				}
			}
	function findFirstRequiredLoader(){
	
				if(_pageArray[Global.model.pageOn] && !_pageArray[Global.model.pageOn].loaded){
					return Global.model.pageOn;
				}else if(_pageArray[Global.model.pageOn+1] && !_pageArray[Global.model.pageOn+1].loaded){
					return _pageArray+1;
				}
				/*for (i=0;i<Global.model.numberOfPages;i++){
					if(!Global.model.pages[i].loaded){
						return i;
					}
				}*/
				return false;
			}
	this.setPageArray=function(attemptPlace){
		var attemptPlace = (attemptPlace)?attemptPlace:"normal";
		switch(attemptPlace){
			case "normal":	
				_pageArray = Global.model.pages;
			break;
			case "afterAssessment":	
				_pageArray = Global.model.secondAttemptPages;
			break;
		}
		
	}
	this.setPage = function(page){
		//reset page
		if(Global.model.pageOn !== undefined){
			TweenMax.killTweensOf($("#btn-next"));
			Global.model.currentPageObject.pageReset();			
		}
	
		//remove all items from shell
			
		View.clearContents();
		
		//stop all sounds	
		Global.soundController.stopSound();
		Global.soundController.playDummy();		
		//Change page
		var p = _pageArray[page];
		Global.model.setPageOn(page);
		
		Global.model.setPageObject(p);
		p.setAvailable(true);
		//display page number
		View.setPageNumber(p);
		//make scorm calls
		if(Global.model.scormInitialised)Global.scormController.sendBookmark(page);
		Global.menuController.setButtonStatus();
		//activate nevigation
		this.activateNav(p, this);
		
		//show preloader
		var interval;
		if(!p.loaded){		
			if(p.percentLoaded===0){
				$("#stage").append("<p id=\"preloader\">Fetching page information</p>");
				Global.controller.chooseLoader();
			}else{		
			console.log(p);
				$("#stage").append("<p id=\"preloader\">LOADING: "+p.percentLoaded+"% </p>");
				
			}
			startLoop();
		}else{
			View.launchPage(p);	
			checkTimes(p);
			//load next page
			Global.controller.chooseLoader();		
			return;
		}
		function updateLoader(){			
			if(p.loaded){				
				clearInterval(interval);
				$("#preloader").remove();
				View.launchPage(p);
				checkTimes(p);
				//load next page
				Global.controller.chooseLoader();		
				return;
			}	
			$("#preloader").text("LOADING: "+p.percentLoaded+"%"); 
		}
		function startLoop(){
			
			interval = setInterval(function(){updateLoader()}, 500);
			p.interval = interval;
		}
	};
	this.closeSidePanels = function(){
		for(var i=0,ii=Global.model.sidePanels.length;i<ii;i++){
			Global.model.sidePanels[i].setMenuOpen(false);
			TweenLite.to($("#"+Global.model.sidePanels[i].getId()), 0.3, { width:0, zIndex:0 })
			//TweenLite.to($("#contents"), 0.3,{ x:0 });
		}
	}
	function checkTimes(p){
		if(p.timedProgression[p.pageposition] != null){
			var t = new TweenMax.delayedCall(p.timedProgression[p.pageposition], Global.controller.pageComplete);
			p.addToReset(t);
		}
	}
	this.pageComplete = function(){	
	 	// only 1 page or on last screen in the page
		if(Global.model.currentPageObject.pageposition === Global.model.currentPageObject.numberOfScreens - 1){
			Global.model.currentPageObject.setComplete(true);
			if(Global.model.scormInitialised){
				Global.scormController.sendProgress();	
				Global.scormController.commit();	
			}
			Global.model.currentPageObject.pageposition=0;
			_pageArray[Global.model.pageOn +1].setAvailable(true);
			Global.menuController.setButtonStatus();
			Global.controller.activateNav(Global.model.currentPageObject, Global.controller);		
			View.buttonPulse($("#btn-next"));
		}else if(Global.model.currentPageObject.pageposition < Global.model.currentPageObject.numberOfScreens - 1){
			// more screens to go in page
			if(Global.model.currentPageObject.continueBtn[Global.model.currentPageObject.pageposition].exists){
				//if there is a continue button
				var continueBtn = new Helpers.Button("Continue");	
				var contid = "shell_continue_page"+Global.model.currentPageObject.pageposition;		
				continueBtn.setId(contid);
				continueBtn.setText(Global.model.currentPageObject.continueBtn[Global.model.currentPageObject.pageposition].text);
				continueBtn.drawButton($("#stage"));
				TweenLite.set($("#"+contid),{ left: Global.model.currentPageObject.continueBtn[Global.model.currentPageObject.pageposition].x, top: Global.model.currentPageObject.continueBtn[Global.model.currentPageObject.pageposition].y});
				$("#"+contid).on("click",function(){
					View.clearContents(true);
					if(Global.model.currentPageObject.stopSound[Global.model.currentPageObject.pageposition]){
						Global.soundController.stopSound();
					}
					Global.model.currentPageObject.pageposition++;			
					TweenMax.delayedCall(0.5, View.launchPage, [Global.model.currentPageObject]);	
					
				});
			}else{
				//if there is not a continue button
				if(!Global.model.currentPageObject.noRemove[Global.model.currentPageObject.pageposition]){
					//if there is not a noRemove tag
					if(Global.model.currentPageObject.stopSound[Global.model.currentPageObject.pageposition]){
						Global.soundController.stopSound();
					}
					View.clearContents(true);
				}
				Global.model.currentPageObject.pageposition++;		
				TweenMax.delayedCall(0.5, View.launchPage, [Global.model.currentPageObject]);	
				checkTimes(Global.model.currentPageObject);
			}		
		}else{
				
		}
	};
	this.setPages = function(p){
		pages = p;
	}
	this.activateNav = function(p, th){	
		var next = $("#btn-next");
		var prev = $("#btn-prev");
		var replay = $("#btn-replay");
		var closebtn = $("#closebtn");
		$("#btn-menu, #btn-contr, #btn-next, #btn-prev, #btn-replay").off().removeClass("offNavButtons");
		if(_glossaryController){
			_glossaryController.activateButton(_glossaryController);
		}
		
		var pno;
		switch(Global.model.getAfterAssessment()){
			case false: 
				pno = Global.model.numberOfPages;
			break;
			case true:
				pno = Global.model.secondAttemptNumberOfPages;		
			break;
		}
		if(Global.model.pageOn>0){
			prev.on('click', function(){ th.setPage(Global.model.pageOn -1)});
			View.activeButton(prev);
		}else{
			prev.off();
			View.inactiveButton(prev);
		}
		if(Global.model.pageOn+1<pno && p.completed){
			next.on('click', function(){   th.setPage(Global.model.pageOn +1)});
			View.activeButton(next);
			
		}else{
			$(next).off();
			View.inactiveButton(next);
		}
		
		$("#btn-menu").on('click', function(){ Global.menuController.toggleMenu()});
		$(replay).on('click', function(){ th.setPage(Global.model.pageOn); });
		$(closebtn).on('click', function(){  if(Global.model.scormInitialised){Global.scormController.doQuit();} parent.top.close(); });
	};
	this.deactivateNav = function(){
		$("#btn-menu, #btn-contr, #btn-next, #btn-prev, #btn-replay").off().addClass("offNavButtons");
		if(_glossaryController){
			_glossaryController.deactivateButton();
		}
	};
	this.failedAssessment = function(sc){
		var THIS = this;
		Global.model.setAllPagesIncomplete();
		Global.model.setAfterAssessment(false);
		
		this.resetCourse();
		View.activeButton($("#btn-next"));
		$("#btn-next").on('click', function(){ THIS.setPage(0) });
		
		//scorm set score (sc)
		THIS.sendScore(sc);
		$("#btn-next").removeClass("offNavButtons");
	};
	this.passedAssessment = function(){
		var THIS = this;
		Global.model.setAfterAssessment(false);
		Global.model.setAllPagesComplete();
		//scorm set complete
		//scorm set score 100
		THIS.sendScore(100, "completed");
		//THIS.activateNav(Global.model.currentPageObject, Global.controller);
	};
	this.sendScore = function(sc, status){
		if(Global.model.scormInitialised){
			Global.scormController.sendScore(sc);
			if(status){
				Global.model.setCompletion("completed");
				Global.scormController.sendCompletion();
			}	
			Global.scormController.commit();
		}
	};
	this.miniCourse = function(pages, score){
		var THIS = this;
		if(score) THIS.sendScore(score);
		
		pages.push(Global.model.numberOfPages);
		console.log(pages);
		Global.model.setAfterAssessment(true);
		for(var i=0,ii=pages.length;i<ii;i++){
			Global.model.setPageIncomplete(pages[i]);
			Global.model.setPageUnavailable(pages[i]);
		}
		if(Global.model.scormInitialised){
			Global.scormController.sendProgress();
			Global.scormController.commit();
		}
		Global.model.setSecondAttemptPages();
		Global.controller.setPageArray("afterAssessment");
		Global.menuController.setMenuItems(_pageArray);
		$("#btn-next").on('click', function(){ Global.model.currentPageObject.pageposition=0; THIS.setPage(0); Global.menuController.setButtonStatus(); });	
		View.activeButton($("#btn-next"));
		View.buttonPulse($("#btn-next"));
		$("#btn-next").removeClass("offNavButtons");
	};
	this.resetCourse = function(){
		Global.controller.setPageArray("normal");
		Global.menuController.setMenuItems(_pageArray);
		for(var i=0,ii=Global.model.numberOfPages;i<ii;i++){
			Global.model.pages[i].setComplete(false);
			if(i>0){
				Global.model.pages[i].setAvailable(false);
			}else{
				Global.model.pages[i].setAvailable(true);
			}
		}
		Global.menuController.setButtonStatus();
		if(Global.model.scormInitialised){
			Global.scormController.sendProgress();
			Global.scormController.commit();
		}
	};	
	this.setBookmarkPopup = function(){
		View.launchBookmarkPopup("bookmark_pg1", "bookmark_bm");
		$("#bookmark_pg1").on('click', function(){
			Global.soundController.playDummy();
			View.clearContents();
			$("#bookmark_pg1, #bookmark_bm").off();
			Global.controller.setPage(0);
		});
		$("#bookmark_bm").on('click', function(){
			Global.soundController.playDummy();
			View.clearContents();
			$("#bookmark_pg1, #bookmark_bm").off();
			Global.controller.setPage(Global.model.scormBookmark);
		});
	};
};
Controllers.soundController = function(dummySrc){
	var THIS = this;
	var _src;
	var _dummySrc = dummySrc;
	var _trc;
	var _trcContent="";
	var _completetimer;
	var _completetime;
	var _pop;
	createjs.Sound.registerSound({id:"pop", src:"../common/commonassets/pop.mp3"});
	createjs.Sound.registerSound({id:"blank", src:"../common/commonassets/blank.mp3"});
			
	this.playSound = function(sound, page){			
		_src=undefined;
		for(var i=0,ii=page.manifest.length;i<ii;i++){		
			if(page.manifest[i].id===sound){
				_src=page.manifest[i].src;	
				break;
			}
		}
		if(_trc){
			for(i=0,ii=page.transcripts.length;i<ii;i++){
				if(page.transcripts[i].sound===sound){
					_trcContent=page.transcripts[i].text;	
					break;
				}
			}
			_trc.html(_trcContent);	
		}	
		if(_src!=undefined){
			createjs.Sound.play("blank");	
			createjs.Sound.stop(_src);
			clearTimeout(_completetimer);
			var instance = createjs.Sound.play(_src);
			instance.on("complete", THIS.resetDummyTimer);
			
		}	
	};
	this.resetDummyTimer = function(){
		clearTimeout(_completetimer);
		_completetimer = setTimeout(THIS.playDummy, 10000);			
	};
	this.playDummy = function(){
    	createjs.Sound.play("blank");
		THIS.resetDummyTimer();
	};
	this.playPop = function(){
		createjs.Sound.play("pop");	
	};
	this.stopSound = function(){
		createjs.Sound.stop(_src);
		THIS.resetDummyTimer();
	};
	this.activateTranscript = function(transcript, button, handle){
		_trc = $(transcript);
		var btn = $(button);
		var outer = _trc.parent();
		var thandle = $(handle);
		
		$(outer).append("<a id=\"close-transcript\" class=\"boxclose\"></a>");			
		$("#close-transcript").on('click', function(){ 
			$(outer).toggle();
		});
		var SX, SY, value = Global.model.zoom;
		var drag = new Draggable(outer, {
			trigger:thandle,
			onPress:function(){
				SX = this.x;
				SY = this.y;
				value = Global.model.zoom;	
			},
			onDrag:function(){
				if(!createjs.BrowserDetect.isFirefox){l
					var ratio = (1/value)-1;
					TweenMax.set(this.target,{ x:"+="+(this.x-SX)*ratio , y:"+="+(this.y-SY)*ratio });
				}
			}
		  });	
		$(btn).on('click', function(){ 
			TweenMax.set($("#transcript"),{ x:0, y:0 });	
			$(outer).toggle();
			
		});
		
	};
};
Controllers.menuController = function(){
	var _buttons=[];
	var _menuOpen = false;
	var _sly;
	this.setMenuOpen = function(t){
		_menuOpen = t;
	}
	this.getId = function(){
		return "holderwrap";	
	};
	this.setMenu = function(pages){	
		$("#holder").append("<div id=\""+this.getId()+"\" class=\"sliderwrap\"><h2>Module Menu</h2><div id=\"module-menu\"><ul id=\"module-menu-li\"></ul></div><div class=\"mscrollbar\"><div class=\"handle\"><div class=\"mousearea\"></div></div></div></div>");
		this.addCloseButton();
		this.setMenuItems(pages);
		var $frame = $('#module-menu');
		var $slidee = $frame.children('ul').eq(0);
		var $wrap = $frame.parent();
		_sly = new Sly($frame,{
			itemNav: 'basic',
			smart: 1,
			activateOn: 'click',
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: 1,
			startAt: 0,
			scrollBar: $wrap.find('.mscrollbar'),
			scrollBy: 1,
			speed: 300,
			elasticBounds: 1,
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,
		}).init();
		
		this.setButtonStatus();
		Global.model.addSidePanel(this);
	};
	this.setMenuItems = function(pages){
		_buttons=[];
		$("#module-menu-li").empty();
			
		for(var i=0,ii=pages.length;i<ii;i++){
			$("#module-menu-li").append("<li class=\"menu-item\"><a id=\"menu-link-"+i+"\">"+pages[i].title+"</a></li>");
			_buttons.push({link:"menu-link-"+i+"", page:pages[i] });
		}
		if(_sly){
			_sly.reload();
		}
		this.setButtonStatus();
	};
	this.addCloseButton = function(){
		$("#"+this.getId()).append("<a id=\"closeMenu\" class=\"sliderclose\">Close</a>");			
		TweenLite.set($("#closeMenu"),{x:240, y:10});
		$("#closeMenu").on('click', function(event){ Global.controller.closeSidePanels();});
	};
	this.setButtonStatus = function(){

		for(var i=0,ii=_buttons.length;i<ii;i++){
				$("#"+_buttons[i].link).removeClass();
				$("#"+_buttons[i].link).off();
			if(_buttons[i].page.completed){
				$("#"+_buttons[i].link).addClass("menu-item-completed");
			}
			if(_buttons[i].page.available){
				$("#"+_buttons[i].link).addClass("menu-item-available");	
			}else if(!_buttons[i].page.available){
				$("#"+_buttons[i].link).addClass("menu-item-unavailable");		
			}
		}
		$(".menu-item-available").on('click', function(e){		
			Global.menuController.toggleMenu();	
			var idSelected = e.currentTarget.getAttribute("id");
			var number = Number(idSelected.substr((idSelected.lastIndexOf("-") + 1)));
			Global.controller.setPage(number);		
		});
	};
	this.toggleMenu = function(){
		if(!_menuOpen){
			Global.controller.closeSidePanels()
			 _menuOpen=true;
			 TweenLite.to($("#holderwrap"), 0.3,{ width:300, zIndex:1000 });
			 //TweenLite.to($("#contents"), 0.3,{ x:300 });
			 
		}else{
			_menuOpen=false;
			Global.controller.closeSidePanels()
		}
	}
}
Controllers.glossaryController = function(){
	"use strict";
	var _terms=[];
	var _loaded=false;
	var _menuOpen = false;
	var _selected = null;
	var _button;
	this.setMenuOpen = function(t){
		_menuOpen = t;
	}
	this.getId = function(){
		return "glossarywrap";	
	};
	
	this.setGlossary = function(pages){
		$("#holder").append("<div id=\""+this.getId()+"\" class=\"sliderwrap\"></div>");
		Global.model.addSidePanel(this);
		this.addCloseButton();
	};
	this.handleXml = function (event){
		_loaded=true;
		$("#glossarywrap").append("<h2>Glossary</h2><div id=\"module-glossary\"><ul id=\"glossary-li\"></ul></div><div class=\"mscrollbar\"><div class=\"handle\"><div class=\"mousearea\"></div></div></div><div id=\"glossary-definition\"></div>");
		var res = event.result.documentElement;		
		
		var loaderitems = res.getElementsByTagName("heading");		
		for (var i=0,ii=loaderitems.length;i<ii;i++){		
			var na = loaderitems[i].getAttribute('name');
			var id = "gl-"+i;
			_terms.push(
				{
					id: id,
					term: na,
					definition: loaderitems[i].childNodes[0].nodeValue
				}
			);
			$("#glossary-li").append("<li class=\"menu-item \"><a id="+id+" class=\"glossary-item\" >"+na+"</a></li>");
			
		}
		$(".glossary-item").on("click", function(){
			_selected = this.getAttribute("id");
			for (i=0,ii=loaderitems.length;i<ii;i++){		
				if(_terms[i].id===_selected){
					$("#"+_terms[i].id).addClass("selected");
					$("#glossary-definition").html("<p><b>"+_terms[i].term+"</b><br /><br />"+_terms[i].definition+"</p>");
						
				}else{
					$("#"+_terms[i].id).removeClass("selected");
				}
			}
		});
		if(!_selected){
			$("#glossary-definition").html("<p><b>Glossary</b><br /><br />Select a term from the left</p>");
		}
		var $frame = $('#module-glossary');
		var $slidee = $frame.children('ul').eq(0);
		var $wrap = $frame.parent();
		$frame.sly({
			itemNav: 'basic',
			smart: 1,
			activateOn: 'click',
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: 1,
			startAt: 0,
			scrollBar: $wrap.find('.mscrollbar'),
			scrollBy: 1,
			speed: 300,
			elasticBounds: 1,
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,
		});
		
	};
	this.deactivateButton = function(){
		$(_button).off().addClass("offNavButtons");
	};
	this.activateButton = function(THIS){
		$(_button).off();
		$(_button).on('click', function(){ THIS.toggleMenu(); }).removeClass("offNavButtons");	
	};
	this.addButton = function(btn){
		_button=btn;	
	};
	this.addCloseButton = function(){
		$("#"+this.getId()).append("<a id=\"closeGloss\" class=\"sliderclose\">Close</a>");			
		TweenLite.set($("#closeGloss"),{x:640, y:10});
		$("#closeGloss").on('click', function(event){ Global.controller.closeSidePanels();});
	};
	this.toggleMenu = function(){
		if(!_menuOpen){			
			Global.controller.closeSidePanels()
			_menuOpen=true;
			TweenLite.to($("#glossarywrap"), 0.3,{ width:700, zIndex:1000 });
			//TweenLite.to($("#contents"), 0.3,{ x:700 });
			 
		}else{	
			 Global.controller.closeSidePanels()
			// TweenLite.to($("#glossarywrap"), 0.3,{ width:0, zIndex:0 })
			// TweenLite.to($("#contents"), 0.3,{ x:0 });
		}
	}
};
Controllers.helpController = function(){
	"use strict";
	var _terms=[];
	var _loaded=false;
	var _menuOpen = false;
	this.setMenuOpen = function(t){
		_menuOpen = t;
	}
	this.getId = function(){
		return "helpwrap";	
	};
	
	this.setHelp = function(pages){
		$("#holder").append("<div id=\""+this.getId()+"\" class=\"sliderwrap\"><h2>Help</h2></div>");
		$("#"+this.getId()).append('<img id="helppopupimage" src="../common/images/help.png" width="623" height="394" alt=""/>')
		Global.model.addSidePanel(this);
		this.addCloseButton();
	};
	this.activateButton = function(btn, THIS){
		$(btn).on('click', function(){ THIS.toggleMenu(); });	
	};
	this.addCloseButton = function(){
		$("#"+this.getId()).append("<a id=\"closeHelp\" class=\"sliderclose\">Close</a>");			
		TweenLite.set($("#closeHelp"),{x:640, y:10});
		$("#closeHelp").on('click', function(event){ Global.controller.closeSidePanels();});
	};
	this.toggleMenu = function(){
		if(!_menuOpen){			
			Global.controller.closeSidePanels()
			_menuOpen=true;
			TweenLite.to($("#helpwrap"), 0.3,{ width:700, zIndex:1000 });
			//TweenLite.to($("#contents"), 0.3,{ x:700 });
			 
		}else{	
			 Global.controller.closeSidePanels()
		}
	}
};
Controllers.scormController = function(){
	    var finishCalled = false;
		var autoCommit = false;
		var startDate;	
		var sessionTime;
		var bookmark;
		this.loadPage = function() {
			finishCalled = false;
			var result = LMSInitialize();
			Global.model.setCompletion(LMSGetValue( "cmi.core.lesson_status"));
			Global.model.setScormProgressString(this.getProgress());
			Global.model.setScormBookmark(this.getBookmark());
			
			Global.model.scormCompletion.toLowerCase();
			if (Global.model.scormCompletion === "not attempted") {
				Global.model.setCompletion("incomplete");
				this.sendCompletion();
				LMSCommit();
			}
			startTimer();
			if(result) return true;
			return false;
		};
		
		function startTimer() {
		  startDate = new Date().getTime();
		}
		
		function computeTime() {
		 var formattedTime;
		  if ( startDate != 0 ) {
			var currentDate = new Date().getTime();
			var elapsedMills = currentDate - startDate;
			formattedTime = convertTotalMills( elapsedMills );
		  }
		  else formattedTime = "00:00:00.0";
		  LMSSetValue("cmi.core.session_time",formattedTime);
		}
		this.doQuit = function(){
		  if(!finishCalled){
			  computeTime();
		 	  var result = LMSCommit();
		  	  finishCalled = true;
		  	  result = LMSFinish(); 
		  }
		  
		}
		
		this.sendScore = function(variable){
			LMSSetValue("cmi.core.score.raw", variable);
		}
		this.sendProgress = function(){
			var array = getProgressArray();
			LMSSetValue("cmi.suspend_data", array);	
		}
		this.sendBookmark = function(page){
			LMSSetValue( "cmi.core.lesson_location", page);
		}
		this.sendCompletion = function(){
			LMSSetValue("cmi.core.lesson_status", Global.model.scormCompletion);	
		}
		this.getProgress = function(){
			var data = LMSGetValue( "cmi.suspend_data");
			return	data;	
		}
		this.getBookmark = function(){
			var data=LMSGetValue("cmi.core.lesson_location");
			return Number(data);	
		}
		this.commit = function(){
			return LMSCommit();
		}
		function convertTotalMills(ts) {
		  var Sec  = 0;
		  var Min  = 0;
		  var Hour = 0;
		  while( ts >= 3600000 ) {
			Hour += 1;
			ts -= 3600000;
		  }
		  while( ts >= 60000 ){
			Min += 1;
			ts -= 60000;
		  }
		  while ( ts >= 1000 ){
			Sec += 1;
			ts -= 1000;
		  }
		  if (Hour < 10) Hour = "0"+Hour;
		  if (Min < 10) Min = "0"+Min;
		  if (Sec < 10) Sec = "0"+Sec;
		  var rtnVal = Hour+":"+Min+":"+Sec;
		  return rtnVal;
		}
		function getProgressArray(){
			var string = "";
			for(var i=0;i<Global.model.numberOfPages;i++){
				if(Global.model.pages[i].completed){ 
					string+="1"; 
				}else{ 
					string+="0";
				}
				if(i<Global.model.numberOfPages-1){
					string+=",";	
				}
			}
			return string;
		}
		
};;// JavaScript Document
var View = View || {};

View.clearContents = function(fade){
	"use strict";
	var _fade = (fade!=null || fade!=undefined)?fade:false;
	var holder = document.getElementById("stage");
	if(!_fade){		
		while (holder.firstChild) {
			holder.removeChild(holder.firstChild);
		}	
	}else{
	
		for(var i=0,ii=holder.childNodes.length;i<ii;i++){
			TweenLite.to(holder.childNodes[i], 0.25, {autoAlpha:0});	
		}
	}	
};
View.launchPage = function (p){
	"use strict";
	var holder = document.getElementById("stage");
	for(var i=0,ii=p.activities.length;i<ii;i++){
		if(p.activities[i].pageNumber == p.pageposition){
			Factory.activityStore.createActivity(p.activities[i].name, p, holder);
		}
	}
	if((p.pagexml[p.pageposition].getAttribute("sound")!=null || p.pagexml[p.pageposition].getAttribute("sound")!=undefined) && p.pagexml[p.pageposition].getAttribute("noSoundHTML")!=="true"){
		Global.soundController.playSound(p.pagexml[p.pageposition].getAttribute("sound"), p);
	}
	
		
};
View.setPageNumber = function(p){
	var pn;
	if(!Global.model.getAfterAssessment()){
		pn = Global.model.numberOfPages;
	}else{	
		pn = Global.model.secondAttemptNumberOfPages;
	}
	$("#pagenumber").html(Global.model.pageOn+1+" / "+pn);
	View.editPageTitle(p.title);
};
var Factory = Factory || {};
Factory.activityStore = {
	createActivity: function(type, pageObject, holder){
		switch(type){
			case "Image":
				var actObject = new Activities.ImageActivity();
				actObject.buildActivity(pageObject, holder);
			break;	
			case "Bullets":
				var actObject = new Activities.BulletActivity();
				actObject.buildActivity(pageObject, holder);
			break;
			case "AddText":
				var actObject = new Activities.TextActivity();
				actObject.buildActivity(pageObject, holder);
			break;
			case "ActivityText":
				var actObject = new Activities.ActivityText();
				actObject.buildActivity(pageObject, holder);
			break;
			case "ClickRevealStandard":
				var actObject = new Activities.ClickReveal();
				actObject.buildActivity(pageObject, holder);
			break;
			case "DefinitionMatcher":
				var actObject = new Activities.DefinitionMatcher();
				actObject.buildActivity(pageObject, holder);
			break;
			case "DragFromScrollerIntoList":
				var actObject = new Activities.DragFromScrollerIntoList();
				actObject.buildActivity(pageObject, holder);
			break;
			case "SelectItems":
				var actObject = new Activities.SelectItems();
				actObject.buildActivity(pageObject, holder);
			break;
			case "Assessment":
				var actObject = new Activities.Assessment();
				actObject.buildActivity(pageObject, holder);
				Global.controller.deactivateNav();

			break;
			case "DragDropToTargets":
				var actObject = new Activities.DragDropToTargets();
				actObject.buildActivity(pageObject, holder);
			break;
			case "Crossword":
				var actObject = new Activities.Crossword();
				actObject.buildActivity(pageObject, holder);
			break;
			case "QuestionSeriesWithResponse":
				var actObject = new Activities.QuestionSeriesWithResponse();
				actObject.buildActivity(pageObject, holder);
			break;
			case "DragDropIntoList":
				var actObject = new Activities.DragDropIntoList();
				actObject.buildActivity(pageObject, holder);
			break;
			case "LinkLists":
				var actObject = new Activities.LinkLists();
				actObject.buildActivity(pageObject, holder);
			break;
			case "ScenarioSeriesWithSelectionBtns":
				var actObject = new Activities.ScenarioSeriesWithSelectionBtns();
				actObject.buildActivity(pageObject, holder);
			break;
			case "RadioButtons":
				var actObject = new Activities.RadioButtons();
				actObject.buildActivity(pageObject, holder);
			break;
			case "OrderItems":
				var actObject = new Activities.OrderItems();
				actObject.buildActivity(pageObject, holder);
			break;
			case "DragFromScrollerAnimated":
				var actObject = new Activities.DragFromScrollerIntoListAnimated();
				actObject.buildActivity(pageObject, holder);
			break;
			case "Video":
				var actObject = new Activities.Video();
				actObject.buildActivity(pageObject, holder);
			break;
			
		}
	}
}
View.addCourseTitle = function(){
	$("#shelltop").prepend("<h1 id=\"courseTitle\">"+Global.model.courseTitle+"</h1>");	
	$("#shelltop").prepend("<h2 id=\"pageTitle\"></h2>")
}
View.editPageTitle = function(t){
	$("#pageTitle").text(t);
}
View.activeButton = function(btn){
	"use strict";
	
	if(!btn.hasClass("active")){
		btn.addClass("active");
			
	}
	if(btn.hasClass("inactive")){
		btn.removeClass("inactive");
	}
	
};
View.inactiveButton = function(btn){
	"use strict";
	if(!btn.hasClass("inactive")){
		btn.addClass("inactive");
	}
	if(btn.hasClass("active")){
		btn.removeClass("active");
	}
};
View.buttonPulse = function(btn){
	"use strict";
	var tn1 = TweenMax.to(btn, 0.6, {boxShadow:'0px 0px 1px 1px rgb(168,255,164)', repeat:-1, yoyo:true, ease:Linear.easeNone, paused:true});	
	tn1.play();
	
	btn.on('mouseleave', function()
	{
	  tn1.play();
	});
	btn.on('mouseenter', function()
	{
	  var currentTime = tn1.time();
	  tn1.reverse(currentTime);
	});
	Global.model.currentPageObject.addToReset(tn1);
};
View.resizeView = function(){
	//TweenLite.set($("#holder"), {zoom: Global.model.zoom});
	$("#holder").css({"zoom":Global.model.zoom, "-moz-transform": "scale("+Global.model.zoom+")"});
};
View.launchBookmarkPopup = function(noid, yesid){
	var popup = new Helpers.popup();
		popup.setName("bookmark_popup");
		popup.setClosebtn(false);
		popup.setWidth(500);
		popup.setHeight(200);
		popup.addToStage($("#stage"));	
		$("#"+popup.name).append("<h3 style='text-align:center; margin:30px auto;'>Would you like to continue the course where you left off?</h3>");
			
		var b = new Helpers.Button("Yes");
		b.setWidth(200);		
		b.setId(yesid);
		b.drawButton("#bookmark_popup");			
		var bx = popup.width - 220;
		var by = popup.height - 50;
			
		TweenLite.set($("#"+yesid),{ left: bx, top: by});
		
		var b2 = new Helpers.Button("No");
		b2.setWidth(200);		
		b2.setId(noid);
		b2.drawButton("#bookmark_popup");			
		var b2x = 20;
		var b2y = popup.height - 50;
			
		TweenLite.set($("#"+noid),{ left: b2x, top: b2y});
		
};

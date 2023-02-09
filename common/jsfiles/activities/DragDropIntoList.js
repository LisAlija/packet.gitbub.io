// JavaScript Document
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
};
// JavaScript Document
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

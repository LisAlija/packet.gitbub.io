// JavaScript Document
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
};
// JavaScript Document
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
					width: statements[i].getAttribute("width")
				}
			)
		}	
		placeText();
	}	
	function placeText(){
		for(var i=0,ii=_statements.length;i<ii;i++){
			$(_holder).append("<p id=\"bu-"+_prefix+"-"+i+"\" class=\"bullet\">"+_statements[i].text+"</p>");
			TweenLite.set($("#bu-"+_prefix+"-"+[i]), {left:_statements[i].x, top:_statements[i].y-10, width:_statements[i].width, opacity: 0});	
			var f = TweenLite.to($("#bu-"+_prefix+"-"+[i]), 0.5, {delay:_statements[i].delay, left:_statements[i].x, top:_statements[i].y, opacity: 1});		
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
				TweenLite.set($("#"+_items[i].id), {left:_items[i].x - 2000, top:_items[i].y-10, width:550, opacity: 0, skewX:40});	
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
				finishx: (draggers.getAttribute("finishx"))?Number(draggers.getAttribute("finishx")):undefined,
				finishy: (draggers.getAttribute("finishy"))?Number(draggers.getAttribute("finishy")):undefined,
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
		}
		shuffleYs();
		placeTargets();
		placeDraggers();
		var t = new TweenMax.delayedCall(_options.delay, revealAndActivate);
		_pageObject.addToReset(t);
	};
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
				_draggers[i].imageobj = Helpers.addImage(_draggers[i].image, _pageObject.images, _holder);
				TweenLite.set(_draggers[i].imageobj.pic, {position: "absolute", x: _draggers[i].x, y: _draggers[i].y, opacity:0});
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
						if(this.hitTest($("#"+_draggers[i].target.id), overlap)){
							if(_draggers[i].finishx){
								var t = TweenLite.to($("#"+id), 0.5,{ x:_draggers[i].finishx, y:_draggers[i].finishy, width:_draggers[i].scalex * _draggers[i].width, height:_draggers[i].scaley * _draggers[i].height},0);
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
			if(!_draggers[i].landed){
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
			$(holder).append("<p class=\"draggertitle\" id=\"draggertitle-"+i+"\">"+_draggers[i].title+"</p>");
			
			TweenLite.set($("#draggertitle-"+i), {padding:0, margin:0});		
			_largestIconWidth = (_draggers[i].image && (_draggers[i].image.pic.width > _largestIconWidth)) ? _draggers[i].image.pic.width : _largestIconWidth;		
		}
		for(i=0;i<_numberofdraggers;i++){
			var holder = $("#"+_prefix+"-drag-"+i+"-ic"+" .iconbox-inner");
			var y = Helpers.verticalAlignImage(_draggers[i].image, holder);
			TweenLite.set(_draggers[i].image.pic, {top: y, left:10});
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
					var b = TweenLite.to(icon, 0.3, {width:iwidth, top:2, left:5});
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
};
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
		placeTargets();
		placeDrags();
		revealAndActivate();
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
Activities.DragFromScrollerIntoListAnimated = function(){	
	var _base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _prefix;
	var _scroller;
	var _targets;
	var _numberoftargets;
	var _draggers;
	var _numberofdraggers;
	var _largestIconWidth = 0;
	var _sly;
	var _draggables=[];
	var _selectedDragger;
	var _bHeight;
	var _popup;
	var tl;
	var _draggerOn=0;
	var _scopes=[];
	var _animationDelay=0;
	var _inlineGap=0;
	var _hazards=[];
	var _smallImageMaxWidth;
	var _smallMaxHeight;
	
	this.buildActivity = function(pageObject, holder){
		_base = new Activities.base();
		_pageObject = pageObject;
		_holder = holder;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		tl = new TimelineLite();
		_pageObject.addToReset(tl);	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("selectOptions")[0];		
		_bHeight = Number($(xmlcontent).children("buttonheight") > 0) ? Number($(xmlcontent).children("buttonheight")[0].firstChild.nodeValue) : 50;
		_animationDelay = ($(xmlcontent).children("animationDelay")) ? Number($(xmlcontent).children("animationDelay")[0].firstChild.nodeValue) : 0;
		_inlineGap = ($(xmlcontent).children("inlineGap")) ? Number($(xmlcontent).children("inlineGap")[0].firstChild.nodeValue) : 5;
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
					numberOn:0
				}
			);
			var tfbxml = (targets[i].getElementsByTagName("FB"))?targets[i].getElementsByTagName("FB")[0]:undefined;					
			if(tfbxml){
				var tfb = {
					width: Number(tfbxml.getAttribute("width")),
					height: Number(tfbxml.getAttribute("height")),
					x: Number(tfbxml.getAttribute("x")),
					y: Number(tfbxml.getAttribute("y")),
					bgVisible: (tfbxml.getAttribute("bgVisible") !== "no") ? true : false,
					closeButton: (tfbxml.getAttribute("closeBtn") !== "no") ? true : false,
					tickCross: (tfbxml.getAttribute("tickCross") === "yes") ? true : false,
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
					maxPosition: 0,
					inlineGap:0,
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
			var hOn = 0;
			if(_draggers[i].correctTarget==="1"){
				_hazards.push({hazard: _draggers[i], followers:[]});
			}else{
				_hazards[_hazards.length-1].followers.push(_draggers[i]);
			}
		}
		setPositions();
	
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
	
	
	function setPositions(){
		var h = (_smallMaxHeight)?_smallMaxHeight:_bHeight;
		_hazards[0].finalY = Number(_hazards[0].hazard.target.y) + Number(_hazards[0].hazard.target.toppadding);
		for(var i=0,ii=_hazards.length;i<ii;i++){
			_hazards[i].inlineGap = (_inlineGap);
			_hazards[i].maxPosition = 0;
			
			for(var a=0,aa=_hazards[i].followers.length;a<aa;a++){
				_hazards[i].followers[a].inlineGap = _hazards[i].hazard.inlineGap;
				if(a>0 && _hazards[i].followers[a-1].correctTarget === _hazards[i].followers[a].correctTarget){
					_hazards[i].followers[a].positionInHazardList = _hazards[i].followers[a-1].positionInHazardList + 1;
				}else{
					_hazards[i].followers[a].positionInHazardList = 0;
				}
				if(a>0 && _hazards[i].followers[a].positionInHazardList>_hazards[i].maxPosition){
					_hazards[i].maxPosition = _hazards[i].followers[a].positionInHazardList;
				}
			}
			
			if(i>0){
				_hazards[i].finalY = _hazards[i-1].finalY + _hazards[i].inlineGap + ((_hazards[i-1].maxPosition + 1) * (h + 2));
				
			}
			_hazards[i].hazard.finalY = _hazards[i].finalY;
			for(var a=0,aa=_hazards[i].followers.length;a<aa;a++){
				_hazards[i].followers[a].finalY = _hazards[i].finalY + (_hazards[i].followers[a].positionInHazardList * (h + 2));
			}
		}	
		
	}

	function placeLists(){
		tl2 = new TimelineLite();
		_pageObject.addToReset(tl2);	
		for(var i=0;i<_numberoftargets;i++){	
			var li = new Helpers.listBox();
			li.setId(_targets[i].id);
			li.setHeight(_targets[i].height);
			li.setWidth(_targets[i].width);
			li.setTextColour(_targets[i].textcolour);
			li.drawBox(_holder);	
			$("#"+_targets[i].id).append("<p class=\"list-box-heading\">"+_targets[i].title+"</p>");
			TweenLite.set($("#"+_targets[i].id), {top: _targets[i].y, left: _targets[i].x, opacity:0});
			tl2.to($("#"+_targets[i].id), 0.5,{ opacity:1}, "0.5");
		}
	}
	function placeDrags(){
		
		_scroller.id = _prefix+"-dr-scroller";
		var innerid = "scrollholder"+_prefix;
		var ulid = "scrollulvert"+_prefix;
		
		_scroller.id = _prefix+"-dr-scroller";
		$(_holder).append("<div id=\""+_scroller.id+"\" class=\"wrap\"><div class=\"scrollbar\"><div class=\"handle\"></div></div><div id=\""+innerid+"\" class=\"frame oneperframe\ style=\"overflow: hidden\"><ul id=\""+ulid+"\" class=\"slidee\"></ul></div></div></div>");
		
		TweenLite.set($("#"+_scroller.id), {top: _scroller.y, left: _scroller.x, width: _scroller.width, height: _scroller.height, opacity:0});
		
		for(var i=0;i<_numberofdraggers;i++){
			_draggers[i].id = _prefix+"-drag-"+i;
			$("#"+ulid+"").append("<li><div class=\"icon-ind-holder\" id=\""+_prefix+"icon-ind-holder-"+i+"\"></div></li>");
			
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
			$(holder).append("<p class=\"draggertitle\" id=\""+_prefix+"draggertitle-"+i+"\">"+_draggers[i].title+"</p>");
			
			TweenLite.set($("#"+_prefix+"draggertitle-"+i), {padding:0, margin:0});		
			_largestIconWidth = (_draggers[i].image && (_draggers[i].image.pic.width > _largestIconWidth)) ? _draggers[i].image.pic.width : _largestIconWidth;		
		}
		for(i=0;i<_numberofdraggers;i++){
			var holder = $("#"+_prefix+"-drag-"+i+"-ic"+" .iconbox-inner");
			var y = Helpers.verticalAlignImage(_draggers[i].image, holder);
			TweenLite.set(_draggers[i].image.pic, {top: y, left:10});
			TweenLite.set($("#"+_prefix+"draggertitle-"+i), {left: _largestIconWidth+10, margin:"0 5px"});
			var e = Helpers.verticalAlignText($("#"+_prefix+"draggertitle-"+i), $("#"+_prefix+"draggertitle-"+i).parent());
			TweenLite.set($("#"+_prefix+"draggertitle-"+i), {top: e});
			
		}
		
		
		TweenLite.set($(".frame .slidee li"), {width: _scroller.width});
			var $frame  = $('#'+innerid+'');
			var $wrap   = $frame.parent();
			
		// Call Sly on frame
		_sly = new Sly($frame,{
			horizontal: 1,
			itemNav: 'forceCentered',
			smart: 1,
			activateMiddle: 1,
			mouseDragging: 0,
			touchDragging: 0,
			releaseSwing: 1,
			startAt: 0,
			scrollBar: $wrap.find('.scrollbar'),
			scrollBy: 1,
			speed: 300,
			elasticBounds: 1,
			//easing: 'easeOutExpo',
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,

		}).init();
			
		$(_holder).append("<a id=\""+_prefix+"-scrollleft\" class=\"scrollerleft scrollcontrol\"><div class=\"arrow-left\"></div></a>");
		$(_holder).append("<a id=\""+_prefix+"-scrollright\" class=\"scrollerright scrollcontrol\"><div class=\"arrow-right\"></div></a>");
		
		TweenLite.set($("#"+_prefix+"-scrollleft"), {height: _scroller.height-20, left:_scroller.x-35, top: _scroller.y+23});
		TweenLite.set($("#"+_prefix+"-scrollright"), {height: _scroller.height-20, left: _scroller.x+_scroller.width+10,  top: _scroller.y+23});
		
		var y1 = ($("#"+_prefix+"-scrollleft").height() /2) - 10;
				
		TweenLite.set($(".scrollcontrol div"), {top:y1, left:3});
		
		$("#"+_prefix+"-scrollright").on('click', function(){
			_sly.next();
		});
		$("#"+_prefix+"-scrollleft").on('click', function(){
			_sly.prev();
		});
		tl2 = new TimelineLite();
		_pageObject.addToReset(tl2);	
		tl2.to($("#"+_scroller.id), 0.3,{ opacity:1});
		activateDrags();
		
	}
	
	function activateDrags(){	
		$(_draggers).each(function(){
			var that = this;
			var element = $(this.drag.children()[0]);
			var wrapper = element.parent().parent();
			var offset = element.position();
			var scope = {
				wrapper: wrapper,
				clone: element.clone().addClass("clone").prependTo(_holder),
				element: element,
				width: wrapper.outerWidth(),
				dropped: false,
				moved: false,
				dragger: that,
				get x() { return getPosition(wrapper, offset).x; },
				get y() { return getPosition(wrapper, offset).y; }
				
			};
			_scopes.push(scope);
		});	
		startDraggable(_scopes[_draggerOn]);	
	}
	
	function startDraggable(dr){
		var h = (_smallMaxHeight)?_smallMaxHeight:_bHeight;
		_selectedDragger = dr.dragger;
		var draggerId = _selectedDragger.dragObj.getId();
		var draggerIn = $("#"+draggerId+" .iconbox-inner");
		var icon = draggerIn.children(["img"])[0];
		var text = draggerIn.children(["p"])[1];
		var iconwidth = $(icon).width();
		var iconheight = $(icon).height();
		
		var scale = (_bHeight-5) / iconheight;
		var iconScale = (_smallImageMaxWidth && (scale * iconwidth > _smallImageMaxWidth))?_smallImageMaxWidth / iconwidth : scale;
		var iwidth = iconwidth * iconScale;
		
		TweenLite.set(dr.element, { autoAlpha: 0 });
		TweenLite.set(dr.clone, { zIndex:1000,  x: dr.x, y: dr.y, autoAlpha: 1});
		var t = TweenLite.to(dr.clone, 2, { x: dr.dragger.target.x, y:dr.dragger.finalY, onComplete:fixText, onCompleteParams:[dr], height:h, overflow:"hidden", width:dr.dragger.target.width-5});
		TweenLite.to(icon, 2, {width:iwidth, top:2, left:5});
		var textx = (iconScale * iconwidth)+5;
		TweenLite.to(text, 2, {left:textx, width:dr.dragger.target.width-75, top:5, fontSize:13});
		_pageObject.addToReset(t);	
		dr.dragger.dragObj.removeBg(_holder, 2, dr.dragger.target.width-5, _bHeight);
		dr.dragger.target.targetOn++;
		TweenLite.to(dr.wrapper, 0.3, { width: 0});	
       }
	
	
	
	
	
	
	function fixText(dr){
		
		var draggerId = dr.dragger.dragObj.getId();
		var dragger = $("#"+draggerId);
		var draggerIn = $("#"+draggerId+" .iconbox-inner");
		dr.complete = true;
		var className;
		
		$(_selectedDragger.drag.parent()).remove();
		
		className = "+=dropped";
		dr.dragger.complete=true;
		dr.dragger.target.numberOn++;
		dr.moved = true;
        var e = TweenLite.to(dr.wrapper, 0.3, { width: 0});	
		_pageObject.addToReset(e);
		var icon = draggerIn.children(["img"])[0];
		var text = draggerIn.children(["p"])[1];

				    
		//TweenLite.to(dragger, 0.3, {height:_bHeight, width:dr.dragger.target.width-5, overflow:"hidden"});
		
		//TweenLite.to(text, 0.3, {left:70, width:dr.dragger.target.width-75, top:0, fontSize:14});
		
		var h = (_smallMaxHeight)?_smallMaxHeight:_bHeight;
					var theight = $(text).height();
					var d = TweenLite.to(text, 0.1, {top:(h-theight)/2});
					_pageObject.addToReset(d);
									
		resetScroll();		
		if(checkComplete()){
			_base.setToComplete();
		}else{
			next();
		}
	}
	function next(){
		_draggerOn++;
		startDraggable(_scopes[_draggerOn]);	
	}
	function resetScroll(){
		_sly.reload();
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
};;Activities.QuestionSeriesWithResponse = function(){	
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
};
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
	
}
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
	}
	this.setZoom = function(val){
		if (val){
			this.zoom = val;	
		}else{
			var w = window.innerWidth;
			var h = window.innerHeight;
			
			var ratio = ((1009 * (h/661))<= w)?(h/662):(innerWidth/1009);
			this.zoom = ratio;
			
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
			resizeView();
		$(window).resize(function(){
			resizeView();
		});
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
					loadQueue(Global.model.pages[f], Global.model.pages[f]);		
				}
			}
			
			
		}
	}
	function loadQueue(page, manifest){	
				if(page.queue){
					page.queue.loadManifest(manifest);
					THIS._loading=true;
				}else{
					setTimeout(function(){loadQueue(page, manifest);}, 500);
				}
			}
	function findFirstRequiredLoader(){
				if(Global.model.pages[Global.model.pageOn] && !Global.model.pages[Global.model.pageOn].loaded){
					return Global.model.pageOn;
				}else if(Global.model.pages[Global.model.pageOn+1] && !Global.model.pages[Global.model.pageOn+1].loaded){
					return Global.model.pageOn+1;
				}
				/*for (i=0;i<Global.model.numberOfPages;i++){
					if(!Global.model.pages[i].loaded){
						return i;
					}
				}*/
				return false;
			}
	this.setPageArray=function(attemptPlace){
		var _attemptPlace = (attemptPlace)?attemptPlace:"normal";
		switch(_attemptPlace){
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
		if(page===0){
			Global.soundController.playDummy();	
		}
		
		
		//show preloader
		var interval;
		if(!p.loaded){		
			if(p.percentLoaded===0){
				$("#stage").append("<p id=\"preloader\">Fetching page information</p>");
				Global.controller.chooseLoader();
			}else{		
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
				continueBtn.setId("shell_continue_page");
				continueBtn.setText(Global.model.currentPageObject.continueBtn[Global.model.currentPageObject.pageposition].text);
				continueBtn.drawButton($("#stage"));
				TweenLite.set($("#shell_continue_page"),{ left: Global.model.currentPageObject.continueBtn[Global.model.currentPageObject.pageposition].x, top: Global.model.currentPageObject.continueBtn[Global.model.currentPageObject.pageposition].y});
				$("#shell_continue_page").on("click",function(){
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
;// JavaScript Document
var Global = Global || {};	
var Beginning = Beginning || {};
Beginning.flash = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' width='100%' height='100%' id='Food Safety Level 3' align='middle'><param name='movie' value='../shell_as3.swf'/><object type='application/x-shockwave-flash' data='../shell_as3.swf' width='100%' height='100%'><param name='movie' value='../shell_as3.swf'/><a href='http://www.adobe.com/go/getflash'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a></object></object>"

Beginning.html = "<div id='holder'><div id='contents'><div id='shelltop'></div><div id='stage'></div><a id='closebtn' class='btn sae-btn'>Save & Exit</a><a id='btn-glossary' class='nav-btn'>Glossary</a><a id='btn-menu' class='nav-btn nav-btn-2left-corners'>Menu</a><a id='btn-help' class='nav-btn nav-btn-2right-corners'>Help</a><a id='btn-transcript' class='nav-btn nav-btn-2left-corners'>Transcript</a><a id='btn-replay' class='nav-btn nav-btn-2right-corners'><img src='../common/images/replay.png' width='20' height='20' alt=''/></a><a id='btn-prev' class='nav-btn nav-btn-4-corners'><img src='../common/images/leftarrow.png' width='17' height='20' alt=''/>Prev</a><p id='pagenumber'></p><a id='btn-next' class='nav-btn nav-btn-4-corners'>Next<img src='../common/images/rightarrow.png' width='17' height='20' alt=''/></a><div id='transcript'><div class='transcript_header'><h4 id='transcript_handle'>Transcript</h4></div><div id='transcript-inner'></div></div></div></div>"

$(document).ready(function(e) {	
	function detectOldIe(){
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}
		
		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}
		
		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
		// IE 12 => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}
		
		// other browser
		return false;
		}
	
	if(createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isChrome || createjs.BrowserDetect.isFirefox){
		loadHtml();
	} else{
		if(detectOldIe() && detectOldIe()<11){ 
			loadFlash();
		}else{
			loadFlash();
		}
	}
	
	function loadHtml(){
		$("body").append(Beginning.html);
		Global.model = new Models.global();
		Global.controller = new Controllers.master();
		Global.soundController = new Controllers.soundController();
		Global.soundController.activateTranscript("#transcript-inner", "#btn-transcript", ".transcript_header" );
		Global.menuController = new Controllers.menuController();
		Global.controller.begin();
		Global.controller.loadGlossary();
		Global.controller.loadHelp();
		if(Global.model.scormInitialised){
			$(window).unload(Global.scormController.doQuit);
		}
	}
	
	function loadFlash(){
		$("body").append(Beginning.flash).unload(closeCourse);
		$(window).unload(closeCourse);
		startCourse();
	}
});	
// JavaScript Document
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
};
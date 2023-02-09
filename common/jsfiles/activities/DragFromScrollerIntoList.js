// JavaScript Document
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
};
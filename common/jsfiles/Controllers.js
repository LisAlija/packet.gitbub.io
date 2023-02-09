// JavaScript Document
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
		
};
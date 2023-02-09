// JavaScript Document
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
};
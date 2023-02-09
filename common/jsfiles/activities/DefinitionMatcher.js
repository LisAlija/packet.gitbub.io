// JavaScript Document
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
};
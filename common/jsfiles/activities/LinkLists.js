Activities.LinkLists=function(){
	"use strict";
	var _base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _prefix;
	var _targets =[];
	var _numberoflefts;
	var _draggers = [];
	var _checkAnswerContent;
	var _checkButton;
	var _numberofrights;
	var _draggables=[];
	var _bHeight;
	var _options;
	var _popup;
	var _lefts=[];
	var _rights=[];
	var tl;
	var _leftObjectSelected;
	var _usersAnswers=true;
	var _afterCheck = false;
	var _started = false;
	
	this.buildActivity = function(pageObject, holder){
		CSSPlugin.defaultTransformPerspective=500;
		_base = new Activities.base();
		_pageObject = pageObject;
		_holder = holder;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		tl = new TimelineLite();
		_pageObject.addToReset(tl);	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("linkOptions")[0];		
		
		_options = {
			delay: xmlcontent.getAttribute("delay"),
			delayActivation: xmlcontent.getAttribute("delayactivation"),
			shuffle: (xmlcontent.getAttribute("shufflepositions") === "Yes")?true:false,
			leftBtnHeights: Number(xmlcontent.getElementsByTagName("linkfrombuttonheight")[0].firstChild.nodeValue),
			leftBtnWidths: Number(xmlcontent.getElementsByTagName("linkfrombuttonwidth")[0].firstChild.nodeValue),
			leftX: Number(xmlcontent.getElementsByTagName("linkfromx")[0].firstChild.nodeValue),
			leftY: Number(xmlcontent.getElementsByTagName("linkfromy")[0].firstChild.nodeValue),
			leftPadding: Number(xmlcontent.getElementsByTagName("linkfrompadding")[0].firstChild.nodeValue),
			leftBtnColour: Helpers.convertColour(xmlcontent.getElementsByTagName("linkfrombg")[0].firstChild.nodeValue),
			leftBtnRollOver: Helpers.convertColour(xmlcontent.getElementsByTagName("linkfromrollbg")[0].firstChild.nodeValue),
			leftBtnSelected: Helpers.convertColour(xmlcontent.getElementsByTagName("linkfromselectedbg")[0].firstChild.nodeValue),
			leftBtnFontColour: Helpers.convertColour(xmlcontent.getElementsByTagName("linkfromtextcolour")[0].firstChild.nodeValue),
			rightBtnHeights: Number(xmlcontent.getElementsByTagName("linktobuttonheight")[0].firstChild.nodeValue),
			rightBtnWidths: Number(xmlcontent.getElementsByTagName("linktobuttonwidth")[0].firstChild.nodeValue),
			rightX: Number(xmlcontent.getElementsByTagName("linktox")[0].firstChild.nodeValue),
			rightY: Number(xmlcontent.getElementsByTagName("linktoy")[0].firstChild.nodeValue),
			rightPadding: Number(xmlcontent.getElementsByTagName("linktopadding")[0].firstChild.nodeValue),
			rightBtnColour: Helpers.convertColour(xmlcontent.getElementsByTagName("linktobg")[0].firstChild.nodeValue),
			rightBtnRollOver: Helpers.convertColour(xmlcontent.getElementsByTagName("linktorollbg")[0].firstChild.nodeValue),
			rightBtnSelected: Helpers.convertColour(xmlcontent.getElementsByTagName("linktoselectedbg")[0].firstChild.nodeValue),
			rightBtnFontColour: Helpers.convertColour(xmlcontent.getElementsByTagName("linktotextcolour")[0].firstChild.nodeValue),
			allneeded:(xmlcontent.getElementsByTagName("linkfromx")[0].firstChild.nodeValue === "true")?true:false,
			needtoviewfeedback:(xmlcontent.getElementsByTagName("needtoviewfeedback")[0].firstChild.nodeValue === "false")?false:true
		};
		var gap = (_options.rightX-_options.leftX - _options.leftBtnWidths);
		_options.leftSelectedX = _options.leftX + (gap/3);
		_options.rightSelectedX = _options.rightX - (gap/3);
		var caxml = xmlcontent.getElementsByTagName("checkanswerinstructions")[0];
		_checkAnswerContent = {
			x:Number(caxml.getAttribute("x")),
			y:Number(caxml.getAttribute("y")),
			width:Number(caxml.getAttribute("width")),
			sound:caxml.getAttribute("sound"),
			text: caxml.firstChild.nodeValue
		};
		_checkAnswerContent.text = _checkAnswerContent.text.replace('Roll your mouse over','Click on');
		_checkAnswerContent.text = _checkAnswerContent.text.replace('Roll your cursor over','Click on');
	
		var cab = xmlcontent.getElementsByTagName("checkanswerbutton")[0];
		_checkButton = {
			x:cab.getAttribute("x"),
			y:cab.getAttribute("y"),
			text: cab.firstChild.nodeValue,
			colour:Helpers.convertColour(cab.getAttribute("colour")),
			rocolour:Helpers.convertColour(cab.getAttribute("rocolour"))
		};
		var rightxml = xmlcontent.getElementsByTagName("linkto");
		
		_numberofrights = rightxml.length;
		for(var i=0,ii=_numberofrights;i<ii;i++){
			_rights.push({
				text:rightxml[i].firstChild.nodeValue,
				id: rightxml[i].getAttribute("linkid"),
				tcid: "tc_"+i,
			});
		}	
		var leftxml = xmlcontent.getElementsByTagName("linkfrom");
		_numberoflefts = leftxml.length;
		(function (){
			for(var i=0,ii=_numberoflefts;i<ii;i++){		
				var left = {
					text:leftxml[i].getElementsByTagName("link")[0].firstChild.nodeValue,
					correctLinkIds: leftxml[i].getElementsByTagName("link")[0].getAttribute("linkedto").replace(/ /g,'').split(","),
					correctLinks:[], 
					incorrectLinks:[],
					userLinked:[],
					feedbackSeen:false,
				};
				if(leftxml[i].getElementsByTagName("feedback")[0]){
					var fb = {
						x: Number(leftxml[i].getElementsByTagName("feedback")[0].getAttribute("x")),
						y: Number(leftxml[i].getElementsByTagName("feedback")[0].getAttribute("y")),
						height: Number(leftxml[i].getElementsByTagName("feedback")[0].getAttribute("height")),
						width: Number(leftxml[i].getElementsByTagName("feedback")[0].getAttribute("width")),
						sound: leftxml[i].getElementsByTagName("feedback")[0].getAttribute("sound"),
						text: leftxml[i].getElementsByTagName("feedback")[0].firstChild.nodeValue,	
					};
					left.feedback=fb;
				}
				_lefts.push(left);	
			}	
		})();	
		(function (){
			for(var i=0,ii=_numberoflefts;i<ii;i++){	
				for(var j=0;j<_numberofrights;j++){	
					if(Helpers.isInArray(_rights[j].id, _lefts[i].correctLinkIds)){
						_lefts[i].correctLinks.push(_rights[j]);
					}else{
						_lefts[i].incorrectLinks.push(_rights[j]);	
					}
				}
			}
		})();	
		var t = new TweenMax.delayedCall(_options.delay, placeLefts);
		_pageObject.addToReset(t);	
		var u = new TweenMax.delayedCall(_options.delay, placeRights);
		_pageObject.addToReset(u);	
		
		
		placeCheckAnswerButton();
	};
	function placeLefts(){
		for(var i=0,ii=_numberoflefts;i<ii;i++){
			var thisid = _prefix+"-term-"+i;
			_lefts[i].id=thisid;
			var b = new Helpers.iconBox();
			b.setId(thisid);
			b.addClass("left");
			b.setHeight(_options.leftBtnHeights);
			b.setWidth(_options.leftBtnWidths);
			//b.setTextColour(_options.leftBtnFontColour);
			b.seticonColour(_options.leftBtnColour);
			b.drawIcon(_holder);
			_lefts[i].button = b;
			
			
			$("#"+thisid).append("<a id=\""+_prefix+"-termtext-"+i+"\">"+_lefts[i].text+"</a>");		
			TweenLite.set($("#"+thisid),{ left: _options.leftX -250, top: _options.leftY + (i*(_options.leftBtnHeights + _options.leftPadding)), opacity:0})
			tl.to($("#"+thisid), 0.5,{ opacity:1, left:_options.leftX },"-=0.3");
			
			$("#"+thisid).css({
				'font-size': "14",
				'position': 'absolute',
				'color': _options.leftBtnFontColour
			});
			$("#"+_prefix+"-termtext-"+i).css({
				'position': 'absolute',
				'left':'10px',
				'width':_options.leftBtnWidths-20,
				'top':Helpers.verticalAlignText($("#"+_prefix+"-termtext-"+i), $("#"+thisid))
			});
			var top = Helpers.verticalAlignText($("#"+_prefix+"-termtext-"+i), $("#"+thisid))
			$("#"+_prefix+"-termtext-"+i).css('top',top);
			
		}
		var v = new TweenMax.delayedCall(_options.delayActivation, activateLefts);
		_pageObject.addToReset(v);	
		
	}
	function placeRights(){
		for(var i=0,ii=_numberofrights;i<ii;i++){
			var thatid = _prefix+"-def-"+i;
			var c = new Helpers.iconBox();
			c.setId(thatid);
			c.addClass("right");
			_rights[i].id=thatid;
			c.setHeight(_options.rightBtnHeights);
			c.setWidth(_options.rightBtnWidths);
			c.seticonColour(_options.rightBtnColour);
			c.iconOverColour(_options.rightBtnRollOver);
			c.iconSelectColour(_options.rightBtnSelected);
			c.drawIcon(_holder);
			_rights[i].button = c;			
			$("#"+thatid).append("<a id=\""+_prefix+"-deftext-"+i+"\">"+_rights[i].text+"</a>");
			TweenLite.set($("#"+thatid),{ opacity:0, left: _options.rightX+200, top: _options.rightY + (i*(_options.rightBtnHeights + _options.rightPadding))});
			
			tl.to($("#"+thatid), 0.5,{ opacity:1, left:_options.rightX },"-=0.3");
			$("#"+thatid).css({
				'position': 'absolute',
				'display': 'block',
				'width': _options.rightBtnWidths,
				'color': _options.rightBtnFontColour
			});
			$("#"+_prefix+"-deftext-"+i).css({
				'position': 'absolute',
				'display':'block',	
				'top': (_options.rightBtnHeights/2)-($("#"+_prefix+"-deftext-"+i).height())/2+"px",
				'left':'10px'
			});
		}
	}
	function activateLefts(){
		
		for(var i=0;i<_numberoflefts;i++){
			_lefts[i].button.setState("active");
		}
		$(".left").on('click', function(e){ 
			var idSelected = e.currentTarget.getAttribute("id");	
			for(var i=0;i<_numberoflefts;i++){
				_lefts[i].button.setState("active");
				if(_lefts[i].id === idSelected){
					_leftObjectSelected=_lefts[i];		
					var e = TweenLite.to($("#"+_leftObjectSelected.id), 0.3, {left:_options.leftSelectedX});
					_pageObject.addToReset(e);
								
				}else{
					var u = TweenLite.to($("#"+_lefts[i].id), 0.3, {left:_options.leftX});
					_pageObject.addToReset(u);
				}
			}
			showSelectionsAnsers();		
			_leftObjectSelected.button.setState("over");
			if(!_started){
				activateRights();
			}
			_started=true;
		});
		
	}
	function showSelectionsAnsers(){
		for(var a=0;a<_rights.length;a++){
			var e = TweenLite.to($("#"+_rights[a].id), 0.3, {left:_options.rightX});	
			_pageObject.addToReset(e);		
			_rights[a].button.setState("active");
		}
		
		if(_usersAnswers){	
			for(var a=0;a<_leftObjectSelected.userLinked.length;a++){
				var t = TweenLite.to($("#"+_leftObjectSelected.userLinked[a].id), 0.3, {left:_options.rightSelectedX});	
				_pageObject.addToReset(t);
				_leftObjectSelected.userLinked[a].button.setState("selected");
			}
		}else{
			for(var a=0;a<_leftObjectSelected.correctLinks.length;a++){
				var y = TweenLite.to($("#"+_leftObjectSelected.correctLinks[a].id), 0.3, {left:_options.rightSelectedX});	
				_pageObject.addToReset(y);
				_leftObjectSelected.correctLinks[a].button.setState("selected");
			}
		}	
		if(_afterCheck){
			for(var i=0,ii=_leftObjectSelected.correctLinks.length;i<ii;i++){
				_leftObjectSelected.correctLinks[i].button.setCorrect(true);
				_leftObjectSelected.correctLinks[i].button.removeInteraction();
			}
			for(i=0,ii=_leftObjectSelected.incorrectLinks.length;i<ii;i++){
				_leftObjectSelected.incorrectLinks[i].button.setCorrect(false);
				_leftObjectSelected.incorrectLinks[i].button.removeInteraction();
			}
		}
	}
	function activateRights(){
		for(var i=0;i<_numberofrights;i++){
			_rights[i].button.setState("active");
		}
		$(".right").on('click', function(e){ 
			var idSelected = e.currentTarget.getAttribute("id");	
			for(var i=0;i<_numberofrights;i++){			
				if(_rights[i].id === idSelected){
					if(_rights[i].button.getState()==="selected"){
						_rights[i].button.setState("active");
						var y = TweenLite.to($("#"+_rights[i].id), 0.3, {left:_options.rightX});
						_pageObject.addToReset(y);
						var a=_leftObjectSelected.userLinked.length;
						while (a--){
							if(_leftObjectSelected.userLinked[a].id === _rights[i].id){
								_leftObjectSelected.userLinked.splice(a, 1);
								break;
							}
						}
					}else{
						_rights[i].button.setState("selected");
						var n = TweenLite.to($("#"+_rights[i].id), 0.3, {left:_options.rightSelectedX});
						_pageObject.addToReset(n);
						_leftObjectSelected.userLinked.push(_rights[i]);	
					}					
				}
			}
			if(checkanswerVisible()){	
				_checkButton.button.setState("active");
				$("#"+_checkButton.id).on('click', checkAnswer);				
			}else{
				$("#"+_checkButton.id).off();
				_checkButton.button.setState("inactive");
			}
			
		});
	}
	function placeCheckAnswerButton(){
		_checkButton.button = new Helpers.Button(_checkButton.text);
		_checkButton.button.setButtonColour(_checkButton.colour);
		_checkButton.button.setRollOverColour(_checkButton.rocolour);
		
		var cbId = _prefix+"-checkanswer";
		_checkButton.id=cbId;
		_checkButton.button.setId(cbId);
		
		_checkButton.button.drawButton(_holder);
		_checkButton.button.setState("inactive");
		
		TweenLite.set($("#"+cbId),{ left: _checkButton.x, top: _checkButton.y});
	}
	function checkanswerVisible(){
		for(var i=0;i<_numberoflefts;i++){
			if(_lefts[i].userLinked.length === 0){
				return false;
			}
		}
		return true;
	}
	function toggleCheckanswer(){
		if(_afterCheck && !_usersAnswers){
			_checkButton.button.setText("View Your Answer");
			$("#viewing_title p").contents().replaceWith("Showing: Correct answers");
		}else if (_afterCheck && _usersAnswers){
			_checkButton.button.setText("View Correct Answer");
			$("#viewing_title p").contents().replaceWith("Showing: Your selections");
		}
		
	}
	function checkAnswer(){
		if(!_afterCheck){
			$(".right").off();
			for(var i=0;i<_numberofrights;i++){
				_rights[i].button.removeInteraction();
			}
			for(i=0;i<_numberoflefts;i++){
				_lefts[i].button.addrighthtml("<a id=\"info_"+i+"\" class=\"i\"><p>i</p></a>", "info_"+i);
				_lefts[i].infoicon = $("#info_"+i);	
				//$("#info_"+i).on('click', {left:_lefts[i]}, showFeedback);
				$("#"+_lefts[i].id).on('click', {left:_lefts[i]}, showFeedback);
				var scale = _options.leftBtnHeights / 60;	
				TweenLite.set(_lefts[i].infoicon,{scaleX: scale, scaleY: scale});
			}
			$(_holder).append("<p id=\"extrainfo\">"+_checkAnswerContent.text+"</p>");
				TweenLite.set($("#extrainfo"),{position: "absolute", left: _checkAnswerContent.x, top: _checkAnswerContent.y, width:_checkAnswerContent.width, opacity:0});
				var y = TweenLite.to($("#extrainfo"), 0.3, {opacity:1});
				_pageObject.addToReset(y);
				Global.soundController.playSound(_checkAnswerContent.sound, _pageObject);
			$(_holder).append("<div id=\"viewing_title\"><p>Showing: Your selections</p></div>");
			TweenLite.set($("#viewing_title"),{position: "absolute", left: _options.rightSelectedX, top: _options.rightY - 30, fontStyle:"italic", fontWeight:"bold", fontSize:"16px", color:"#666666"});
			
			if(!_options.needtoviewfeedback){
				_base.setToComplete();	
			}
			_afterCheck=true;				
		}
		if(_usersAnswers){	
			_usersAnswers=false;
		}else if(!_usersAnswers){
			
			_usersAnswers=true;
		}
		showSelectionsAnsers();
		toggleCheckanswer();
	}
	function showFeedback(e){
		var selected = e.data.left;
		if(selected.feedback){
			closeFb();			
			var popup = new Helpers.popup();
			popup.setWidth(selected.feedback.width);
			popup.setHeight(selected.feedback.height);
			popup.setName(_prefix+"-popup-"+selected.id);
			popup.setClosebtn(true);
			popup.setX(selected.feedback.x);
			popup.setY(selected.feedback.y);
			popup.addToStage(_holder);	
			var text = selected.feedback.text;
			var sound = selected.feedback.sound;
			$("#"+popup.name).prepend("<p class=\"p10\">"+text+"</p>");
			TweenLite.set($("#"+_prefix+"-popup-"+selected.id+" .p10"),{paddingRight:30});
			
			if(sound != null || sound != undefined){
				popup.includeSound(true);
				Global.soundController.playSound(sound, _pageObject);
			}	
			_popup=popup;
			selected.feedbackSeen=true;
			if(allseen() && _options.needtoviewfeedback){
				_base.setToComplete();	
			}
		}
		TweenLite.set(selected.infoicon,{backgroundColor:"#afafaf", boxShadow:"none"});
	}
	function closeFb(){		  			
		if(_popup){_popup.removeFromStage();}else{
			Global.soundController.stopSound();
		}
	}
	function allseen(){
		for(var i=0;i<_numberoflefts;i++){
			if(!_lefts[i].feedbackSeen){
				return false;	
			}
		}
		return true;	
	}
};
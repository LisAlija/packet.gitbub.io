// JavaScript Document
Activities.QuestionSeriesWithResponse = function(){	
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
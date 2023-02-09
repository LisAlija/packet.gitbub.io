// JavaScript Document
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
};
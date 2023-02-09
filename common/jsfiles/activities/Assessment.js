// JavaScript Document
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
};
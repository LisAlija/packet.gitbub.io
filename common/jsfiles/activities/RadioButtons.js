// JavaScript Document
Activities.RadioButtons = function(){	
	var _base; 
	var _pageObject;
	var _groups=[];
	var _holder;
	var _options;
	var _numberofitems;
	var _prefix;
	var _checkButton;
	var _cFeedback;
	var _icoFeedback;
	var _popup;
		
	this.buildActivity = function(pageObject, holder){
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		_base = new Activities.base();
		_holder = holder;	
		_pageObject = pageObject;
	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("radiobuttonoptions")[0];
		_options = {
			showFb: xmlcontent.getAttribute("showFb"),
			delayReveal: Number(xmlcontent.getAttribute("revealdelay"))
		};
		var grXml= xmlcontent.getElementsByTagName("radioGroup");
		_numberofitems = grXml.length;
		for(var i=0;i<_numberofitems;i++){
			var group = {
				radio : [],
			};
			var radxml = grXml[i].getElementsByTagName("radio");
			for(var a=0,aa=radxml.length;a<aa;a++){
				var rad = {
					correct: (radxml[a].getAttribute("correct")==1)?true:false,
					x:Number(radxml[a].getAttribute("x")),
					y:Number(radxml[a].getAttribute("y")),
					width:Number(radxml[a].getAttribute("width")),
					id: "qu-"+i+"-an-"+a
				};
				group.radio[a] = rad;	
			}
			_groups.push(group);
			_groups[i].horizontal=true;
			for(a=1,aa=radxml.length;a<aa;a++){		
				if(_groups[i].radio[a].y!==_groups[i].radio[a-1].y){
					_groups[i].horizontal = false;
					break;
				}
			}
			var groupcfbxml = (grXml[i].getElementsByTagName("groupfbcorrect"))?grXml[i].getElementsByTagName("groupfbcorrect")[0]:undefined;
			if(groupcfbxml){
				var cfb = {
					x:Number(groupcfbxml.getAttribute("x")),
					y:Number(groupcfbxml.getAttribute("y")),
					width:Number(groupcfbxml.getAttribute("width")),
					height:Number(groupcfbxml.getAttribute("height")),
					sound:groupcfbxml.getAttribute("sound"),
					text:groupcfbxml.firstChild.nodeValue
				};
				group.cfb = cfb;
			}
			var groupicfbxml = (grXml[i].getElementsByTagName("groupfbincorrect"))?grXml[i].getElementsByTagName("groupfbincorrect")[0]:undefined;
			if(groupicfbxml){
				var icfb = {
					x:Number(groupicfbxml.getAttribute("x")),
					y:Number(groupicfbxml.getAttribute("y")),
					width:Number(groupicfbxml.getAttribute("width")),
					height:Number(groupicfbxml.getAttribute("height")),
					sound:groupicfbxml.getAttribute("sound"),
					text:groupicfbxml.firstChild.nodeValue
				};
				group.icfb = icfb;
			}
			
		}
		var grcfbXml= (xmlcontent.getElementsByTagName("feedbackcorrect"))?xmlcontent.getElementsByTagName("feedbackcorrect")[0]:undefined;
		if(grcfbXml){
			_cFeedback ={
				x:Number(grcfbXml.getAttribute("x")),
				y:Number(grcfbXml.getAttribute("y")),
				width:Number(grcfbXml.getAttribute("width")),
				height:Number(grcfbXml.getAttribute("height")),
				sound:grcfbXml.getAttribute("sound"),
				text:grcfbXml.firstChild.nodeValue
			};
		}
		var gricfbXml= (xmlcontent.getElementsByTagName("feedbackincorrect"))?xmlcontent.getElementsByTagName("feedbackincorrect")[0]:undefined;
		if(gricfbXml){
				_icoFeedback ={
				x:Number(gricfbXml.getAttribute("x")),
				y:Number(gricfbXml.getAttribute("y")),
				width:Number(gricfbXml.getAttribute("width")),
				height:Number(gricfbXml.getAttribute("height")),
				sound:gricfbXml.getAttribute("sound"),
				text:gricfbXml.firstChild.nodeValue
			};
		}
		var t = new TweenMax.delayedCall(_options.delayReveal, placeRadios);
		_pageObject.addToReset(t);	
	};
	function placeRadios(){
		for(var i=0;i<_numberofitems;i++){
			$(_holder).append("<div id=\"form-"+i+"\"></div>");
			for(var a=0,aa=_groups[i].radio.length;a<aa;a++){
				$("#form-"+i).append("<label for=\"qu-"+i+"-an-"+a+"\" class=\"removable\" id=\"qu-"+i+"-an-"+a+"-lab\"><input type=\"radio\" name=\"qu-"+i+"\" value=\"\" id=\""+_groups[i].radio[a].id+"\"><span></span></label>");	
				_groups[i].radio[a].id="qu-"+i+"-an-"+a;
				TweenLite.set($("#qu-"+i+"-an-"+a+"-lab"), {position:"absolute", left: _groups[i].radio[a].x, top: _groups[i].radio[a].y});	
			}
		}
		TweenMax.staggerFrom($('.removable'), 0.5, {opacity:0, y:"-=20"}, 0.05);
		switch(_options.showFb){
			case "select":
				$('input:radio').change(showFb);    
			break;
		}	  
	}
	function showFb(e){
		if(checkComplete()){
			var correct = 0;
			for(var i=0;i<_numberofitems;i++){
				if(_groups[i].correct){
					correct++;
				}
			}
			if(correct===_numberofitems){
				if(_cFeedback){
					showFeedback(true);
				}
				
			}else{
				if(_icoFeedback){
					showFeedback(false);
				}
			}
			_base.setToComplete();	
		}
		var name = e.target.getAttribute('name');
		var group = Number(name.substr(name.indexOf("-") + 1));
		if(_groups[group].correct && _groups[group].cfb){
			popupBox(_groups[group].cfb);
		}else if((!_groups[group].correct) && _groups[group].icfb){
		
			popupBox(_groups[group].icfb);
		}
	}
	function checkComplete(){
		var done=true;
		for(var i=0;i<_numberofitems;i++){
			if(!$("#form-"+i+" input[name='qu-"+i+"']").is(":checked")){
				_groups[i].done=false;
				done = false;
			}else{
				if(!_groups[i].done){
					for(var a=0,aa=_groups[i].radio.length;a<aa;a++){
						if($("input[name='qu-"+i+"']:checked", "#form-"+i).attr("id")==_groups[i].radio[a].id){
							_groups[i].radio[a].selected=true;
							if(_groups[i].radio[a].correct){
								_groups[i].correct=true;	
							}else{
								_groups[i].correct=false;
							}
							$("#"+_groups[i].radio[a].id).prop( "disabled", true );
						}else{
							_groups[i].radio[a].selected=false;
							$("#"+_groups[i].radio[a].id).prop( "disabled", true );
						}
					}
					if(_groups[i].horizontal){		
						$(_holder).append("<div id='td-"+i+"' class='bgs25'></div>");
						if(_groups[i].correct){
							$("#td-"+i).addClass("tickdiv");
						}else{
							$("#td-"+i).addClass("crossdiv");
						}
						TweenLite.set($("#td-"+i),{left:_groups[i].radio[_groups[i].radio.length-1].x + 30, top:_groups[i].radio[0].y-8} );
					}
				}	
				_groups[i].done=true;
			}
		}
		return done;	
	}
	function showFeedback(pass){
		var content = (pass)?_cFeedback:_icoFeedback
		popupBox(content);
	}
	function popupBox(o){
	
		closeFb();
		var popup = new Helpers.popup();
		popup.setWidth(o.width);
		popup.setHeight(o.height);
		popup.setName(_prefix+"-popup-feedback");
		popup.setClosebtn(true);
		popup.setX(o.x);
		popup.setY(o.y);
		popup.addToStage(_holder);	
		var text = o.text;
		var sound = o.sound;
		$("#"+popup.name).prepend("<p class=\"p10\">"+text+"</p>");
		if(sound != null || sound != undefined){
			popup.includeSound(true);
			Global.soundController.playSound(sound, _pageObject);
		}	
		_popup=popup;
		o.feedbackSeen=true;
	}
	function closeFb(){		  			
		if(_popup){_popup.removeFromStage();}else{
			Global.soundController.stopSound();
		}
	}
};
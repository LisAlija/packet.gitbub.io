Activities.Crossword = function(){	
"use strict";
	var _base; 
	var _pageObject;
	var _holder;
	var _prefix;
	var _words = [];
	var _numberofwords;
	var _draggers = [];
	var _numberofdraggers;
	var _draggables=[];
	var _options;
	var tl;
	
	this.buildActivity = function(pageObject, holder){
		_base = new Activities.base();
		_pageObject = pageObject;
		_holder = holder;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		tl = new TimelineLite();
		_pageObject.addToReset(tl);	
		var xmlcontent = $(_pageObject.pagexml[_pageObject.pageposition]).children("crossword")[0];	
		
		_options = {
			revlealCrossword: Number(xmlcontent.getElementsByTagName("revealCrossword")[0].firstChild.nodeValue),
			revealDraggers: Number(xmlcontent.getElementsByTagName("revealDraggers")[0].firstChild.nodeValue),
			enableDraggers: Number(xmlcontent.getElementsByTagName("enableDraggers")[0].firstChild.nodeValue),
			draggerBgColour: Helpers.convertColour(xmlcontent.getElementsByTagName("draggerBgColour")[0].firstChild.nodeValue),
			draggerOutlineColour: Helpers.convertColour(xmlcontent.getElementsByTagName("draggerOutlineColour")[0].firstChild.nodeValue),
			draggerWidth: Number(xmlcontent.getElementsByTagName("draggerWidth")[0].firstChild.nodeValue),
			draggerHeight: Number(xmlcontent.getElementsByTagName("draggerHeight")[0].firstChild.nodeValue),
			draggerFontColour: Helpers.convertColour(xmlcontent.getElementsByTagName("draggerFontColour")[0].firstChild.nodeValue),
			draggerFontSize: Number(xmlcontent.getElementsByTagName("draggerFontSize")[0].firstChild.nodeValue),
		};
		
		
		var draggers = xmlcontent.getElementsByTagName("dragger");
		_numberofdraggers=draggers.length;
		for(var i=0;i<_numberofdraggers;i++){
			var dragger={
				name: draggers[i].getAttribute("name"),
				x: Number(draggers[i].getAttribute("startingx")),
				y: Number(draggers[i].getAttribute("startingy")),
				finishx: Number(draggers[i].getAttribute("finishx") - 1),
				finishy: Number(draggers[i].getAttribute("finishy") - 1),
				wordid: draggers[i].getAttribute("word").replace(/ /g,'').split(","),
				letter: draggers[i].firstChild.nodeValue,
				landed:false,
				targetid: _prefix+"target-"+i,
				id: _prefix+"-dragger-"+i
			};
			_draggers.push(dragger);
		}
		
		var words = xmlcontent.getElementsByTagName("word");
		_numberofwords=words.length;
		for(i=0;i<_numberofwords;i++){
			var word={
				id: words[i].getAttribute("wordid"),
				x: Number(words[i].getAttribute("x")),
				y: Number(words[i].getAttribute("y")),
				fontcolour: Helpers.convertColour(words[i].getAttribute("fontcolour")),
				fontsize: Number(words[i].getAttribute("fontsize")),
				text: words[i].firstChild.nodeValue,
				hits:0,
				requiredhits:0,
				htmlid: _prefix+"-word-"+i
			};
			_words.push(word);
		}
		for(i=0;i<_numberofwords;i++){
			for(var j=0;j<_numberofdraggers;j++){
				for(var k=0, kk=_draggers[j].wordid.length;k<kk;k++){
					if(_draggers[j].wordid[k] === _words[i].id){
						_words[i].requiredhits++;
					}
				}
			}
		}
		placeTargets();
		placeDraggers();
		placeWords();
		revealAndActivate();
	};
	
	function placeTargets(){
		for(var i=0;i<_numberofdraggers;i++){			
			$(_holder).append("<div id=\""+_draggers[i].targetid+"\" class=\"drag-drop-target\"></div>");
			TweenLite.set($("#"+_draggers[i].targetid),{position: "absolute", x: _draggers[i].finishx, y: _draggers[i].finishy, width: _options.draggerWidth, height: _options.draggerHeight, opacity:0});	
		}
	}
	function placeDraggers(){
		for(var i=0;i<_numberofdraggers;i++){
			var image = Helpers.findImage(_draggers[i].image, _pageObject.images);
			$(_holder).append("<div id=\""+_draggers[i].id+"\" class=\"drag-drop-crossword-drag drag-drop-drag\"><p>"+_draggers[i].letter+"</p></div>");
			TweenLite.set($("#"+_draggers[i].id),{position: "absolute", backgroundColor:_options.draggerBgColour, borderColor:_options.draggerOutlineColour, color:_options.draggerFontColour, fontSize:_options.draggerFontSize, x: _draggers[i].x, y: _draggers[i].y, width: _options.draggerWidth - 4.5, height: _options.draggerHeight - 4.5, fontWeight:"bold", opacity:0});
			
		}
	}
	function placeWords(){
		for(var i=0;i<_numberofwords;i++){
			$(_holder).append("<p id=\""+_words[i].htmlid+"\" class=\"crossword-word\">"+_words[i].text+"</p>");
			TweenLite.set($("#"+_words[i].htmlid),{ position:"absolute", left: _words[i].x, top: _words[i].y, opacity:0});
		}
	}
	function revealAndActivate(){
		for(var i=0;i<_numberofdraggers;i++){
			tl.to($("#"+_draggers[i].id), 0.5,{ opacity:1},0);	
			tl.to($("#"+_draggers[i].targetid), 0.5,{ opacity:1},0);	
		}
		var droppables = $(".drag-drop-drag");
		var overlap = "50%";
		var SX, SY, value = Global.model.zoom;
		Draggable.create(droppables, {
			type:"x,y",
			onPress:function(){
				SX = this.x;
				SY = this.y;
				value = Global.model.zoom;
			},
			onDrag:function(){
				if(!createjs.BrowserDetect.isFirefox){
					var ratio = (1/value)-1;
					TweenMax.set(this.target,{ x:"+="+(this.x-SX)*ratio , y:"+="+(this.y-SY)*ratio });
				}
			},
			onRelease:function(e){
				var id = this.target.getAttribute("id");
				for(i=0;i<_numberofdraggers;i++){
					if(_draggers[i].id === id){
						if(this.hitTest($("#"+_draggers[i].targetid), overlap)){
							TweenLite.to($("#"+id), 0.5,{ x:_draggers[i].finishx, y:_draggers[i].finishy},0);	
							_draggers[i].landed=true;
							for(var j=0;j<_draggers[i].wordid.length;j++){
								for(var a=0;a<_numberofwords;a++){		
									if(_draggers[i].wordid[j] == _words[a].id){
										_words[a].hits++;
										if(_words[a].hits===_words[a].requiredhits){
											TweenLite.to($("#"+_words[a].htmlid), 0.5,{ opacity: 1},0);	
										}
										break;
									}
								}
							}
							if(checkComplete()){
								_base.setToComplete();	
							}
							this.disable();
						}else{
							TweenLite.to($("#"+id), 0.5,{ x:_draggers[i].x, y:_draggers[i].y });						
						}
						break;
					}
				}
			}
		});
	}
	function checkComplete(){
		for(var i=0;i<_numberofdraggers;i++){
			if(!_draggers[i].landed){
				return false;
			}			
		}
		return true;
	}
};
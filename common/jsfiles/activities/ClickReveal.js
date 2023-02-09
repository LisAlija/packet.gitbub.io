// JavaScript Document
Activities.ClickReveal = function(){	
	var _base; 
	var _pageNumber;
	var _pageObject;
	var _clickers=[];
	var _holder;
	var _options;
	var THIS = this;
	var _openPopup;
	var _openClicker;
		
	this.buildActivity = function(pageObject, holder){
		_base = new Activities.base();
		_holder = holder;	
		_pageObject = pageObject;
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		var opts = $(_pageObject.pagexml[_pageObject.pageposition]).children("clickrevealOptions")[0];
		var rawClickers = _pageObject.pagexml[_pageObject.pageposition].getElementsByTagName("clickreveal");		
		_options={	
			delayActivation:opts.getAttribute("delayactivation"),
			closeButton: opts.getAttribute("closebutton") == "yes" ? true:false
		}

		for(var i=0,ii=rawClickers.length;i<ii;i++){	
			_clickers.push(
				{
					clickerraw: rawClickers[i],
					clickerpageobj: new Models.page("click reveal"),
					clickericon: rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue,
					clickericonover: (Helpers.imageExists(rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_over", _pageObject.images))?rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_over":null,
					clickericonselected: (Helpers.imageExists(rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_selected", _pageObject.images))?rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_selected":null,
					clickericondone: (Helpers.imageExists(rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_done", _pageObject.images))?rawClickers[i].getElementsByTagName("clicker")[0].firstChild.nodeValue+"_done":null,
					clickerx: rawClickers[i].getElementsByTagName("clicker")[0].getAttribute("x"),
					clickery: rawClickers[i].getElementsByTagName("clicker")[0].getAttribute("y"),
					clickerreveal: rawClickers[i].getElementsByTagName("clicker")[0].getAttribute("revealDelay"),
					popupx: rawClickers[i].getAttribute("x"),
					popupy: rawClickers[i].getAttribute("y"),
					popupheight: rawClickers[i].getAttribute("height"),
					popupwidth: rawClickers[i].getAttribute("width"),
					popupbg: (rawClickers[i].getAttribute("bg")!=="no")?true:false, 
					popuppages: rawClickers[i].getElementsByTagName("page"),
					popupnumberofpages: rawClickers[i].getElementsByTagName("page").length,					
					popupageon:0,
					popupid:_prefix+"popup"+i,
					popup:null,																				
					seen: false,
					//clickerpages: clickerraw.getElementsByTagName("page")
				}
			);
		}
		var tl = new TimelineLite();
		for(var i=0,ii=_clickers.length;i<ii;i++){
			for(var a=0,aa=_pageObject.images.length;a<aa;a++){
				if(_pageObject.images[a].id === _clickers[i].clickericon){	

					var btn = new Helpers.buttonImage();
					btn.setId(_prefix+"-"+i+"-clickreveal");
					btn.setState1Image(Helpers.findImage(_clickers[i].clickericon, _pageObject.images));
					if(_clickers[i].clickericonover){btn.setState2Image(Helpers.findImage(_clickers[i].clickericonover, _pageObject.images));}
					if(_clickers[i].clickericonselected){btn.setState3Image(Helpers.findImage(_clickers[i].clickericonselected, _pageObject.images));}
					if(_clickers[i].clickericondone){ btn.setState4Image(Helpers.findImage(_clickers[i].clickericondone, _pageObject.images));}
					btn.drawButton(_holder);
					_clickers[i].clicker = btn.getButton();
					_clickers[i].btnObject = btn;
					var tl = new TimelineLite();
					tl.set(_clickers[i].clicker, {position:"absolute", left:_clickers[i].clickerx, top:_clickers[i].clickery-10, opacity:0});
					tl.append(new TweenLite(_clickers[i].clicker, 0.5, {top:_clickers[i].clickery, opacity:1, delay:_clickers[i].clickerreveal}));	
					_pageObject.addToReset(tl);
				}					
			}
			
			_clickers[i].clickerpageobj.numberofscreens = _clickers[i].popupnumberofpages;
			_clickers[i].clickerpageobj.pagexml = _clickers[i].clickerraw.getElementsByTagName("page");
			_clickers[i].clickerpageobj.linkActivities(_clickers[i].clickerpageobj);
			_clickers[i].clickerpageobj.sounds = _pageObject.sounds;
			_clickers[i].clickerpageobj.images = _pageObject.images;
			_clickers[i].clickerpageobj.manifest = _pageObject.manifest;
			_clickers[i].clickerpageobj.transcripts = _pageObject.transcripts;
		}	
		
		var tn = new TweenMax.delayedCall(_options.delayActivation, activateClickers);
		_pageObject.addToReset(tn);	
	};
	this.popupClosed = function(name){
		for(var i=0,ii=_clickers.length;i<ii;i++){
			if(name===_clickers[i].popupid){
				_clickers[i].btnObject.setState("done");
			}
		}
	};
	function activateClickers(){
		for(var i=0,ii=_clickers.length;i<ii;i++){
			//_clickers[i].btnObject.setState("active");
			$(_clickers[i].clicker).css({'cursor':'pointer'}).on('click', {cl:i}, launchPopup);
			_pageObject.addToResetEventListeners(_clickers[i].clicker);
		}
	}
	function launchPopup(event){	
		if(_openPopup)_openPopup.removeFromStage();	
		if(_openClicker)_openClicker.btnObject.setState("done");
		var a = event.data.cl;
		_clickers[a].btnObject.setState("selected");
		if(_clickers[a].popup!=null){
			_clickers[a].popup.removeFromStage();
		}
		var popup = new Helpers.popup();
		popup.setWidth(_clickers[a].popupwidth);
		popup.setHeight(_clickers[a].popupheight);
		popup.setX(_clickers[a].popupx);
		popup.setY(_clickers[a].popupy);
		popup.setName(_clickers[a].popupid);
		popup.setClosebtn(_options.closeButton);
		popup.setOwnerObject(THIS);
		popup.setClass((_clickers[a].popupbg)?"feedbackpopup":"invisiblepopup");
		popup.addToStage(_holder);	
		_clickers[a].seen=true;
		_clickers[a].popup=popup;
		
		for(var i=0,ii=_clickers[a].clickerpageobj.activities.length;i<ii;i++){
			
			if(_clickers[a].clickerpageobj.activities[i].pageNumber == _clickers[a].clickerpageobj.pageposition){
				Factory.activityStore.createActivity(_clickers[a].clickerpageobj.activities[i].name, _clickers[a].clickerpageobj, $("#"+popup.name)[0]);
			}
		}
		
		if(_clickers[a].clickerpageobj.pagexml[_clickers[a].clickerpageobj.pageposition].getAttribute("sound")!=null || _clickers[a].clickerpageobj.pagexml[_clickers[a].clickerpageobj.pageposition].getAttribute("sound")!=undefined){
			popup.includeSound(true);
			Global.soundController.playSound(_clickers[a].clickerpageobj.pagexml[_clickers[a].clickerpageobj.pageposition].getAttribute("sound"), _clickers[a].clickerpageobj);
		}
		
		if(checkComplete()){
			_base.setToComplete();
		}
		_openPopup = popup;
		_openClicker = _clickers[a];
	}
	function checkComplete(){
		for(var i=0,ii=_clickers.length;i<ii;i++){
			if(!_clickers[i].seen){
				return false;
			}
		}
		return true;
	}
}
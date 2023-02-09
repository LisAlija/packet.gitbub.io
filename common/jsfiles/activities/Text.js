// JavaScript Document
Activities.TextActivity = function(){	
	var base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _statements=[];
	var _prefix;
	
	this.buildActivity = function(pageObject, holder){
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		base = new Activities.base();	
		_holder = holder;
		base.page = _pageNumber;
		_pageObject = pageObject;
		var statements = $(_pageObject.pagexml[_pageObject.pageposition]).children("statement");		
		
		for(var i=0,ii=statements.length;i<ii;i++){
			_statements.push(
				{
					text: statements[i].childNodes[0].nodeValue,
					delay: Number(statements[i].getAttribute("delay")),
					x: Number(statements[i].getAttribute("x")),
					y: Number(statements[i].getAttribute("y")) + 10,
					width: Number(statements[i].getAttribute("width")),
					align: (statements[i].getAttribute("align"))?statements[i].getAttribute("align"):"left",
					remove: (statements[i].getAttribute("remove"))?statements[i].getAttribute("remove"):null
				}
			)
		}	
		placeText();
	}	
	function placeText(){
		for(var i=0,ii=_statements.length;i<ii;i++){
			$(_holder).append("<p id=\"st-"+_prefix+"-"+i+"\" class=\"statement\">"+_statements[i].text+"</p>");
			TweenLite.set($("#st-"+_prefix+"-"+[i]), {left:_statements[i].x, top:_statements[i].y-10, width:_statements[i].width, opacity: 0, textAlign:_statements[i].align});	
			var f = new TimelineLite();
			f.to($("#st-"+_prefix+"-"+[i]), 0.5, {delay:_statements[i].delay, left:_statements[i].x, top:_statements[i].y, opacity: 1});
			if(_statements[i].remove)f.to($("#st-"+_prefix+"-"+[i]), 0.2, {autoAlpha:0}, "+="+_statements[i].remove);	
			_pageObject.addToReset(f);												
		}
	}
}
Activities.BulletActivity = function(){	
	var base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _statements=[];
	var _prefix;
	
	this.buildActivity = function(pageObject, holder){
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition;
		base = new Activities.base();	
		_holder = holder;
		base.page = _pageNumber;
		_pageObject = pageObject;
		var statements = $(_pageObject.pagexml[_pageObject.pageposition]).children("bullet");
		
		
		for(var i=0,ii=statements.length;i<ii;i++){
			_statements.push(
				{
					text: statements[i].childNodes[0].nodeValue,
					delay: statements[i].getAttribute("delay"),
					x: statements[i].getAttribute("x"),
					y: statements[i].getAttribute("y"),
					width: statements[i].getAttribute("width"),
					remove: (statements[i].getAttribute("remove"))?statements[i].getAttribute("remove"):null
				}
			)
		}	
		placeText();
	}	
	function placeText(){
		for(var i=0,ii=_statements.length;i<ii;i++){
			$(_holder).append("<p id=\"bu-"+_prefix+"-"+i+"\" class=\"bullet\">"+_statements[i].text+"</p>");
			TweenLite.set($("#bu-"+_prefix+"-"+[i]), {left:_statements[i].x, top:_statements[i].y-10, width:_statements[i].width, opacity: 0});
			
			var f = new TimelineLite();
			f.to($("#bu-"+_prefix+"-"+[i]), 0.5, {delay:_statements[i].delay, left:_statements[i].x, top:_statements[i].y, opacity: 1});
			if(_statements[i].remove)f.to($("#bu-"+_prefix+"-"+[i]), 0.2, {autoAlpha:0}, "+="+_statements[i].remove);	
			_pageObject.addToReset(f);															
		}
	}
}
Activities.ActivityText = function(){	
	var base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _raw;
	var _items = [];
	var _prefix;
	
	this.buildActivity = function(pageObject, holder){
		_prefix = holder.getAttribute("id")+"-"+pageObject.pageposition+"-act-";
		base = new Activities.base();	
		_holder = holder;
		base.page = _pageNumber;
		_pageObject = pageObject;
		
		_raw = $(_pageObject.pagexml[_pageObject.pageposition]).children("instructionOptions");
		for(var i=0,ii=_raw.length;i<ii;i++){
			_items.push(
				{					
					x:_raw[i].getAttribute("x"),
					y:_raw[i].getAttribute("y"),
					width:_raw[i].getAttribute("width"),
					delay: _raw[i].getAttribute("delay"),
					style: (_raw[i].getAttribute("style") !="slide") ? "normal" : "slide",
					text: _raw[i].getElementsByTagName("instruction")[0].textContent,
					sound: _raw[i].getAttribute("sound"),
					id: "in-"+_prefix+"-"+i,		
				}
			)
		}
		placeText();	
	}
	function placeText(){
		for(var i=0,ii=_items.length;i<ii;i++){
			if(_items[i].style==="normal"){
				$(_holder).append("<p id=\""+_items[i].id+"\" class=\"normalinstruction\">"+_items[i].text+"</p>");	
				TweenLite.set($("#"+_items[i].id), {left:_items[i].x, top:_items[i].y-10, width:_items[i].width, opacity: 0});	
				var f = TweenLite.to($("#"+_items[i].id), 0.5, {delay:_items[i].delay, left:_items[i].x, top:_items[i].y, opacity: 1});	
				_pageObject.addToReset(f);		
			}else if(_items[i].style==="slide"){
				$(_holder).append("<p id=\""+_items[i].id+"\" class=\"slideinstruction\">"+_items[i].text+"</p>");
				TweenLite.set($("#"+_items[i].id), {left:_items[i].x - 2000, top:_items[i].y-10, width:680, opacity: 0, skewX:40});	
				var tl = new TimelineLite();
				tl.append(TweenLite.to($("#"+_items[i].id), 0.3, {delay:_items[i].delay, left:_items[i].x, top:_items[i].y, opacity: 1, skewX:10}));
				tl.to($("#"+_items[i].id), 0.2, {skewX:-10, left:_items[i].x});
				tl.to($("#"+_items[i].id), 0.15, {skewX:10, left:_items[i].x});
				tl.to($("#"+_items[i].id), 0.1, {skewX:0});
				_pageObject.addToReset(tl);
			}
		}
	}
}
// JavaScript Document
Activities.Video = function(){	
	var base; 
	var _pageNumber;
	var _pageObject;
	var _holder;
	var _videos=[];
	var _numberofvids;
	
	this.buildActivity = function(pageObject, holder){
		base = new Activities.base();	
		base.page = _pageNumber;
		_pageObject = pageObject;
		_videos = $(_pageObject.pagexml[_pageObject.pageposition]).children("placeVideo");
		_numberofvids = _videos.length;
		_holder = holder;
		placeVideo();
		
	};	
	function placeVideo(){
		
		for(var i=0;i<_pageObject.videoManifest.length;i++){
			for(var a=0,aa=_numberofvids;a<aa;a++){
				if(_pageObject.videoManifest[i].id == _videos[a].getAttribute("name")){
					
					$(_holder).append("<div id=\"stageVideoContainer"+i+"\" class='pf-container'></div>");
					var x = Number(_videos[a].getAttribute("x"));
					var y = Number(_videos[a].getAttribute("y"));
					TweenLite.set($("#stageVideoContainer"+i), {position:"absolute", left: x, top: y});	
					var myPlayer = new PlayerFramework.Player("stageVideoContainer"+i,
					{
						mediaPluginFallbackOrder: [ "VideoElementMediaPlugin", "SilverlightMediaPlugin" ],
						//mediaPluginFallbackOrder: [ "SilverlightMediaPlugin", "VideoElementMediaPlugin" ],
						//mediaPluginFallbackOrder: [ "HyperlinkMediaPlugin" ],
						width: Number(_videos[a].getAttribute("width")),
						height: Number(_videos[a].getAttribute("height")),
						//poster: "../media/bigbuck.png",
						sources:
						[
							{
								src: _pageObject.videoManifest[i].src,
								type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
							},					
						]
					});
					
				}//end if
				
				
			}
			
		}	
		$(".pf-full-browser-control").remove();	
	}
};
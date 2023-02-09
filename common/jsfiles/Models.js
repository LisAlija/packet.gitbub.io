// JavaScript Document
var Models = Models || {};		
Models.global = function(){
	"use strict";
	this.modTitle,
	this.courseTitle,
	this.numberOfPages,
	this.pageOn,
	this.currentPageObject,
	this.pages = [],
	this.secondAttemptPages = [],
	this.secondAttemptNumberOfPages,
	this.onAfterAssessment = false,
	this.development = false,
	this.sidePanels=[],
	this.zoom = 1,
	this.zoomBrowser,
	this.scorm = false,
	this.scormInitialised = false,
	this.scormProgress = [],
	this.scormBookmark = 0,
	this.scormCompletion,
	this.manifestLoading = 0,
	this.setScormProgressString = function(v){
		
		if(v===undefined || v==="" || v==="0"){
			
			for(var i=0;i<this.numberOfPages;i++){
				this.scormProgress.push("0");
			}
		}else{
			this.scormProgress = v.split(",");
		}
		
	},
	this.setScormBookmark = function(v){
		this.scormBookmark = v;
	},
	this.setCompletion = function(v){
		this.scormCompletion = v;
	},
	this.addSidePanel = function(p){
		this.sidePanels.push(p);	
	},
	
	this.setModTitle = function(t){
		this.modTitle = t;	
	},
	this.setCourseTitle = function(t){
		this.courseTitle = t;	
	},
	this.setNumberOfPages = function(t){
		this.numberOfPages = t;	
	},
	this.setScorm = function(t){
		this.scorm = t;
	},
	this.setPageOn = function(t){
		this.pageOn = t;
		this.currentPageObject= this.pages[t];	
	},
	this.setPageObject = function(p){
		this.currentPageObject=p;	
	},
	this.addPageToArray = function(p){
		this.pages.push(p);
	},
	this.setAfterAssessment = function(p){
		this.onAfterAssessment = p;
	},
	this.getAfterAssessment = function(){
		return this.onAfterAssessment;
	},
	this.setAllPagesIncomplete = function(){
		for(var i=0;i<this.numberOfPages;i++){
			this.pages[i].completed=false;
		}		
	},
	this.setAllPagesComplete = function(){
		for(var i=0;i<this.numberOfPages;i++){
			this.pages[i].setComplete(true);
		}
	},
	this.setPageIncomplete = function(a){
		if(this.pages[a-1] != undefined){
			this.pages[a-1].setComplete(false);
		}else{
				
		}
	},
	this.setPageUnavailable = function(a){
		if(this.pages[a-1] != undefined){
			this.pages[a-1].setAvailable(false);
		}else{
					
		}
	},
	this.setSecondAttemptPages = function(){
		this.secondAttemptNumberOfPages=0;
		for(var i=0,ii=this.numberOfPages;i<ii;i++){
			if(!this.pages[i].completed){
				this.secondAttemptPages.push(this.pages[i]);
				this.secondAttemptNumberOfPages++;
			}	
		}
	},
	this.setZoomBrowser = function(val){
		this.zoomBrowser = val;
	},
	this.setZoom = function(val){
		if(this.zoomBrowser){
			if (val){
				this.zoom = val;	
			}else{
				var w = window.innerWidth;
				var h = window.innerHeight;
				
				var ratio = ((1009 * (h/661))<= w)?(h/662):(w/1009);
				this.zoom = ratio;	
			}
		}
	}
};
Models.page = function(n){
	THIS=this;
	this.name = n;
	this.images = [];
	this.sounds = [];
	this.videos = [];
	this.customjs = [];
	this.transcripts = [];
	this.activities = [];	
	this.loaded = false;
	this.route;
	this.xml;
	this.pagexml = [];
	this.pageposition = 0;
	this.title;
	this.percentLoaded = 0;
	this.manifest =[];
	var secondmanifest =[];
	this.videoManifest =[];
	this.numberOfScreens = 1;
	this.completed =false;
	this.available=false;
	this.timeLinesToReset = [];
	this.eventsToReset = [];
	this.timedProgression = [];
	this.continueBtn = [];
	this.noSound = [];
	this.noRemove = [];
	this.stopSound=[];
	this.interval = undefined;
	this.queue = undefined;
	this.queueReady = false;

	
	this.loadData = function(){			
		var preload = new createjs.LoadQueue(false);		
		preload.on("fileload", xmlloaded, this);
		preload.loadFile(this.route);		
	};
	
	this.addToReset = function(tl){
		this.timeLinesToReset.push(tl);
	}
	this.addToResetEventListeners = function(tl){
		this.eventsToReset.push(tl);
	}
	this.pageReset = function(){
		for(var i=0, ii=this.timeLinesToReset.length; i<ii; i++){
			this.timeLinesToReset[i].kill();
		}
		for(i=0, ii=this.eventsToReset.length; i<ii; i++){
			$(this.eventsToReset[i]).off();
		}
		this.pageposition=0;
		this.timeLinesToReset=[];
		if(this.interval)clearInterval(this.interval);
		
	}
	this.setAvailable = function(e){
		this.available = e;	
	};
	function xmlloaded(e){
		this.xml = e.result.documentElement;	
		var ee = this.xml.getElementsByTagName("page");
		for(var i=0, ii=ee.length; i<ii; i++){		
			if(ee[i].parentNode.parentNode.nodeName == '#document'){		
				this.pagexml.push(ee[i]);
			}else{
			
			}
		}
		this.numberOfScreens = this.pagexml.length;
		var tr = this.xml.getElementsByTagName("transcript");
		
		for(i=0, ii=tr.length; i<ii; i++){
			this.transcripts.push({
				sound:tr[i].getAttribute("sound"),
				text:tr[i].firstChild.nodeValue
			});			
		}
		var nodes = [];			
		if(this.xml.getElementsByTagName("LoaderMax")[0] && this.xml.getElementsByTagName("LoaderMax")[0].childNodes.length>0){
			nodes = this.xml.getElementsByTagName("LoaderMax")[0].childNodes;			
		}
		
		for(i=0, ii=nodes.length; i<ii;i++){
		
			if(nodes[i].nodeType===1){
				
				var a = {
					src:nodes[i].getAttribute("url"),
					id:nodes[i].getAttribute("name")							
				};
				
				if(nodes[i].hasAttribute("extras")){				
					var additions = nodes[i].getAttribute("extras").replace(/ /g,'').split(",");
					for(var j=0,jj=additions.length;j<jj;j++){
						var newSrc = a.src.replace(/\.swf$/, '_'+additions[j]+".png");
						var newId = a.id;
						newId +='_'+additions[j];
						var extras = {
							src: newSrc,
							id: newId
						};
						this.manifest.push(extras);
						
					}
				}
				if(nodes[i].hasAttribute("replaceext")){
					var replacement = nodes[i].getAttribute("replaceext").replace(/ /g,'');					
					a.src = a.src.replace(/\.swf$/, '.'+replacement);
					if(replacement==="mp4"){
						this.videoManifest.push(a);	
					}else{
						this.manifest.push(a);
					}
				}else{
					var ext = a.src.substr(a.src.lastIndexOf('.')+1);	
					if(ext == "mp4"){
						this.videoManifest.push(a);	
					}
					this.manifest.push(a);
				}
				
			}			
		}
		fixSwf(this);	
		loadManifest(this);	
		this.linkActivities(this);
		
	}
	function fixSwf(th){	
		for(var i=0, ii=th.manifest.length;i<ii;i++){	
		
			var ext = th.manifest[i].src.substr(th.manifest[i].src.lastIndexOf('.')+1);		
			if(ext == "swf"){
				th.manifest[i].src = th.manifest[i].src.substr(0, th.manifest[i].src.lastIndexOf('.')+1) + "png";
				
			}
		}			
	}
	function loadManifest(th){
		th.queue = new createjs.LoadQueue(true);
		th.queue.installPlugin(createjs.Sound);
		th.queue.on("fileload", assetLoaded, th);
		th.queue.on("complete", allLoaded, th);
		th.queue.on("error", function(e){
			if(e.data && e.data.ext === "png"){
				var src = e.data.src.substr(0, e.data.src.lastIndexOf('.')+1) + "js";			
				th.queue.loadFile({id:e.data.id, src:src});
			}	
		});
		//queue.loadManifest(th.manifest);
		th.queue.on("progress", function(){
			th.percentLoaded = Math.round(th.queue.progress * 100);			
		});
		if(th === Global.model.pages[0]){	
			Global.controller.chooseLoader();	
		}
	}
	function vidLoaded(e){
		e.item.vid = e.result;				
		e.item.width = e.result.width;
		e.item.height = e.result.height;
		this.videos.push(e.item);
	}
	function assetLoaded(e){
	
		switch(e.item.ext){
			
			case "mp3":
				e.item.sound = e.result;
				this.sounds.push(e.item);
				
				break;
				
			case "png":
				e.item.pic = e.result;
				e.item.width = e.result.width;
				e.item.height = e.result.height;
				this.images.push(e.item);
				break;
				
			case "mp4":
				e.item.vid = e.result;
				e.item.width = e.result.width;
				e.item.height = e.result.height;
				this.videos.push(e.item);
				break;
				
			case "js":
				e.item.namespace = e.item.src.substr(0, e.item.src.lastIndexOf('/')).substring(e.item.src.indexOf("/") + 1).substring(e.item.src.indexOf("/") + 2);
				this.customjs.push(e.item);
				break;
				
		}			
	}
	
	
	function allLoaded(e){
		this.loaded = true;	
		Global.controller._loading=false;
		Global.controller.chooseLoader();	
	}
	function displayError(e){
		
	}
	
	this.linkActivities = function (th){
		for(var i=0;i<th.numberOfScreens;i++){	
			var actsinpage = $(th.pagexml[i]).children("activities").children("activity");
			var tt = (th.pagexml[i].getAttribute("noRemove")==="true")?true:false;
			this.noRemove.push(tt);
			var cb = (th.pagexml[i].getAttribute("continueBtn")==="true")?true:false;
			var continueBt = {
				exists: cb	
			}
			if(cb){
				continueBt.x = (th.pagexml[i].getAttribute("continueBtnX"))?Number(th.pagexml[i].getAttribute("continueBtnX")):null;
				continueBt.y = (th.pagexml[i].getAttribute("continueBtnY"))?Number(th.pagexml[i].getAttribute("continueBtnY")):null;
				continueBt.text = (th.pagexml[i].getAttribute("continueBtnText"))?th.pagexml[i].getAttribute("continueBtnText"):"Continue";
			}
			
			
			this.continueBtn.push(continueBt);
			if(th.pagexml[i].getAttribute("clearTime") != undefined){
				this.timedProgression.push(Number(th.pagexml[i].getAttribute("clearTime")));
				
				
			}else{
				this.timedProgression.push(null);
			}
		/*	var ns = (th.pagexml[i].getAttribute("noSoundHTML")==="true")?true:false;
			this.noSound.push(ns);*/
			for(var a=0,aa=actsinpage.length;a<aa;a++){
				var obj = {
					name: actsinpage[a].childNodes[0].nodeValue,
					pageNumber: i,
					
				};
				th.activities.push(obj);	
			}
		
			if(th.pagexml[i].getAttribute("stopSoundWithTransition") != undefined && th.pagexml[i].getAttribute("stopSoundWithTransition")==="true"){
				this.stopSound.push(true);
			}else{
				this.stopSound.push(false);	
			}
		}
		return th.activities;
	};
	this.setComplete = function(c){
		this.completed = c;
		
	};
}

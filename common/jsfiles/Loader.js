// JavaScript Document
function moduleXmlloader(){}
(function(){
	var THIS = this;
	var loaderitems, information, pagexml;
	var master;
	
	this.loadXml = function(path, controller){		
		master = controller;
		var preload = new createjs.LoadQueue(false);
		preload.on("fileload", handleFileComplete);
		preload.on("error", displayError);
		preload.loadFile(path);	
	};
	this.loadGlossary = function(path, controller){
		var preload = new createjs.LoadQueue(false);	
		preload.on("fileload", controller.handleXml);
		preload.on("error", displayError);
		preload.loadFile(path);		
	};
	function displayError(e){
		
	}
	function handleFileComplete(event){
		var res = event.result.documentElement;		
		loaderitems = [];		
		pagesxml = [];			
		
		loaderitems = res.getElementsByTagName("XMLLoader");
		Global.model.setCourseTitle(res.getElementsByTagName("coursetitle")[0].childNodes[0].nodeValue);
		Global.model.setModTitle(res.getElementsByTagName("modtitle")[0].childNodes[0].nodeValue);
		if( res.getElementsByTagName("iAmDeveloping")[0]){
			Global.model.development = (res.getElementsByTagName("iAmDeveloping")[0].childNodes[0].nodeValue == "true") ? true:false; 
		}
		if( res.getElementsByTagName("scorm")[0]){
			Global.model.setScorm((res.getElementsByTagName("scorm")[0].childNodes[0].nodeValue === "true") ? true:false);
			if(Global.model.scorm){
				Global.scormController = new Controllers.scormController();
				Global.model.scormInitialised = Global.scormController.loadPage();
			}
		}
		
		View.addCourseTitle();
		pagesxml = res.getElementsByTagName("page");	
		Global.model.setNumberOfPages(pagesxml.length);		
		var pages=[];
		for (var i=0,ii=pagesxml.length;i<ii;i++){		
			
			var p = new Models.page(loaderitems[i].getAttribute("name"));				
			p.route = loaderitems[i].getAttribute("url");					
			Global.model.addPageToArray(p);		
			getTitle(p);
			if(Global.model.development && !Global.model.scormInitialised){
				p.setComplete(true);
				p.setAvailable(true);				
			}else if(Global.model.development && Global.model.scormInitialised){
				p.setComplete(false);
				p.setAvailable(true);
			}else if(!Global.model.development && Global.model.scormInitialised){
				if(Global.model.scormProgress[i] === "1"){
					p.setComplete(true);
				}else{
					p.setComplete(false);	
				}	
				if(!Global.model.pages[i-1] || Global.model.pages[i-1].completed) p.setAvailable(true);			
			}
			p.loadData();
		}	
		Global.menuController.setMenu(Global.model.pages);
		if(Global.model.scormInitialised && Global.model.scormBookmark>0){
			master.setBookmarkPopup();
		}else{
			master.setPage(0);
		}
						
	}
	function getTitle(p){
		for (var i=0,ii=pagesxml.length;i<ii;i++){		
			if(pagesxml[i].getAttribute("xmlName") == p.name){					
				p.title = pagesxml[i].childNodes[0].nodeValue;				
				break;					
			}		
		}		
	}
	
			
}).apply(moduleXmlloader);
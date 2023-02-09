// JavaScript Document
var View = View || {};

View.clearContents = function(fade){
	"use strict";
	var _fade = (fade!=null || fade!=undefined)?fade:false;
	var holder = document.getElementById("stage");
	if(!_fade){		
		while (holder.firstChild) {
			holder.removeChild(holder.firstChild);
		}	
	}else{
	
		for(var i=0,ii=holder.childNodes.length;i<ii;i++){
			TweenLite.to(holder.childNodes[i], 0.25, {autoAlpha:0});	
		}
	}	
};
View.launchPage = function (p){
	"use strict";
	var holder = document.getElementById("stage");
	for(var i=0,ii=p.activities.length;i<ii;i++){
		if(p.activities[i].pageNumber == p.pageposition){
			Factory.activityStore.createActivity(p.activities[i].name, p, holder);
		}
	}
	if((p.pagexml[p.pageposition].getAttribute("sound")!=null || p.pagexml[p.pageposition].getAttribute("sound")!=undefined) && p.pagexml[p.pageposition].getAttribute("noSoundHTML")!=="true"){
		Global.soundController.playSound(p.pagexml[p.pageposition].getAttribute("sound"), p);
	}
	
		
};
View.setPageNumber = function(p){
	var pn;
	if(!Global.model.getAfterAssessment()){
		pn = Global.model.numberOfPages;
	}else{	
		pn = Global.model.secondAttemptNumberOfPages;
	}
	$("#pagenumber").html(Global.model.pageOn+1+" / "+pn);
	View.editPageTitle(p.title);
};
var Factory = Factory || {};
Factory.activityStore = {
	createActivity: function(type, pageObject, holder){
		switch(type){
			case "Image":
				var actObject = new Activities.ImageActivity();
				actObject.buildActivity(pageObject, holder);
			break;	
			case "Bullets":
				var actObject = new Activities.BulletActivity();
				actObject.buildActivity(pageObject, holder);
			break;
			case "AddText":
				var actObject = new Activities.TextActivity();
				actObject.buildActivity(pageObject, holder);
			break;
			case "ActivityText":
				var actObject = new Activities.ActivityText();
				actObject.buildActivity(pageObject, holder);
			break;
			case "ClickRevealStandard":
				var actObject = new Activities.ClickReveal();
				actObject.buildActivity(pageObject, holder);
			break;
			case "DefinitionMatcher":
				var actObject = new Activities.DefinitionMatcher();
				actObject.buildActivity(pageObject, holder);
			break;
			case "DragFromScrollerIntoList":
				var actObject = new Activities.DragFromScrollerIntoList();
				actObject.buildActivity(pageObject, holder);
			break;
			case "SelectItems":
				var actObject = new Activities.SelectItems();
				actObject.buildActivity(pageObject, holder);
			break;
			case "Assessment":
				var actObject = new Activities.Assessment();
				actObject.buildActivity(pageObject, holder);
				Global.controller.deactivateNav();

			break;
			case "DragDropToTargets":
				var actObject = new Activities.DragDropToTargets();
				actObject.buildActivity(pageObject, holder);
			break;
			case "Crossword":
				var actObject = new Activities.Crossword();
				actObject.buildActivity(pageObject, holder);
			break;
			case "QuestionSeriesWithResponse":
				var actObject = new Activities.QuestionSeriesWithResponse();
				actObject.buildActivity(pageObject, holder);
			break;
			case "DragDropIntoList":
				var actObject = new Activities.DragDropIntoList();
				actObject.buildActivity(pageObject, holder);
			break;
			case "LinkLists":
				var actObject = new Activities.LinkLists();
				actObject.buildActivity(pageObject, holder);
			break;
			case "ScenarioSeriesWithSelectionBtns":
				var actObject = new Activities.ScenarioSeriesWithSelectionBtns();
				actObject.buildActivity(pageObject, holder);
			break;
			case "RadioButtons":
				var actObject = new Activities.RadioButtons();
				actObject.buildActivity(pageObject, holder);
			break;
			case "OrderItems":
				var actObject = new Activities.OrderItems();
				actObject.buildActivity(pageObject, holder);
			break;
			case "DragFromScrollerAnimated":
				var actObject = new Activities.DragFromScrollerIntoListAnimated();
				actObject.buildActivity(pageObject, holder);
			break;
			case "Video":
				var actObject = new Activities.Video();
				actObject.buildActivity(pageObject, holder);
			break;
			
		}
	}
}
View.addCourseTitle = function(){
	$("#shelltop").prepend("<h1 id=\"courseTitle\">"+Global.model.courseTitle+"</h1>");	
	$("#shelltop").prepend("<h2 id=\"pageTitle\"></h2>")
}
View.editPageTitle = function(t){
	$("#pageTitle").text(t);
}
View.activeButton = function(btn){
	"use strict";
	
	if(!btn.hasClass("active")){
		btn.addClass("active");
			
	}
	if(btn.hasClass("inactive")){
		btn.removeClass("inactive");
	}
	
};
View.inactiveButton = function(btn){
	"use strict";
	if(!btn.hasClass("inactive")){
		btn.addClass("inactive");
	}
	if(btn.hasClass("active")){
		btn.removeClass("active");
	}
};
View.buttonPulse = function(btn){
	"use strict";
	var tn1 = TweenMax.to(btn, 0.6, {boxShadow:'0px 0px 1px 1px rgb(168,255,164)', repeat:-1, yoyo:true, ease:Linear.easeNone, paused:true});	
	tn1.play();
	
	btn.on('mouseleave', function()
	{
	  tn1.play();
	});
	btn.on('mouseenter', function()
	{
	  var currentTime = tn1.time();
	  tn1.reverse(currentTime);
	});
	Global.model.currentPageObject.addToReset(tn1);
};
View.resizeView = function(){
	//TweenLite.set($("#holder"), {zoom: Global.model.zoom});
	$("#holder").css({"zoom":Global.model.zoom, "-moz-transform": "scale("+Global.model.zoom+")"});
};
View.launchBookmarkPopup = function(noid, yesid){
	var popup = new Helpers.popup();
		popup.setName("bookmark_popup");
		popup.setClosebtn(false);
		popup.setWidth(500);
		popup.setHeight(200);
		popup.addToStage($("#stage"));	
		$("#"+popup.name).append("<h3 style='text-align:center; margin:30px auto;'>Would you like to continue the course where you left off?</h3>");
			
		var b = new Helpers.Button("Yes");
		b.setWidth(200);		
		b.setId(yesid);
		b.drawButton("#bookmark_popup");			
		var bx = popup.width - 220;
		var by = popup.height - 50;
			
		TweenLite.set($("#"+yesid),{ left: bx, top: by});
		
		var b2 = new Helpers.Button("No");
		b2.setWidth(200);		
		b2.setId(noid);
		b2.drawButton("#bookmark_popup");			
		var b2x = 20;
		var b2y = popup.height - 50;
			
		TweenLite.set($("#"+noid),{ left: b2x, top: b2y});
		
};

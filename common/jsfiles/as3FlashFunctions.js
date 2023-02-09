var InternetExplorer = navigator.appName.indexOf("Microsoft") != -1;
var StartTime, EndTime, SessionTime;
var hasFinished = false;
var initalTime=new Date();
//
var susData="";
var bmPage="";

var curSession;
var passedFailed;
var score = 0;

//
// Handle all the the FSCommand messages in a Flash movie

function sendProgress(variables){
	LMSSetValue("cmi.suspend_data",variables);
	LMSCommit();
}
function getProgress(){
	var data=LMSGetValue("cmi.suspend_data");
	susData=data;
	score=LMSGetValue("cmi.core.score.raw");
	return data;
}

function flashSetProgress(variables){
	susData=variables;
	var api = getAPIHandle();
	if (api != null){
		LMSSetValue("cmi.suspend_data",susData);	
		LMSCommit();
  	 }else{
		alert("You have lost connection to the LMS. Please exit the course and reload.");	
	}
}
function sendBookmark(variables){
	LMSSetValue("cmi.core.lesson_location",variables);
	LMSCommit();
}
function getBookmark(){
	var data=LMSGetValue("cmi.core.lesson_location");
	bmPage=data;
	return data;	
}
function flashSetBookmark(variables){
	bmPage=variables;
}
function getLessonStatus(){
	var data=LMSGetValue("cmi.core.lesson_status");
	return data;	
}

function flashSetLessonStatus(variables){
	passedFailed=variables;
}
function flashSetLessonScore(variables){
	score=variables;
	LMSSetValue("cmi.core.score.raw",variables);
	LMSCommit();
}

function MillisecondsToCMIDuration(LessonDuration) {
	var hr ="000" + Math.floor(LessonDuration/(60*60*1000));
	var temp = (LessonDuration-(hr*60*60*1000));
	var min = "0" + Math.floor(temp/(60*1000));
	var sec = temp-(min*60*1000);
	temp = temp - (sec*1000)
	var ms = "0" + Math.floor(temp/1000);
	sec = "0" + Math.floor(sec/1000);
	var LessonDurationFormat = hr.substr(hr.length-4)+":"+min.substr(min.length-2)+":"+sec.substr(sec.length-2)+"."+ms.substr(ms.length-2);
	//alert(LessonDuration+"  "+ms)
	return LessonDurationFormat;

}

// SCOReportSessionTime is called automatically by this script,
// but you may call it at any time also from the SCO
function gettSessionTime() {
	var dtm = new Date();
	var n = dtm.getTime() - initalTime.getTime();
	return MillisecondsToCMIDuration(n);
}



function startCourse(){
	api = getAPIHandle();
	if(api!=null) {
		LMSInitialize();
		passedFailed=getLessonStatus();
	}
	initalTime=new Date();	
}

function closeCourse(){
	api = getAPIHandle();
	if (api != null) {
		
		var timespent=gettSessionTime();
		LMSSetValue("cmi.core.session_time",timespent);
		LMSSetValue("cmi.suspend_data",susData);		
		LMSSetValue("cmi.core.lesson_location",bmPage);	
		if(passedFailed!="incomplete" && passedFailed!="passed" && passedFailed!="completed"){
			passedFailed="incomplete";
		}  
		LMSSetValue("cmi.core.lesson_status",passedFailed);	
			
		//data=document.getElementById("shell").GetVariable("score");
		//LMSSetValue("cmi.core.score.raw",data);
		LMSCommit();
		LMSFinish();
	}
}

function closeWindow(){
	closeCourse();
	top.window.close();
}


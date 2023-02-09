var InternetExplorer = navigator.appName.indexOf("Microsoft") != -1;
var StartTime, EndTime, SessionTime;
var hasFinished = false;
var initalTime=new Date();
//
var susData

var curSession;

//
// Handle all the the FSCommand messages in a Flash movie

function shell_DoFSCommand(command, args) {
	
  var shellObj = InternetExplorer ? shell : document.shell;
  switch(command){
  	case "alert":
		alert(args);
		break;	
	case "quit":		        
		top.window.close()	
		break;
		
	
	case "getLMSData":
		if(api!=null) {
			shellObj.StopPlay();	
			var data=doLMSGetValue("cmi.suspend_data");		 
			shellObj.SetVariable("suspendData",data);
			
			
			data=doLMSGetValue("cmi.core.lesson_location");	
			if(data==null || data=="null" || data==""  || data==undefined){
				data=0
			}
			shellObj.SetVariable("bookMark",data);
		
			data=doLMSGetValue("cmi.core.score.raw");			
			shellObj.SetVariable("score",data);
			
			data=doLMSGetValue("cmi.core.student_name");
			
			if(data==null || data=="null" || data==""  || data==undefined || data=="undefined"){
				data= "Ashley Reddy"
			}
			shellObj.SetVariable("userName_str",data);
			//alert("userCommonName="+data)
			
			
			/*Its only write only privilage
			
			data=doLMSGetValue("cmi.core.session_time");
			//alert("session_time type"+typeof(data))
			if(data==null || data=="null" || data==""  || data==undefined){		
			   data = "00:00:00"
			}
			
			shellObj.SetVariable("LessonDurationFormat",data);
			alert("LessonDurationFormat="+data)

			*/
			data=doLMSGetValue("cmi.core.lesson_status");
		
			if(data == "not attempted"){			
				data = "incomplete"
				doLMSSetValue("cmi.core.lesson_status",data);
				doLMSCommit();
			}
			shellObj.SetVariable("lessonStatus",data);
			
			shellObj.Play();
		}
		break;
				
	case "updateCourseStatus":		
		if(api!=null) {
		    var data=shellObj.GetVariable("suspendData");	        
			doLMSSetValue("cmi.suspend_data",data);
			//alert("susData "+data)
			
			data=shellObj.GetVariable("bookMark");
			doLMSSetValue("cmi.core.lesson_location",data);	
			
			data=shellObj.GetVariable("score");	
			doLMSSetValue("cmi.core.score.raw",data);
			
			data=shellObj.GetVariable("LessonDurationFormat");
			//alert("session_time type="+typeof(data)+"  LessonDurationFormat="+data)
			doLMSSetValue("cmi.core.session_time",data);
			//alert("LessonDurationFormat="+data)
			
			data=shellObj.GetVariable("lessonStatus");			
			doLMSSetValue("cmi.core.lesson_status",data);
			
			doLMSCommit();
		}
		break;
		
		
	case "getXmlPath":
		
		shellObj.StopPlay();	
	
		//shellObj.SetVariable("modXML","content/module-1/modulexml/shell.xml");
		//shellObj.SetVariable("classXML","content/module-1/modulexml/classes.xml");
		//shellObj.SetVariable("modTrans","content/module-1/modulexml/transcript.xml");
		//shellObj.SetVariable("modGloss","content/module-1/modulexml/glossary.xml");
		
		shellObj.SetVariable("modXML",getModXML);
		shellObj.SetVariable("classXML",getClassXML);
		shellObj.SetVariable("modTrans",getModTrans);
		shellObj.SetVariable("modGloss",getModGloss);
		//alert("modXML="+shellObj.GetVariable("modXML"))
		shellObj.Play();
	
	break;
	
  }
}

// Hook for Internet Explorer 
if (navigator.appName && navigator.appName.indexOf("Microsoft") != -1 && navigator.userAgent.indexOf("Windows") != -1 && navigator.userAgent.indexOf("Windows 3.1") == -1) {
	document.write('<SCRIPT LANGUAGE=VBScript\> \n');
	document.write('on error resume next \n');
	document.write('Sub shell_FSCommand(ByVal command, ByVal args)\n');
	document.write('  call shell_DoFSCommand(command, args)\n');
	document.write('end sub\n');
	document.write('</SCRIPT\> \n');
}


function startCourse(){
	
	api = getAPIHandle();
	
	if(api!=null) {
		doLMSInitialize()
	}
	initalTime=new Date();	
}

function closeCourse(){
	api = getAPIHandle();

	if (api != null) {
		
		var timespent=gettSessionTime();
		doLMSSetValue("cmi.core.session_time",timespent);
		
		var data=document.getElementById("shell").GetVariable("suspendData");		
		doLMSSetValue("cmi.suspend_data",data);		

		data=document.getElementById("shell").GetVariable("bookMark");		
		doLMSSetValue("cmi.core.lesson_location",data);

		data=document.getElementById("shell").GetVariable("lessonStatus");		
		doLMSSetValue("cmi.core.lesson_status",data);	
			
		//data=document.getElementById("shell").GetVariable("score");
		//LMSSetValue("cmi.core.score.raw",data);
		doLMSCommit();
		doLMSFinish();
	}
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
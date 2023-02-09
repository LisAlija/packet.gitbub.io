// JavaScript Document
var Global = Global || {};	
var Beginning = Beginning || {};
Beginning.flash = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' width='100%' height='100%' id='Food Safety Level 3' align='middle'><param name='movie' value='../shell_as3.swf'/><object type='application/x-shockwave-flash' data='../shell_as3.swf' width='100%' height='100%'><param name='movie' value='../shell_as3.swf'/><a href='http://www.adobe.com/go/getflash'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a></object></object>"

Beginning.html = "<div id='holder'><div id='contents'><div id='shelltop'></div><div id='stage'></div><a id='closebtn' class='btn sae-btn'>Save & Exit</a><a id='btn-glossary' class='nav-btn'>Glossary</a><a id='btn-menu' class='nav-btn nav-btn-2left-corners'>Menu</a><a id='btn-help' class='nav-btn nav-btn-2right-corners'>Help</a><a id='btn-transcript' class='nav-btn nav-btn-2left-corners'>Transcript</a><a id='btn-replay' class='nav-btn nav-btn-2right-corners'><img src='../common/images/replay.png' width='20' height='20' alt=''/></a><a id='btn-prev' class='nav-btn nav-btn-4-corners'><img src='../common/images/leftarrow.png' width='17' height='20' alt=''/>Prev</a><p id='pagenumber'></p><a id='btn-next' class='nav-btn nav-btn-4-corners'>Next<img src='../common/images/rightarrow.png' width='17' height='20' alt=''/></a><div id='transcript'><div class='transcript_header'><h4 id='transcript_handle'>Transcript</h4></div><div id='transcript-inner'></div></div></div></div>"

$(document).ready(function(e) {	
alert("hi");
	function detectOldIe(){
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		alert(msie);
		if (msie > 0) {
		// IE 10 or older => return version number
		alert(parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10));
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}
		
		var trident = ua.indexOf('Trident/');
		alert("trident: "+trident);
		if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}
		
		// other browser
		return false;
		}
	
		if(createjs.BrowserDetect.isIOS || createjs.BrowserDetect.isAndroid || createjs.BrowserDetect.isChrome || createjs.BrowserDetect.isFirefox){
	alert("hi2");	
	var ua = window.navigator.userAgent;
		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			loadHtml(false);
		}
		loadHtml();
		}else{
		console.log('detectoldie');
			if(detectOldIe()){ 
				loadFlash();
			}else{
				loadHtml(false);
			}
	}
	
	function loadHtml(zoom){
		var z = (zoom)?zoom:true;
		$("body").append(Beginning.html);
		Global.model = new Models.global();
		Global.model.setZoomBrowser(z);
		Global.controller = new Controllers.master();
		Global.soundController = new Controllers.soundController();
		Global.soundController.activateTranscript("#transcript-inner", "#btn-transcript", ".transcript_header" );
		Global.menuController = new Controllers.menuController();
		Global.controller.begin();
		Global.controller.loadGlossary();
		Global.controller.loadHelp();
		if(Global.model.scormInitialised){
			$(window).unload(Global.scormController.doQuit);
		}
	}
	
	function loadFlash(){
		$("body").append(Beginning.flash).unload(closeCourse);
		$(window).unload(closeCourse);
		startCourse();
	}
});	
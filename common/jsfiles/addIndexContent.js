// JavaScript Document
var Global = Global || {};	
var Beginning = Beginning || {};
Beginning.flash = "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' width='100%' height='100%' id='Food Safety Level 3' align='middle'><param name='movie' value='../shell_as3.swf'/><object type='application/x-shockwave-flash' data='../shell_as3.swf' width='100%' height='100%'><param name='movie' value='../shell_as3.swf'/><a href='http://www.adobe.com/go/getflash'><img src='http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif' alt='Get Adobe Flash player'/></a></object></object>"

Beginning.html = "<div id='holder'><div id='contents'><div id='shelltop'></div><div id='stage'></div><a id='closebtn' class='btn sae-btn'>Save & Exit</a><a id='btn-glossary' class='nav-btn'>Glossary</a><a id='btn-menu' class='nav-btn nav-btn-2left-corners'>Menu</a><a id='btn-help' class='nav-btn nav-btn-2right-corners'>Help</a><a id='btn-transcript' class='nav-btn nav-btn-2left-corners'>Transcript</a><a id='btn-replay' class='nav-btn nav-btn-2right-corners'><img src='../common/images/replay.png' width='20' height='20' alt=''/></a><a id='btn-prev' class='nav-btn nav-btn-4-corners'><img src='../common/images/leftarrow.png' width='17' height='20' alt=''/>Prev</a><p id='pagenumber'></p><a id='btn-next' class='nav-btn nav-btn-4-corners'>Next<img src='../common/images/rightarrow.png' width='17' height='20' alt=''/></a><div id='transcript'><div class='transcript_header'><h4 id='transcript_handle'>Transcript</h4></div><div id='transcript-inner'></div></div></div></div>"

$(document).ready(function(e) {	

	function detectOldIe(){
		var ua = window.navigator.userAgent;

		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
		// IE 10 or older => return version number
		return "old";
		}
		
		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
		// IE 11 => return version number
		return "old";
		}
		
		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
		// IE 12 => return version number
		return "edge";
		}
		
		// other browser
		return "notie";
	}
		
	var browser = detectOldIe();
		if(browser!="notie" && browser!="edge"){ 
			loadFlash();
		}else if(browser!="notie" && browser=="edge"){
			loadHtml(false);
		}else{		
			function BrowserDetect() {
				throw "BrowserDetect cannot be instantiated";
			}
		
			var agent = BrowserDetect.agent = window.navigator.userAgent;
			BrowserDetect.isWindowPhone = (agent.indexOf("IEMobile") > -1) || (agent.indexOf("Windows Phone") > -1);
			BrowserDetect.isFirefox = (agent.indexOf("Firefox") > -1);
			BrowserDetect.isOpera = (window.opera != null);
			BrowserDetect.isChrome = (agent.indexOf("Chrome") > -1);  
			BrowserDetect.isIOS = (agent.indexOf("iPod") > -1 || agent.indexOf("iPhone") > -1 || agent.indexOf("iPad") > -1) && !BrowserDetect.isWindowPhone;
			BrowserDetect.isAndroid = (agent.indexOf("Android") > -1) && !BrowserDetect.isWindowPhone;
			BrowserDetect.isBlackberry = (agent.indexOf("Blackberry") > -1);
			
			if(BrowserDetect.isIOS || BrowserDetect.isAndroid || BrowserDetect.isChrome || BrowserDetect.isFirefox){
				loadHtml(true);
			}else{
				loadHtml(false);
			}
			
		}
		
	
	
	function loadHtml(zoom){
		var fileArray = [
			"../common/jsfiles/soundjs/lib/soundjs-0.6.1.min.js",
			"../common/jsfiles/gs/utils/Draggable.min.js",
			"../common/jsfiles/gs/TweenMax.min.js",
			"../common/jsfiles/release/shell.min.js"
		];
		
		var queue = new createjs.LoadQueue();
		queue.on("complete", handleComplete);
		queue.on("error", handleError);
		queue.loadManifest(fileArray); 
		queue.load();
		function handleError(event){
		}
		function handleComplete(event){
			var z = (zoom)?true:false;
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
	}
	
	function loadFlash(){
		$("body").append(Beginning.flash).unload(closeCourse);
		$(window).unload(closeCourse);
		startCourse();
	}
});	
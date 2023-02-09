
document.write('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" //codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0"  id="shell" width="100%" height="100%" align="left">')


/*
var myHT="100%"
var myWD=((screen.width/screen.height)*75)+"%"

document.write('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"  id="shell"')

document.write("WIDTH='"+myWD+"' HEIGHT='" + myHT + "' align='left' leftmargin='0' topmargin='0' marginwidth='0' marginheight='0'   >")
*/


document.write('<param name="allowScriptAccess" value="always" />')
document.write('<param name="movie" value="../shell_as3.swf" />')
document.write('<param name="quality" value="high" />')
document.write('<param name="bgcolor" value="#7446A2" />')
document.write('<param name="menu" value="false"/>')
//document.write('<param name="fullscreen" value="false"/>')
//document.write('<param name="allowscale" value="true"/>')
document.write('<param name="FlashVars"/>')

document.write('<embed src="../shell_as3.swf" quality="high" FlashVars= bgcolor="#7446A2" id="shell" name="shell" align="left" allowScriptAccess="always" allowscale="true" width="100%" height="100%" menu="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />')

document.write('</object>')


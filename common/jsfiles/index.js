function openwin() {
window.open('shell.html','','scrollbars=no,titlebar=no,menubar=no,height=500,width=660,center,middle,resizable=no,toolbar=no,location=no,status=no');
window.opener='x';
window.open('close.htm', '_self');
//self.close();
}

// JavaScript Document
var Activities = Activities || {};
Activities.base = function(){
	this.complete = false;
	this.content = null;
	this.page = 0;
	this.setToComplete = function(){
		if(!this.complete){
			this.complete=true;
			Global.controller.pageComplete();
		}
		
	}
};

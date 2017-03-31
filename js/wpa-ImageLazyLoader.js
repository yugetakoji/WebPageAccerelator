/**
* Title     : ImageLazyLoader
* Auther  : yugeta@showcase-tv.com
* Update  : 2017.01.10
* Version : 0.1
*/
;(function(){
	
	var $$ = function(){
		// Debug-Message--
		console.log("WPA-ImageLazyLoader : Start");

		//$$.dom.__construct();
		this.setMutationObserver();

		// page load-status check
		if(document.readyState === "complete"){
			this.setScroll();
		}
		else{
			this.setEvent(window , "DOMContentLoaded" , this.setScroll);
		}

		// set-Event
		this.setEvent(window , "scroll" , this.setScroll);
		this.setEvent(window , "resize" , this.setScroll);
	};
	
	// DOM-event-proccess
	$$.prototype.setMutationObserver = function(){
		var target = document.getElementsByTagName("html");
		if(!target.length){return}
		var mo = new MutationObserver(function(mutationRecords){
			for(var i=0; i<mutationRecords.length; i++){
				for(var j=0; j<mutationRecords[i].addedNodes.length; j++){
					// Image-Tag-Proc
					$$.prototype.setImageTags(mutationRecords[i].addedNodes[j]);
				}
			}
		});
		// Event-Set
		mo.observe(target[0] , {childList:true , subtree:true});
	};
	
	// image-default-set
	$$.prototype.setImageTags = function(elm){
		
		if(!elm || elm.nodeType !== 1){return}
		
		// Image-Tag
		if(elm.tagName === "IMG"){
			if(elm.getAttribute("data-wpa-src") === null){
				// set-lazyLoad
				elm.setAttribute("data-wpa-src" , elm.getAttribute("src"));
				elm.setAttribute("src" , "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
				$$.prototype.setClass.add(elm , "wpa-img");
			}
		}
		
		// Other-Tag
		else if(elm.childNodes.length > 0){
			var imgs = elm.getElementsByTagName("img");
			for(var i=0; i<imgs.length; i++){
				if(elm.getAttribute("data-wpa-src") !== null){continue}
				$$.prototype.setImageTags(imgs[i]);
			}
		}
	};
	
	// proccess-scroll-event
	$$.prototype.flgScroll = false;
	$$.prototype.setScroll = function(DebugViewFlg){

		// check
		if($$.prototype.flgScroll !== false){return}
		$$.prototype.flgScroll = true;

		//--
		var imgs = document.getElementsByClassName("wpa-img");
		for(var i=0,max=imgs.length; i<max; i++){
			if(imgs[0].tagName !== "IMG"){continue}
			var dataSrc = imgs[0].getAttribute("data-wpa-src");
			if(!dataSrc){continue}
			// check top-position [0 : window-margin(sample : +200)]
			if(imgs[0].getBoundingClientRect().top < window.innerHeight + 0){
				imgs[0].src = dataSrc;
				imgs[0].removeAttribute("data-wpa-src");
				$$.prototype.setClass.del(imgs[0] , "wpa-img");
			}
		}
		// flug-cancel
		$$.prototype.flgScroll = false;
	};
	
	/**
	* イベント処理（マルチブラウザ対応）
	* Event-Set
	* param @ target : Target-element
	* param @ mode : mode ["onload"->"load" , "onclick"->"click"]
	* param @ func : function
	**/
	$$.prototype.setEvent = function(target, mode, func){
		//other Browser
		if (target.addEventListener){target.addEventListener(mode, func, false)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
	};
	
	/**
	* Element set className Control
	*/
	$$.prototype.setClass = {
		add:function(elm , str){
			if(!elm){return}
			var className = elm.getAttribute("class");
			if(className === null || className === ""){
				elm.setAttribute("class" , str);
			}
			else if(this.find(elm , str) === false){
				elm.className += " "+str;
			}
		},
		del:function(elm , str){
			if(!elm){return}
			var cName = elm.className;
			if(!cName){return}
			var cNames = cName.split(" ");
			var newClassName = [];
			for(var i=0; i<cNames.length; i++){
				if(cNames[i] === str){continue}
				newClassName.push(cNames[i]);
			}
			elm.className = newClassName.join(" ");
		},
		/**
		* className of Element search string
		* return @ boolean [ include -> true / none -> false ]
		*/
		find:function(elm , str){
			if(!elm){return null}
			var classStr = elm.getAttribute("class");
			if(classStr !== null && classStr !== ""){
				var arr = classStr.split(" ");
				if(arr.indexOf(str) !== -1){
					return true
				}
				else{
					return false;
				}
			}
			else{
				return null;
			}
		},
		classNames:function(){

		}
	};
	
	new $$();
	window.ImageLazyLoader = $$;
})();

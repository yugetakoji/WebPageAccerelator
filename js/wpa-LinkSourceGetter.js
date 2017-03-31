/**
* Title     : LinkSourceGetter
* Auther  : yugeta@showcase-tv.com
* Date     : 2017.03.30
* Version : 1.0
*/
;(function(){
	
	/**
	* start
	*/
	var $$ = function(){
		// Debug-Message--
		console.log("WPA-LinkSourceGetter : Start ");
		
		if(window.flgLinkSourceGetter == "set"){
			console.log("WPA-LinkSourceGetter : set-over");
			return;
		}
		
		//$$.dom.__construct();
		this.setMutationObserver();
		
		// page load-status check
		if(document.readyState === "complete"){
			this.setPageLoaded();
		}
		else{
			this.setEvent(window , "DOMContentLoaded" , $$.prototype.setPageLoaded);
		}
	};
	
	/**
	* loaded
	*/
	 $$.prototype.setPageLoaded = function(){
	 	var links = document.links;
	 	for(var i=0; i<links.length; i++){
	 		$$.prototype.setLinkTags(links[i]);
	 	}
	 	
	 	//flg-set
	 	window.flgLinkSourceGetter = "set";
	 };
	
	/**
	* DOM-event-proccess
	*/
	$$.prototype.setMutationObserver = function(){
		var target = document.getElementsByTagName("html");
		if(!target.length){return}
		var mo = new MutationObserver(function(mutationRecords){
			for(var i=0; i<mutationRecords.length; i++){
				for(var j=0; j<mutationRecords[i].addedNodes.length; j++){
					// Image-Tag-Proc
					$$.prototype.setLinkTags(mutationRecords[i].addedNodes[j]);
				}
			}
		});
		// Event-Set
		mo.observe(target[0] , {childList:true , subtree:true});
	};
	
	/**
	* set-link-tags
	*/
	$$.prototype.setLinkTags = function(elm){
		
		// checc-elm
		if(!elm || elm.nodeType != 1){return}
		
		// check-flg
		if(elm.getAttribute("data-link-flg") == "set"){return}
		
		// check-tag
		if(elm.tagName != "A"){return}
		
		// check-href
		if(!elm.href){return}
		
		// domain-check
		var hrefs = elm.href.split("/");
		if(hrefs.length < 2){return}
		if(hrefs[2] != location.host){return}
		
		// set-onclick
		elm.onclick = $$.prototype.procLinkClick;
		
		// set-flg
		elm.setAttribute("data-link-flg","set");
	};
	
	/**
	* proc-link-click
	*/
	$$.prototype.procLinkClick = function(){
		
		$$.prototype.ajax.set({
			url:this.href,
			method:"GET",
			async:"true",
			onSuccess:$$.prototype.setSourceChange
		});
		
		return false;
	};
	
	/**
	* getLinkSource
	*/
	$$.prototype.setSourceChange = function(res){
		// System
		console.log("WPA-LinkSourceGetter : [click] : " + this.url);

		// SetDOM
		var dom = document.createElement("html");
		dom.innerHTML = res;
		
		// Address-URL change
		history.pushState(null,null,this.url);
		
		/**
		* headとbodyのソースを入れ替え定義（script対応版）
		*/
		var rootNode = document.getElementsByTagName("html")[0];
		var domHTML = dom.getElementsByTagName("html")[0];
		var domHead = dom.getElementsByTagName("head")[0];
		var domBody = dom.getElementsByTagName("body")[0];
		var docHead = document.getElementsByTagName("head")[0];
		var docBody = document.getElementsByTagName("body")[0];
		
		// Body入れ替え
		rootNode.replaceChild(domBody , docBody);

		//スクロールtop
		window.scrollTo(0,0);

		// 読み込み後にリンク設定
		$$.prototype.setPageLoaded();
	};
	
	
	/**
	* Library
	*/
	$$.prototype.lib = {};
	
	/**
	* Ajax
	* $$.prototype.ajax.set({
	* url:"",					// "http://***"
	* method:"POST",	// POST or GET
	* async:true,			// true or false
	* data:{},				// Object
	* query:{},				// Object
	* querys:[]				// Array
	* });
	*/
	$$.prototype.ajax = {
		createHttpRequest:function(){
			//Win ie用
			if(window.ActiveXObject){
				//MSXML2以降用;
				try{return new ActiveXObject("Msxml2.XMLHTTP")}
				catch(e){
					//旧MSXML用;
					try{return new ActiveXObject("Microsoft.XMLHTTP")}
					catch(e2){return null}
				}
			}
			//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
			else if(window.XMLHttpRequest){return new XMLHttpRequest()}
			else{return null}
		},
		//XMLHttpRequestオブジェクト生成
		set:function(options){
			var ajax = $$.prototype.ajax;

			if(!options){return}
			var httpoj = new ajax.createHttpRequest();
			if(!httpoj){return;}
			//open メソッド;
			option = ajax.setOption(options);
			httpoj.open( option.method , option.url , option.async );
			//type
			httpoj.setRequestHeader('Content-Type', option.type);
			//onload-check
			httpoj.onreadystatechange = function(){
				//readyState値は4で受信完了;
				if (httpoj.readyState==4){
					//コールバック
					option.onSuccess(httpoj.responseText);
				}
			};
			//query整形
			var data = ajax.setQuery(option);
			//send メソッド
			if(data.length){
				httpoj.send(data.join("&"));
			}
			else{
				httpoj.send();
			}
		},
		dataOption:{
			url:"",
			query:{},				// same-key Nothing
			querys:[],			// same-key OK
			data:{},				// ETC-data event受渡用
			async:"true",		// [trye:非同期 false:同期]
			method:"POST",	// [POST / GET]
			type:"application/x-www-form-urlencoded", // [text/javascript]...
			//call-back
			onSuccess:function(res){/*console.log("Success:"+res)*/},
			onError:function(res){/*console.log("Error:"+res)*/}
		},
		setOption:function(options){
			var option = {};
			for(var i in this.dataOption){
				if(typeof options[i] != "undefined"){
					option[i] = options[i];
				}
				else{
					option[i] = this.dataOption[i];
				}
			}
			return option;
		},
		setQuery:function(option){
			var data = [];
			if(typeof option.query != "undefined"){
				for(var i in option.query){
					data.push(i+"="+encodeURIComponent(option.query[i]));
				}
			}
			if(typeof option.querys != "undefined"){
				for(var i=0;i<option.querys.length;i++){
					if(typeof option.querys[i] == "Array"){
						data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
					}
					else{
						var sp = option.querys[i].split("=");
						data.push(sp[0]+"="+encodeURIComponent(sp[1]));
					}
				}
			}
			return data;
		}
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
	
	new $$();
	
	window.LinkSourceGetter = $$;
})();

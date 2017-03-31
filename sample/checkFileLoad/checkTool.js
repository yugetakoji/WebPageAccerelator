/**
* Title     : CSSLazyLoader
* Auther  : yugeta@showcase-tv.com
* Date     : 2017.02.10
* Version : 1.0
*/
;(function(){
	
	var css = [
		"http://www.yahoo.co.jp/",
		"http://s.yimg.jp/images/top/sp2/clr/170307/1.css"
	];
	
	// start
	var $$ = function(){
		
		for(var i=0; i<css.length; i++){
			if(!css[i]){continue}
			this.lib.ajax.set({
				url:css[i],
				method:"POST",
				async:true,
				onSuccess:$$.prototype.setStyle
			});
		}
		
	};
	
	$$.prototype.setStyle = function(res){
		var style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = res;
		document.head.appendChild(style);
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
	$$.prototype.lib.ajax = {
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
			var ajax = $$.prototype.lib.ajax;

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
	
	new $$();
	
	window.CSSLazyLoader = $$;
})();

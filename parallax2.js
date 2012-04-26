;
/****
 * Author: Marcos Augusto Bitetti
 * mail marcosbitetti@gmail.com
 * 
 * http://www.rpgvale.com.br
 * http://www.wildwitchproject.com
 * 
 ****/
 
var parallax2 = ( function()
{
	this.stls = {
		bg1:null,
		bg2:null
	};
	this.bgHeight = 0;
	this.conf = null;
	this.trig = $(document.createElement('div'));
	
	this.winDef = function()
	{
	}
	
	this.configure = function(c)
	{
		this.conf = (c) ? c :{
			articleSelector:'article',
			backgroundSelector:'body'
		};
	}
	
	this.bind = function(evt, func)
	{
		parallax2.trig.bind(evt,func);
		return parallax2;
	}
	
	this.unbind = function(evt, func)
	{
		parallax2.trig.unbind(evt,func);
		return parallax2;
	}
	
	this.pageScroll = function()
	{
		var wh = $(window).height();
		var ph = $(document).height() - wh;
		var scT = $(document).scrollTop();
		var mSc = -scT / ph;
		var imgSc = parallax2.bgHeight - wh;
		var ratio = imgSc * mSc;
		
		var value = "50% " + String(parseInt(ratio)) + "px";
		parallax2.stls.bg1.style.backgroundPosition = value;
		parallax2.stls.bg2.style.backgroundPosition = value;
	}
	
	this.makeBG = function(e)
	{
		var img = e.target;
		var t1 = new Date();
		try
		{
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			var context = canvas.getContext('2d');
			context.drawImage(img,0,0);
			parallax2.stls.bg1.style.backgroundImage = 'url('+canvas.toDataURL()+')';
			stackBlurCanvasRGB(canvas, 0,0, img.width, img.height, 32);
			parallax2.stls.bg2.style.backgroundImage = 'url('+canvas.toDataURL()+')';
			canvas = null;
			parallax2.bgHeight = img.height;
			
			var t2 = new Date();
			var time = t2.getTime() - t1.getTime();
			parallax2.trig.trigger('done',['Tempo total ' + time.toString() + 'ms']);
		} catch (er) {/*alert(er)*/}
		
		img = null;
		}
	
	this.update = function(url)
	{
		if(url==null) return;
		parallax2.bgHeight = 0;
		var img = new Image();
		img.onload = parallax2.makeBG;
		img.src = url;
		
		parallax2.trig.trigger('init',['Tentando carregar ' + url]);
	}
	
	this.init = function()
	{
		if (parallax2.conf == null) parallax2.configure();
		var sheet = document.styleSheets[0];
		var rules = sheet.cssRules ? sheet.cssRules : sheet.rules;
		var totalrules = sheet.cssRules ? sheet.cssRules.length : sheet.rules.length;
		for(var i=0; i< rules.length; i++)
		{
			var a =rules[i].selectorText;
			if (a==parallax2.conf.articleSelector)
				parallax2.stls.bg2 = rules[i];
			if (a==parallax2.conf.backgroundSelector)
				parallax2.stls.bg1 = rules[i];
		}
		
		var url = String( /\([\'\"]+.*[\'\"]\)/g.exec( parallax2.stls.bg1.style.backgroundImage ) ).replace( /^[\(\"\' ]+/,'').replace( /[\)\"\']+$/,'');
		parallax2.update(url);
		
		if (parallax2.conf.disableScroll != undefined)
			if (parallax2.conf.disableScroll==true)
				return;
		$(window).scroll(parallax2.pageScroll);
	}
	
	
	// suporta CANVAS ?
	try
	{
	if ( HTMLCanvasElement == undefined)
		return this;
	} catch (err)
	{
		return this;
	}
	
	$(document).ready(this.init);
	$(window).resize(this.winDef);
	return this;
})();

var nwKiosk = function(){
	var fs = require("fs");
	var mouseHidden =true;
	var kioskMode=true;
	var devTools=true;
	var gui =require('nw.gui');
	var when = require('when');
	//setInterval(focus_window,5000);
	
	var win = gui.Window.get();
	this.win = win;
	var dataF = gui.App.dataPath;
	this.settingsPath = dataF+"/settings.json";
	var self = this;
	this.setup = function(){
	//	var dfd = when.defer();
		
		$(window).keypress(function(d){
			console.log("keypressed");
			switch(d.keyCode)
				{
				case 107:
					console.log("changeKioskMode "+!kioskMode);
				  (kioskMode) ? win.enterKioskMode() : win.leaveKioskMode() ;
				  kioskMode = !kioskMode;
				  break;
				case 109:
					console.log("changemouse ")
				  (mouseHidden) ? $("body").css("cursor","none") : $("body").css("cursor","pointer") ;
				  mouseHidden=!mouseHidden;
				  break;
				case 100:
				  (devTools) ? gui.Window.get().showDevTools() : gui.Window.get().closeDevTools();
				  devTools=!devTools;
				  break;
				}
		});
		
		function goFull(){
			win.enterKioskMode();
			$("body").css("cursor","none");
		}
		setInterval(goFull, 2000);
		/*loadSettings = function(){
			console.log("LOADING");
			var c= require(self.settingsPath);
			this.config = c;
			if(!c.mouse){
				console.log("hide mouse");
				self.hideMouse();
			}
			if(c.kioskMode){
				console.log("enter kiosk mode");
				win.enterKioskMode();
				kioskMode = true;
			}
			
			
			dfd.resolve(c);
		}
		
		fs.exists(this.settingsPath, function(b){
			if (!b){
				console.log("copy settings file")
				fs.createReadStream('settings.json').pipe(fs.createWriteStream(self.settingsPath).on("close", function(){loadSettings();}));
			}else{
				console.log("settings already exist");
				loadSettings();
			}
		});
		
		
		return dfd.promise;*/
	}
	
	this.hideMouse = function(){
		$("body").css("cursor","none");
		mouseHidden = true;
	}
	this.showMouse = function(){
		$("body").css("cursor","pointer");
		mouseHidden = false;
	}
	
}

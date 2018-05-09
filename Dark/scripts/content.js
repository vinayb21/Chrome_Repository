var YouTubeToPopUp = {
	settings: {
		oldUrl: '/',
		systemNumber: 0,
		lastInserted: 0,
		firstLoad: false,
		inCinemaMode: false,
		userSettings: {
			darkMode: true,
			popUps: true,
			cinemaMode: true,
			downloadButton: true,
			downloadMusicButton: true,
			inDarkMode: false,
		},
		youtubeSettings: {
			layout: 1
		}
	},

	init: function() {
		YouTubeToPopUp.addScripts();
		YouTubeToPopUp.loadSettings();

		if(document.title == "Error 400 (Bad Request)!!1") {
			// Go through all cookies and clear our cookies!
			var ca = document.cookie.split(';');

			for(var i = 0; i < ca.length; i++) {
				if(ca[i].indexOf("video_watcher_") !== -1) {
					var cookieName = ca[i].split('=');

					document.cookie = cookieName[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
					console.log(cookieName[0] + " removed");
				}
			}

			document.location.reload();
		}


		// Set a loop to check
		var yt2pLoop = setInterval(function() {
			if(document.getElementById('pla-shelf') != null) {
				YouTubeToPopUp.settings.youtubeSettings.layout = 2;

				if(!document.getElementsByTagName("body")[0].hasAttribute("style-theme", "2")) {
					document.getElementsByTagName("body")[0].setAttribute("style-theme", "2")
				}
			}

			// Do the Dark Check
			if(YouTubeToPopUp.settings.userSettings.inDarkMode) {
				YouTubeToPopUp.darkChecker();
			}else{
				if(document.getElementsByTagName("body")[0].hasAttribute("style-modus", "dark")) {
					document.getElementsByTagName("body")[0].removeAttribute("style-modus");
				}

				if(document.getElementById('YouTubePopupContainer_'+ YouTubeToPopUp.settings.systemNumber) != null && YouTubeToPopUp.hasClass(document.getElementById('YouTubePopupContainer_'+ YouTubeToPopUp.settings.systemNumber), 'dark')) {
					if(YouTubeToPopUp.settings.inCinemaMode == true) {
						return;
					}
					document.getElementById('YouTubePopupContainer_'+ YouTubeToPopUp.settings.systemNumber).classList.toggle('dark');
					document.getElementById('YouTubePopupContainer_'+ YouTubeToPopUp.settings.systemNumber).classList.toggle('light');
				}
			}

			// Check if the page has a new URL
			if(document.location.href == YouTubeToPopUp.settings.oldUrl) { return; } // Nope, stay like this.
			YouTubeToPopUp.settings.oldUrl = document.location.href;

			// Add scripts
			YouTubeToPopUp.addScripts();

			// Remember the use (if the user checks his/hers console) that this is a new video
			console.log("%c YouTube to PopUp: UPDATE! I see that there is another video!", "color: #2980b9");

			// Tell myself about the changed page!
			YouTubeToPopUp.changedPage();
		}, 500);
	},

	addScripts: function() {
		// Check YouTube to PopUp script is running
		if(document.getElementById("YoutubeToPopupScript") == null) {
			// Add the script from our plugin
			var fileref = document.createElement('script');
		    fileref.setAttribute("id","YoutubeToPopupScript");
		    fileref.setAttribute("type","text/javascript");
		    fileref.setAttribute("src", "chrome-extension://"+ chrome.runtime.id +"/Dark/scripts/youtubeToPopUpPlayerHandler.js");
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}

		if(document.getElementById("YoutubeToPopupStyle") == null) {
			var newCssFile = document.createElement('link');
		    newCssFile.setAttribute("id","YoutubeToPopupStyle");
		    newCssFile.setAttribute("rel","stylesheet");
		    newCssFile.setAttribute("type","text/css");
		    newCssFile.setAttribute("href", "chrome-extension://"+ chrome.runtime.id +"/Dark/css/YouTubeHandler.css");
			document.getElementsByTagName("head")[0].appendChild(newCssFile);
		}
	},

	changedPage: function() {
		// Remember the user that they are using my plugin
		console.log("%c YouTube to PopUp: Called and found the", "color: #2980b9");

		// Get the page URL
		var currentUrl = document.location.href;

		// Check if this is a YouTube video
		if(currentUrl.indexOf("youtube.com/watch?v=") > -1) {
			// Yup, change the icon
			chrome.runtime.sendMessage({ "newIconPath" : '/images/icon.png' });

			// Remember again (if the user checks his/hers/its console) :D
			console.log("%c YouTube to PopUp: This is a Youtube Video page", "color: #2980b9");

			// Add button ID
			YouTubeToPopUp.settings.systemNumber++;
			YouTubeToPopUp.loadSettings();

			var createButtonChecker = setInterval(function() {
				if(document.getElementById("YouTubePopupContainer_"+ YouTubeToPopUp.settings.systemNumber) == null) {
					YouTubeToPopUp.addButton(YouTubeToPopUp.settings.systemNumber);
				}else{
					clearInterval(createButtonChecker);
					if(YouTubeToPopUp.settings.userSettings.firstLoad == true) {
						YouTubeToPopUp.FirstLoad(YouTubeToPopUp.settings.systemNumber);
					}
				}
			}, 500);
		}else{
			// Remember the user (if it checks his/hers console) that this is not a youtube video page
			console.log("%c YouTube to PopUp: This is not YouTube", "color: #FF0000");			
		}
	},

	addButton: function(caller, reset) {
		if(!reset) { reset = false }
		if(YouTubeToPopUp.settings.lastInserted == caller && reset == false) { return; }
		YouTubeToPopUp.settings.lastInserted = caller;

		var newElement = "";

		if(YouTubeToPopUp.settings.youtubeSettings.layout == 2) {
			newElement += '<div id="info" class="style-scope ytd-watch">';
			YouTubeToPopUp.settings.userSettings.darkMode = false;
			YouTubeToPopUp.settings.userSettings.cinemaMode = false;
		}

		newElement += '<div class="yttpu_container clearfix '+ (YouTubeToPopUp.settings.userSettings.inDarkMode == true ? 'dark' : 'light') + (YouTubeToPopUp.settings.youtubeSettings.layout == 2 ? ' yttpu_themefix_2' : '') +'" id="YouTubePopupContainer_'+ caller +'">' +
			'<ul>' +
				(YouTubeToPopUp.settings.userSettings.darkMode ? '<li><a href="javascript:void(0)" title="Dark mode" id="YouTubePopupContainer_'+ caller +'_darkmodus" class="yttpu_darkmode yt-uix-tooltip"><span></span></a></li>' : '') +
			'</ul>' +
			'<ul class="rightbar">' +
				(YouTubeToPopUp.settings.userSettings.cinemaMode ? '<li><a href="javascript:void(0)" title="Cinema mode" id="YouTubePopupContainer_'+ caller +'_cinemamode" class="yttpu_cinema yt-uix-tooltip"><span></span></a></li>' : '') +
				'<li class="creator-bar-item">' +
					'<a href="javascript:void(0)" id="YouTubePopupContainer_'+ caller +'_pp" title="To Popup" class="yttpu_popup yt-uix-tooltip"><span></span></a>' +
				'</li>' +
			'</ul>' +
		'</div>';

		if(YouTubeToPopUp.settings.youtubeSettings.layout == 2) {
			newElement += '</div>';
		}

		// Add the icon to the title of the video

		if(document.getElementById('pla-shelf') != null) {
			document.getElementById('pla-shelf').insertAdjacentHTML('beforebegin', newElement);
		}else{
			document.getElementById('watch-header').insertAdjacentHTML('beforebegin', newElement);
		}

		// Daamn you YouTube! Not nice from you to reset the content while I was working on it!
		// I will just do it another time D:
		setTimeout(function() {
			if(document.getElementById('YouTubePopupContainer_'+ caller) == null) {
				YouTubeToPopUp.addButton(caller, true);
			}
		}, 500);

		setTimeout(function() {
			clearInterval(YouTubeToPopUp_pp_click.timer);
			YouTubeToPopUp_pp_click.init(caller);

			if(YouTubeToPopUp.settings.userSettings.cinemaMode && document.getElementById('YouTubePopupContainer_'+ caller +'_cinemamode') != null) {
				document.getElementById('YouTubePopupContainer_'+ caller +'_cinemamode').onclick = function() {
					document.getElementsByTagName("body")[0].classList.toggle('yttpu_cinemaMode');
					document.getElementById('YouTubePopupContainer_'+ caller +'_cinemamode').classList.toggle('on');
					YouTubeToPopUp.settings.inCinemaMode = (YouTubeToPopUp.settings.inCinemaMode ? false : true);

					if(YouTubeToPopUp.settings.userSettings.inDarkMode == false) {
						document.getElementById('YouTubePopupContainer_'+ caller).classList.toggle('dark');
					}
				};
			}

			// Dark modus button
			if(YouTubeToPopUp.settings.userSettings.darkMode && document.getElementById('YouTubePopupContainer_'+ caller +'_darkmodus') != null) {
				document.getElementById('YouTubePopupContainer_'+ caller +'_darkmodus').onclick = function() {
					YouTubeToPopUp.settings.userSettings.inDarkMode = (YouTubeToPopUp.settings.userSettings.inDarkMode == true ? false : true);
					chrome.storage.sync.set({
						inDarkMode: YouTubeToPopUp.settings.userSettings.inDarkMode
					});
					var s = document.getElementById("caption-container");
					var toggle = s.getElementsByTagName("paper-toggle-button")[0];
					if(!toggle.checked)toggle.click();
				};
			}
		}, 200);
	},

	setFunction: function(functionName) {
		var script = document.createElement('script');
		script.appendChild(document.createTextNode('('+ functionName +')();'));
		(document.body || document.head || document.documentElement).appendChild(script);
	},

	loadSettings: function() {
		chrome.storage.sync.get({
			darkMode: true,
			popUps: true,
			cinemaMode: true,
			downloadButton: true,
			downloadMusicButton: true,
			firstLoad: false,
			inDarkMode: false,
		}, function(items) {
			YouTubeToPopUp.settings.userSettings.darkMode = items.darkMode;
			YouTubeToPopUp.settings.userSettings.popUps = items.popUps;
			YouTubeToPopUp.settings.userSettings.cinemaMode = items.cinemaMode;
			YouTubeToPopUp.settings.userSettings.downloadButton = items.downloadButton;
			YouTubeToPopUp.settings.userSettings.downloadMusicButton = items.downloadMusicButton;
			YouTubeToPopUp.settings.userSettings.firstLoad = items.firstLoad;
			YouTubeToPopUp.settings.userSettings.inDarkMode = items.inDarkMode;
		});

		if(document.getElementById("YouTubePopupContainer_" + (YouTubeToPopUp.settings.systemNumber - 1)) != null) {
			document.getElementById("YouTubePopupContainer_" + (YouTubeToPopUp.settings.systemNumber - 1)).remove();
		}
	},

	FirstLoad: function(number) {
		var alreadyDone = false;
		chrome.storage.sync.set({
			firstLoad: false
		});

		function addInstallation() {
			return true;
			if(YouTubeToPopUp.settings.youtubeSettings.layout == 2) {
				var insertElement = document.getElementById("pla-shelf");
			}else{
				var insertElement = document.getElementById("watch7-content");
			}
			var insertElementOffset = insertElement.getBoundingClientRect();
			var documentHeight = Math.max(
	        	document.documentElement.clientHeight,
		        document.body.scrollHeight,
		        document.documentElement.scrollHeight,
		        document.body.offsetHeight,
		        document.documentElement.offsetHeight
		    );

			var installTop = insertElementOffset.top;

			if(YouTubeToPopUp.settings.youtubeSettings.layout == 2) {
				insertElementOffset.left -= 5;
				installTop = (insertElementOffset.top - 40);
			}

				// Left
			var installElement = '<div class="yttpu_installation" style="left: 0; top: 0; bottom: 0; position: fixed; width: '+ insertElementOffset.left +'px;"></div>';
				// Top
				installElement+= '<div class="yttpu_installation withtext" style="left: '+ insertElementOffset.left +'px; top: 0; width: '+ insertElement.offsetWidth +'px; height: '+ installTop +'px;"></div>';
				// Right
				installElement+= '<div class="yttpu_installation" style="right: 0px; top: 0; bottom: 0px; position: fixed; left: '+ (insertElementOffset.left + insertElement.offsetWidth)  +'px;"></div>';
				// Bottom
				installElement+= '<div class="yttpu_installation" style="top: '+ (installTop + 40) +'px; left: '+ insertElementOffset.left +'px; width: '+ insertElement.offsetWidth +'px; height: '+ (documentHeight - installTop - 40) +'px"></div>';

				installElement+= '<a href="javascript:void(0)" class="yttpu_go" id="yttpu-go-button">Okay! Close this</a>';

			window.document.body.insertAdjacentHTML( 'afterbegin', '<div id="yttpu-installator">' + installElement + '</div>');
		}

		YouTubeToPopUp.setFunction("YoutubeToPopUp_pp.pauseVideo");
		addInstallation();

		window.onresize = function(){
			if(alreadyDone == true) { return; }
			if(document.getElementById("yttpu-installator") != null) {
				document.getElementById("yttpu-installator").remove();
			}

			addInstallation();
		};

		document.getElementById('YouTubePopupContainer_'+ number).onclick = function() {
			if(document.getElementById("yttpu-installator") != null) {
				document.getElementById("yttpu-installator").remove();
			}
			alreadyDone = true;
			YouTubeToPopUp.saveFirstLoad();
		};
	},

	saveFirstLoad: function() {
		chrome.storage.sync.set({
			firstLoad: false
		});
	},

	hasClass: function(ele,cls) {
    	return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	},

	darkChecker: function() {
		if(!document.getElementsByTagName("body")[0].hasAttribute("style-modus", "dark")) {
			document.getElementsByTagName("body")[0].setAttribute("style-modus", "dark")
		}

		if(document.getElementById('YouTubePopupContainer_'+ YouTubeToPopUp.settings.systemNumber) != null && YouTubeToPopUp.hasClass(document.getElementById('YouTubePopupContainer_'+ YouTubeToPopUp.settings.systemNumber), 'light')) {
			document.getElementById('YouTubePopupContainer_'+ YouTubeToPopUp.settings.systemNumber).classList.toggle('dark');
			document.getElementById('YouTubePopupContainer_'+ YouTubeToPopUp.settings.systemNumber).classList.toggle('light');
		}
	},
	getCookie: function(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	},
	callMeMaybe: function() {
		console.log("no!");
	},
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
};

var YouTubeToPopUp_pp_click = {
	currentTabId: -1,
	timer: {},
	watchInterval: {},
	gotError: false,
	init: function(number) {
		// Check needed element exists
		if(document.getElementById('YouTubePopupContainer_'+ number +'_pp') == null) { return; }

		// Fire the pop-up when a user clicks on the pop-up image from the plugin
		document.getElementById('YouTubePopupContainer_'+ number +'_pp').onclick = function()
		{
			// Check time element
			if(document.getElementById("youtubeToPopUpPlayerHandlerInput") == null) {
				return;
			}
			// Get time
			var time = document.getElementById("youtubeToPopUpPlayerHandlerInput").value;
			var url = document.location.href;

			var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var match = url.match(regExp);
			if (match && match[2].length == 11) {
				var generatedLink = "https://www.youtube.com/embed/" + match[2] + "?start=" + time + "&autoplay=1";
			}else{
				// Check type, play-list or only stand-alone video, then create the link
				if(url.indexOf("&list=") > -1) {
					// This is a play-list
					if(url.indexOf("&index=") > -1) {
						var generatedLink = url.replace("watch?v=", "embed/").replace("&index=", "?index=") + "&start=" + time + "&autoplay=1";
					}else{
						var generatedLink = url.replace("watch?v=", "embed/").replace("&list=", "?list=") + "&start=" + time + "&autoplay=1";
					}
				}else if(url.indexOf("&t=") > -1) {
					var generatedLink = url.replace("watch?v=", "embed/").replace("&t=", "?okay=true") + "&start=" + time + "&autoplay=1";
				}else{
					// Only one video
					var generatedLink = url.replace("watch?v=", "embed/") + "?start=" + time + "&autoplay=1";
				}
			}

			YouTubeToPopUp.setFunction("YoutubeToPopUp_pp.pauseVideo");
			var setVideoId = YouTubeToPopUp_pp_click.makeid();

			chrome.runtime.sendMessage({
				action: 'openPopUp',
				url: generatedLink,
				videoId: setVideoId
			});

			var attemd = 0;
			clearInterval(YouTubeToPopUp_pp_click.watchInterval);

			YouTubeToPopUp_pp_click.watchInterval = setInterval(function() {
				var videoTimer = YouTubeToPopUp.getCookie('video_watcher_' + setVideoId);
				if(videoTimer) {
					if(YouTubeToPopUp.getCookie('video_watcher_gone_' + setVideoId)) {
						clearInterval(YouTubeToPopUp_pp_click.watchInterval);
						YouTubeToPopUp.setFunction("YoutubeToPopUp_pp.setVideoTime('"+ videoTimer +"')");

						// Remove cookies
						document.cookie = 'video_watcher_gone_' + setVideoId + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
						document.cookie = 'video_watcher_' + setVideoId + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
					}
				}else{
					if(attemd == 40) {
						clearInterval(YouTubeToPopUp_pp_click.watchInterval);
						if(YouTubeToPopUp_pp_click.gotError == true) { return; }

						YouTubeToPopUp_pp_click.gotError = true;
						// if(confirm("We couldn't get a connection to the video window! Have you closed it already? Ignore this error.\n\nIf you are still watching that video where you are watching to, when you close, I won't update your video when you are back... Because I do not know where you were... Sorry!\n\nDo you want to add some feedback or report this error?")) {
						// 	var win = window.open('https://chrome.google.com/webstore/detail/youtube-to-popup/mocnfapnihakjijbcmgaboogaafokhoi/support', '_blank');
						// 	win.focus();
						// }
						return;
					}
					attemd++;
				}
			}, 500);
		};
	},
	makeid: function() {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

		var time = Date.now() / 1000 | 0;
	    return text + "-" + time.toString();
	},
    setVideoWatcher: function(id) {
		console.log("Hello! I am watching this video too for you now. So when you close this window I can try to start the default video player again :)");

		YouTubeToPopUp.setFunction("YoutubeToPopUp_pp.setVideoWatcher('"+ id +"')");
        return 'returnTrue';
    },
}
chrome.storage.local.get({darkModes: true}, function(items) {
      if (items.darkModes) YouTubeToPopUp.init();
});
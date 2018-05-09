/*
 * YouTube to PopUp system
 */
 var YoutubeToPopUp_pp = {
	startVideo: function() {
		document.getElementById("movie_player").playVideo();
	},
	pauseVideo: function() {
		document.getElementById("movie_player").pauseVideo();
	},
	setVideoTime: function(time) {
		document.getElementById("movie_player").seekTo(time);
    	document.getElementById("movie_player").playVideo();
	},
    setVideoWatcher: function(id) {
        setInterval(function() {
            if(document.getElementById("youtubeToPopUpPlayerHandlerInput") == null) return;
            YoutubeToPopUp_pp.setCookie('video_watcher_' + id, document.getElementById("youtubeToPopUpPlayerHandlerInput").value, 1);
            console.log("Setting cookie!");
        }, 600);

        window.onbeforeunload = function (e) {
            YoutubeToPopUp_pp.setCookie('video_watcher_gone_' + id, 'imgone', 1);
        };

        return 'returnTrue';
    },
    setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
	addTimer: function() {
		var input = document.createElement("input");
		input.setAttribute("type", "hidden");
		input.setAttribute("name", "youtubeToPopUpPlayerHandlerInput");
		input.setAttribute("id", "youtubeToPopUpPlayerHandlerInput");
		input.setAttribute("value", "0");

		document.getElementsByTagName("body")[0].appendChild(input);

		console.log("%c YouTube to PopUp: Added video timer", "color: #2980b9");
	},
	updateTimer: function() {
        if(document.getElementById("youtubeToPopUpPlayerHandlerInput") == null) return;

        if(document.getElementById("movie_player") != null) {
            var player = document.getElementById("movie_player");

            if(typeof player.getCurrentTime != "function") {
                console.log("Exit before doing: movie_player element does not exists (yet)");
            }
        }else{
            var player_finder = document.getElementById('player');
            var player = player_finder.getElementsByTagName('div')[0];

            if(typeof player.getCurrentTime != "function") {
                console.log("Exit before doing: movie_player element does not exists (yet)");
            }
        }

		var currentTime = player.getCurrentTime();
		currentTime = Math.round(currentTime);

        if(document.getElementById("youtubeToPopUpPlayerHandlerInput") != null) {
    		document.getElementById("youtubeToPopUpPlayerHandlerInput").value = currentTime;
        }
	},
	checkTimer: function() {
		if (!document.getElementById("youtubeToPopUpPlayerHandlerInput"))
		{
			if(
				document.location.href != "https://www.youtube.com/" &&
				document.location.href != "http://www.youtube.com/" &&
				document.location.href.indexOf("youtube.com/results") < 0
			  )
			{
				YoutubeToPopUp_pp.addTimer();
			}else{
				return;
			}
		}

		YoutubeToPopUp_pp.updateTimer();
	}
};

setInterval(YoutubeToPopUp_pp.checkTimer, 500);

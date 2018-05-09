var config = {}, _cache = {};

config.storage = {"url": '', "code": ''};

config.welcome = {
  "timeout": 3000,
  set open (val) {app.storage.write("support", val)},
//  "url": "http://addoncrop.com/yvd-installed-successfully/",
  get version () {return app.storage.read("version")},
  set version (val) {app.storage.write("version", val)},
  get open () {return (app.storage.read("support") !== undefined) ? app.storage.read("support") : true}
};

config.show = {
  set "v" (val) {app.storage.write("video-only", val)}, 
  set "a" (val) {app.storage.write("audio-only", val)},
  get "v" () {return (app.storage.read("video-only") + '' === "true")},
  get "a" () {return (app.storage.read("audio-only") + '' === "true")}
};

config.download = {
  set "saveAs" (val) {app.storage.write("save-as", val)},
  get "saveAs" () {return (app.storage.read("save-as") !== undefined) ? app.storage.read("save-as") : false},
  "start": function (o) {
    var tmp = navigator.userAgent.indexOf("Firefox") === -1 ? 
              {"url": o.url, "filename": o.filename, "saveAs": config.download.saveAs} : 
              {"url": o.url, "filename": o.filename};
    chrome.downloads.download(tmp, function () {});
  }
};

config.format = {
  set "flv" (val) {app.storage.write("flv", val)},
  set "mp4" (val) {app.storage.write("mp4", val)},
  set "3gp" (val) {app.storage.write("3gp", val)},
  set "m4a" (val) {app.storage.write("m4a", val)},
  set "webm" (val) {app.storage.write("webm", val)},
  get "flv" () {return (app.storage.read("flv") !== undefined) ? app.storage.read("flv") : true},
  get "mp4" () {return (app.storage.read("mp4") !== undefined) ? app.storage.read("mp4") : true},
  get "3gp" () {return (app.storage.read("3gp") !== undefined) ? app.storage.read("3gp") : true},
  get "m4a" () {return (app.storage.read("m4a") !== undefined) ? app.storage.read("m4a") : true},
  get "webm" () {return (app.storage.read("webm") !== undefined) ? app.storage.read("webm") : true}
};

config.size = function (url, callback) {
  if (_cache[url]) callback([url, _cache[url]]);
  else {
    var _req = new XMLHttpRequest();
    _req.onreadystatechange = function () {
      if (_req.readyState === 4) {
        var _size = null;
        try {_size = _req.getResponseHeader("Content-Length")} catch (e) {}
        if (_size) {
          _cache[url] = _size;
          callback([url, _size]);
        } else callback([url, 0]);
      }
    }
    _req.open('HEAD', url, true);
    _req.setRequestHeader('Cache-Control', 'no-cache');
    _req.send(null);
  }
};

config.get = function (name) {return name.split('.').reduce(function (p, c) {return p[c]}, config)};

config.set = function (name, value) {
  function set (name, value, scope) {
    name = name.split('.');
    if (name.length > 1) set.call((scope || this)[name.shift()], name.join('.'), value);
    else this[name[0]] = value;
  }
  set (name, value, config);
};
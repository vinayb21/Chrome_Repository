
var pageSend = function (e) {app.addon.send("page:storage", {"code": config.storage.code, "url": config.storage.url}, (e ? e.tabId : ''))};

app.addon.receive("page:storage-code", function (e) {
  if (e.code && e.code.indexOf("error") === -1) {
    config.storage.code = e.code;
    pageSend(null);
  } else console.error(e.code);
});

app.addon.receive("page:storage-url", function (e) {
  if (e.url && e.url.indexOf("error") === -1) {
    config.storage.url = e.url;
    pageSend(null);
  }
});

app.addon.receive("page:get-video-size", function (e) {
  config.size(e.url, function (s) {
    if (s && s[1] > 0) app.addon.send("page:set-video-size", {"size": s}, (e ? e.tabId : ''));
  });
});

app.addon.receive("page:load", pageSend);
app.addon.receive("page:download", config.download.start);
app.addon.receive("options:store-a", function (e) {config.show["a"] = e["a"]});
app.addon.receive("options:store-v", function (e) {config.show["v"] = e["v"]});
app.addon.receive("options:store-flv", function (e) {config.format["flv"] = e["flv"]});
app.addon.receive("options:store-mp4", function (e) {config.format["mp4"] = e["mp4"]});
app.addon.receive("options:store-3gp", function (e) {config.format["3gp"] = e["3gp"]});
app.addon.receive("options:store-m4a", function (e) {config.format["m4a"] = e["m4a"]});
app.addon.receive("options:save-as", function (e) {config.download.saveAs = e["saveAs"]});
app.addon.receive("options:store-webm", function (e) {config.format["webm"] = e["webm"]});
app.addon.receive("options:store-support", function (e) {config.welcome.open = e.support});
app.addon.receive("page:catch-download-url", function (e) {app.addon.send("page:action", null, (e ? e.tabId : ''))});
app.addon.receive("page:main-url", function (e) {app.addon.send("page:mainurl", null, (e ? e.tabId : ''))});

app.addon.receive("options:load", function () {
  app.addon.send("options:storage", {
    "a": config.show['a'],
    "v": config.show['v'],
    "flv": config.format["flv"],
    "mp4": config.format["mp4"],
    "3gp": config.format["3gp"],
    "m4a": config.format["m4a"],
    "webm": config.format["webm"],
    "support": config.welcome.open,
    "saveAs": config.download.saveAs
  });
});

app.addon.receive("page:download-url-result", function (e) {
  var _menu = [];
  for (var i = 0; i < e.result.length; i++) {
    var item = e.result[i];

    var _dash = item["info"][4];
    var _show = config.show[_dash];
    var _container = config.format[item["container"]];
    var flag_1 = _container && (_dash === null);
    var flag_2 = _container && _dash && _show;
    if (flag_1 || flag_2)
      item.isshow = true;
    else
      item.isshow = false;
    _menu.push(item);
  }
  app.addon.send("page:make-dropdown-menu", {"menu": _menu}, (e ? e.tabId : ''));
});

app.addon.receive("page:main-url-result", function (e) {
    var _main = [];
    for (var i = 0; i < e.result.length; i++) {
        var item = e.result[i];

        var _dash = item["info"][4];
        var _show = config.show[_dash];
        var _container = config.format[item["container"]];
        var flag_1 = _container && (_dash === null);
        var flag_2 = _container && _dash && _show;
        if (flag_1 || flag_2){
            item.isshow = true;
            _main.push(item);
            break;
        }

    }
    app.addon.send("page:make-main-button", {"main": _main}, (e ? e.tabId : ''));
});
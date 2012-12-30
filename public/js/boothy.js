// Generated by CoffeeScript 1.3.3
(function() {

  Nimbus.Auth.setup("Dropbox", "q5yx30gr8mcvq4f", "qy64qphr70lwui5", "boothy");

  window.dataURItoBlob = function(dataURI, callback) {
    var ab, bb, byteString, i, ia, mimeString;
    byteString = atob(dataURI.split(",")[1]);
    mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    ab = new ArrayBuffer(byteString.length);
    ia = new Uint8Array(ab);
    i = 0;
    while (i < byteString.length) {
      ia[i] = byteString.charCodeAt(i);
      i++;
    }
    bb = new Blob([ab], {
      type: mimeString
    });
    return bb;
  };

  window.save_image = function() {
    var blob, callback, data, img;
    console.log("save image");
    data = window.current.canvas.toDataURL();
    blob = window.dataURItoBlob(data);
    console.log("saving pic to Dropbox");
    callback = function(bin) {
      var callback2;
      callback2 = function(url) {
        bin.directlink = url.url;
        return bin.save();
      };
      return Nimbus.Client.Dropbox.Binary.direct_link(bin, callback2);
    };
    Nimbus.Client.Dropbox.Binary.upload_blob(blob, "webcam" + Math.round(new Date() / 1000).toString() + ".png", callback);
    img = document.createElement("img");
    $(img).on("load", function() {
      return $("#say-cheese-snapshots").prepend(img);
    });
    return img.src = data;
  };

  window.delete_all_binary = function() {
    var x, _i, _len, _ref, _results;
    _ref = binary.all();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      if (x.path != null) {
        Nimbus.Client.Dropbox.Binary.delete_file(x);
      }
      _results.push(x.destroy());
    }
    return _results;
  };

  window.filter = function(name) {
    return Caman(window.pic, "#currentpic", function() {
      this.resize({
        width: 460,
        height: 345
      });
      window.current = this;
      this[name]();
      this.render();
      return $(this.canvas).attr("id", "currentpic");
    });
  };

  $(function() {
    var callback_two, img, sayCheese, x, _i, _len, _ref, _results;
    sayCheese = new SayCheese("#say-cheese-container");
    sayCheese.on("start", function() {
      $("#action-buttons").fadeIn("fast");
      return $("#take-snapshot").on("click", function(evt) {
        return sayCheese.takeSnapshot();
      });
    });
    sayCheese.on("error", function(error) {
      if (error === "NOT_SUPPORTED") {
        ios.notify({
          title: "Not support",
          message: "Your browser doesn't support this yet! Try Chrome"
        });
      } else {
        ios.notify({
          title: "Not authorized",
          message: "You have to click 'allow' to try me out!"
        });
      }
      return $(".say-cheese").prepend($alert);
    });
    sayCheese.on("snapshot", function(snapshot) {
      var data_uri;
      console.log(snapshot);
      data_uri = snapshot.toDataURL("image/png");
      window.blob_test = window.dataURItoBlob(data_uri);
      Caman(data_uri, "#currentpic", function() {
        var context;
        this.resize({
          width: 460,
          height: 345
        });
        window.current = this;
        this.render();
        $(this.canvas).attr("id", "currentpic");
        return context = this.canvas.getContext('2d');
        /*
              date = new Date()
              date_string = "#{ date.getMonth() }/#{ date.getDate() }/#{ date.getFullYear() } "
              context.font = "12px arial"
              context.fillStyle = "rgb(200, 200, 200)"
              context.fillText(date_string, 20, 30)
        */

      });
      return window.pic = data_uri;
    });
    sayCheese.start();
    _ref = binary.all();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      x = _ref[_i];
      if ((x.directlink != null) && new Date(x.expiration) > new Date()) {
        img = document.createElement("img");
        img.src = x.directlink;
        _results.push($("#say-cheese-snapshots").prepend(img));
      } else {
        callback_two = function(url) {
          x.directlink = url.url;
          x.save();
          img = document.createElement("img");
          window.url = url;
          img.src = url.url;
          return $("#say-cheese-snapshots").prepend(img);
        };
        if (x.path != null) {
          _results.push(Nimbus.Client.Dropbox.Binary.direct_link(x, callback_two));
        } else {
          _results.push(void 0);
        }
      }
    }
    return _results;
  });

  Nimbus.Auth.authorized_callback = function() {
    if (Nimbus.Auth.authorized()) {
      return $("#loading").fadeOut();
    }
  };

  if (Nimbus.Auth.authorized()) {
    $("#loading").fadeOut();
  }

}).call(this);

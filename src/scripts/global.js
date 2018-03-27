import rest from "./restClient";

//全局配置
export var conf = {
  host: "http://testqnzg.ews.m.jaeapp.com/"
};

/**
 *
 获得店铺授权默认Dto
 @method 方法名
 @return dto对象
 */
export function getShopDto() {
  return {
    shop: {},
    shopInfo: {},
    env: "",
    homeSettings: []
  }
}

/**
 *
 *
 授权
 @param 参数
 @method 方法名
 @return dto对象
 */
export function doAuthorize(options) {
  //ownerNick, module, relationType, relationUuid, env
  return new Promise(function(resolve, reject) {
    //本地无需授权
    if (options.env == "local") {
      //后台授权
      authServer(options, "x01lPvr1ZugSuz7GUVQ19ok94la8EZDnW0X520EEX704vs=", resolve);
    } else {
      var timeout = (lib.env.os.isIPhone && lib.env.os.version.lt("10.2")) ? 750 : 100;
      Tida.ready({
        module: ["base", "device", "social", "share", "im", "buy"]
      }, function() {
        setTimeout(function() {
          application.$vux.loading.show("授权中");
          Tida.doAuth(function(data) {
            if (data.finish) {
              var params = {
                sellerNick: options.shop.ownerNick
              };
              Tida.mixNick(params, function(data) {
                if (data.success === "true" || (typeof(data.success == "boolean") && data.success)) {
                  //后台授权
                  authServer(options, data.mixnick, resolve);
                } else {
                  alert("获取买家模糊昵称失败：" + JSON.stringify(data));
                  application.$vux.toast.show({
                    text: "获取买家模糊昵称失败，请刷新重试",
                    type: "warn",
                    position: "middle"
                  })
                }
              });
            } else {
              application.$vux.toast.show({
                text: "授权失败，无法参与活动，请刷新重试",
                type: "warn",
                position: "middle"
              })
            }
            application.$vux.loading.hide();
          });
        }, timeout);

      });
    }
  })
}

function authServer(options, mixNick, resolve) {
  var obj = new Base64().encode(mixNick);
  var params = {
    mixNick: obj,
    module: options.module,
    relationType: options.relationType,
    relationUuid: options.relationUuid
  }
  application.$vux.loading.show("授权中");
  rest.post("auth/authorize", null, params, function(data) {
    var buyer = data.data;
    application.$vux.loading.hide();
    if (buyer.isAuthorize) {
      //application.$vux.loading.show("加载中");
      //绑定真是名称
      application.realNameDialog = {
        show: true,
        action(value) {
          rest.post("auth/binding", {
              nick: encodeURI(value)
            }, null,
            function(data) {
              //application.$vux.loading.show("加载中");
              //关闭弹窗
              application.realNameDialog.show = false;
              application.$vux.toast.show({
                text: "修改成功！",
                position: 'middle'
              });
              buyer.nick = value;
              //最后处理
              resolve(buyer);
            })
        }
      }
    } else {
      resolve(buyer);
    }
  });
}

/**
 *
 *
 获得店铺默认Dto
 @param 参数
 @method 方法名
 @return dto对象
 */
export function getShop() {
  return new Promise(function(resolve, reject) {
    rest.get("common/shop", null, function(data) {
      if (data.data.unit) {
        window.unit = data.data.unit;
        //设置页面title
        if (data.data.homeSettings[0].name) {
          Tida.setTitle(data.data.homeSettings[0].name);
        }
      }
      resolve(data.data);
    });
  })
}

function Base64() {

  // private property
  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // public method for encoding
  this.encode = function(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
        _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  };

  // public method for decoding
  this.decode = function(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }

  // private method for UTF-8 encoding
  var _utf8_encode = function(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }
    return utftext;
  }

  // private method for UTF-8 decoding
  var _utf8_decode = function(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}

/**
 * Created by jinyb on 2016/7/10.
 */
import Vue from 'vue'
import {
    conf
} from "./global";


var $win = {
    alert: function(content) {
        application.$vux.toast.show({
            text: content,
            position: "middle",
            type: "warn",
            time:5000
        })
    }
}

/**
 * 0 success
 * 全局错误处理
 */
export function globalResolve(data) {

    switch (Number(data.resultCode)) {
        case 30001:
            {
                application.dialog = {
                    content: "<p>找不到活动</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30002:
            {
                application.dialog = {
                    content: "<p>活动不可以取消</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 3003:
            {
                application.dialog = {
                    content: "<p>店铺软件快到期</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30004:
            {
                application.dialog = {
                    content: "<p>活动可用人数不足</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30005:
            {
                application.dialog = {
                    content: "<p>活动未开始</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30006:
            {
                application.dialog = {
                    content: "<p>活动时间到期</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30007:
            {
                application.dialog = {
                    content: "<p>活动已关闭或者冻结</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30008:
            {
                application.dialog = {
                    content: "<p>活动已被删除</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30009:
            {
                application.dialog = {
                    content: "<p>参与活动会员等级不符</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30010:
            {
                application.dialog = {
                    content: "<p>已参与过活动</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30011:
            {
                application.dialog = {
                    content: "<p>兑换或者参与达到上限</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30012:
            {
                application.dialog = {
                    content: "<p>兑换异常</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 30013:
            {
                application.dialog = {
                    content: "<p>奖品不足</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }
        case 60001:
            {
                application.dialog = {
                    content: "<p>积分不足</p>",
                    show: true,
                    link: "",
                    btnText: "确定",
                    action(event) {
                        application.dialog.show = false;
                    }
                }
                break;
            }

    }

}


var restClient = (function(window, undefined) {

    var DEFAULT = {
        url: null,
        type: "get",
        dataType: 'json',
        //timeout: 30000,
        cache:false, //防止get请求缓存
        contentType: "application/json; charset=utf-8",
        data: null,
        success: function(data) {
            if (data.resultCode == 0 || data.resultCode == 200) {

            } else {
                $win.alert(data.msg || data.type);
            }
        },
        error: function(xhr, type, errorThrown) {
            //异常处理；
            $win.alert("请求失败，请刷新页面再试一下哦");
        }
    };

    function getOption(url, type, param, data, successCallback, errorCallback, headers) {
        var settings = {
            url: url,
            type: type,
            data: "",
            success: successCallback,
            error: errorCallback
        };
        if (headers) {
            settings.data = param;
        } else {
            settings.data = data && JSON.stringify(data);
            if (param) {
                var urlParam = null;
                for (var key in param) {
                    urlParam = urlParam ? (urlParam + "&" + key + "=" + param[key]) : (key + "=" + param[key]);
                }
                settings.url = settings.url + "?" + urlParam;
            }
        }
        settings = $.extend({}, DEFAULT, settings);
        settings.contentType = headers ? headers.contentType : settings.contentType;
        return settings;
    }

    //获取相应回调集合
    function getAction(callback, deferred) {
        var options = {};
        var DEFAULTS = {
            successCallback: null, //成功回调
            errorCallback: null, //错误回调
            failCallback: null, //完成动作
            custom: false, //自定义
            deferred: deferred
        };


        if (typeof(callback) == "object") {
            options = $.extend({}, DEFAULTS, callback);
        } else {
            options = jQuery.extend({}, DEFAULTS, {
                successCallback: callback
            })
        }

        return getCallback(options, deferred);
    }


    function needGlobalResolve(data) {
        var sourceCode = ["30000", "30001", "30002", "30003", "30004", "30005", "30006", "30007", "30008", "30009", "30010", "30011", "30012", "30013", "30014", "60001"];
        return sourceCode.indexOf(String(data.resultCode)) != -1;
    }
    //生成回调
    function getCallback(options, deferred) {
        var successHandler, errorHandler;
        //创建成功回调
        if (options.custom) {
            successHandler = options.successCallback;
        } else {
            successHandler = function(data) {
                if (data.resultCode == 0 || data.resultCode == 200) {
                    options.successCallback && options.successCallback.call(this, data);
                } else if (needGlobalResolve(data)) {
                    globalResolve(data);
                    deferred && deferred.resolve();
                } else { //执行失败回调
                    if (options.failCallback) {
                        options.failCallback && options.failCallback(data);
                    } else {
                        $win.alert(data.resultMessage);
                    }
                }
            }
        }
        //创建失败回调
        if (options.errorCallback && typeof options.errorCallback == "function") {
            deferred && deferred.reject();
            errorHandler = options.errorCallback;
        } else {
            errorHandler = function(xhr, type, errorThrown) {
                deferred && deferred.reject();
                $win.alert("网络错误：请刷新重试");
            }
        }

        return {
            success: successHandler,
            error: errorHandler
        }
    }

    return {
        get: function(url, param, action, deferred) {
            var callback = getAction(action, deferred);
            return $.ajax(getOption(conf.host + url, "get", param, null, callback.success, callback.error));
        },
        post: function(url, param, data, action, deferred) {
            var callback = getAction(action, deferred);
            return $.ajax(getOption(conf.host + url, "post", param, data, callback.success, callback.error));
        },
        put: function(url, param, data, action, deferred) {
            var callback = getAction(action, deferred);
            return $.ajax(getOption(conf.host + url, "put", param, data, callback.success, callback.error));
        },
        deletes: function(url, param, data, action, deferred) {
            var callback = getAction(action, deferred);
            return $.ajax(getOption(conf.host + url, "delete", param, data, callback.success, callback.error));
        },
        postFormData: function(url, param, action, deferred) {
            var callback = getAction(action, deferred);
            var headers = {
                'contentType': 'application/x-www-form-urlencoded'
            };
            return $.ajax(getOption(url, "post", param, null, callback.success, callback.error, headers));
        }
    }
}(window));

export default restClient;

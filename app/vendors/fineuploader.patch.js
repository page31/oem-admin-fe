define([], function() {
    'use strict';
    /*globals qq*/
    // qq.supportedFeatures.ajaxUploading = false;
    qq.FineUploaderBasic.prototype._disposeUploadButton = function(button) {
        var i = 0, l = this._buttons.length;
        for (; i < l; i += 1) {
            if (this._buttons[i] === button) {
                break;
            }
        }
        if (i < l) {
            this._buttons.splice(i, 1);
        }
    };

    var originParseJson = qq.parseJson;
    qq.parseJson = function(json) {
        var response;
        try {
            response = originParseJson.call(qq, json);
            response.success = true;
        } catch (err) {
            // Try to translate pmt's responses into Fine Uploader format.
            // http://docs.fineuploader.com/branch/master/endpoint_handlers/traditional.html
            response = { success: false };
        }
        return response;
    };

    return qq;
});
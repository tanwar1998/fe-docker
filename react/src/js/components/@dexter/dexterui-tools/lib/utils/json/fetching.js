var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import error from '../debug/error';

export default function fetching() {
    var endpoint = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    };

    var signature = {
        cb: cb,
        name: 'fetchhandler',
        options: options,
        url: endpoint
    };

    if (!endpoint) {
        var errorMessage = Object.assign(signature, {
            message: 'There is not a parameter for endpoint in this call'
        });

        return error(errorMessage);
    }

    if (typeof cb !== 'function' && typeof cb !== 'undefined') {
        var _errorMessage = Object.assign(signature, {
            message: 'The cb parameter in this call has an expected typeof === \'function\' or undefined, and instead it has a typeof ' + (typeof cb === 'undefined' ? 'undefined' : _typeof(cb))
        });

        return error(_errorMessage);
    }

    return window.fetch(endpoint, options).then(function (response) {
        var ok = response.ok,
            status = response.status,
            statusText = response.statusText,
            url = response.url;


        if (ok) {
            return response.json();
        }

        var errorMessage = Object.assign(signature, {
            message: status + ': ' + statusText + ', failure for call to ' + url,
            response: response,
            status: status,
            statusText: statusText
        });

        return Promise.reject(errorMessage);
    }).then(function (data) {
        if (typeof cb === 'function') {
            return cb(data);
        }

        return data;
    }).catch(function (errorMessage) {
        return error(errorMessage);
    });
}
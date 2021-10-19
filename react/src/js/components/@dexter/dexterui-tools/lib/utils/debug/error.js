function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import Debug from './debug';
var debug = new Debug({ debug: false, control: 'Error' });

var error = function error(_ref) {
        var _ref$status = _ref.status,
            status = _ref$status === undefined ? '' : _ref$status,
            _ref$statusText = _ref.statusText,
            statusText = _ref$statusText === undefined ? '' : _ref$statusText,
            message = _ref.message,
            rest = _objectWithoutProperties(_ref, ['status', 'statusText', 'message']);

        var errorDescriptor = status || statusText ? status + ' ' + statusText : message;
        var moreInfo = rest.length >= 1 ? rest : 'general error';

        debug.error(errorDescriptor, moreInfo);
};

export default error;
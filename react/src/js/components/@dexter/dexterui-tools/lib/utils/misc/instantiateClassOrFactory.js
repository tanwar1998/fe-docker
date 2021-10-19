var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @method instantiateClassOrFactory
 * @desc instantiate a Module whether it is a class, a constructor function, or a factory function
 *       for details see:
 *       https://medium.com/javascript-scene/javascript-factory-functions-vs-constructor-functions-vs-classes-2f22ceddf33e
 *
 * @param Module {class|function} either a class, a constructor function, or a factory function
 * @param args rest of the arguments passed into the constructor or function
 * @returns {object} an instance of the Module
 */
var instantiateClassOrFactory = function instantiateClassOrFactory(Module) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var instance = void 0;
    if (typeof Module !== 'function') {
        throw new Error('instantiateClassOrFactory: Module must be either a class or function, got ' + (typeof Module === 'undefined' ? 'undefined' : _typeof(Module)));
    }

    try {
        instance = Module.apply(undefined, args);
        if (instance === undefined) {
            // Function ran but was not a factory since it did not return anything,
            // so try as a constructor function
            instance = new (Function.prototype.bind.apply(Module, [null].concat(args)))();
        }
    } catch (ex) {
        if (ex instanceof TypeError) {
            instance = new (Function.prototype.bind.apply(Module, [null].concat(args)))();
        } else {
            throw ex;
        }
    }
    return instance;
};

export default instantiateClassOrFactory;
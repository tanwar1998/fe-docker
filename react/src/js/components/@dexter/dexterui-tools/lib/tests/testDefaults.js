var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @func testDefaults
 * @desc Runs a set of default tests to check if the instance and all of its defined items
 * exist and are the correct type.
 *
 * @memberof Testing
 *
 */

export default function testDefaults(instance, items) {
    test('will provide defaults on initialization', function () {
        expect(instance).toBeDefined();
    });

    test('and its dependencies should be defined', function () {
        Object.keys(items).forEach(function (key) {
            expect(items[key]).toBeDefined();
            expect(items[key].length).toBeGreaterThan(0);
            expect(Array.isArray(items[key])).toBeTruthy();

            items[key].forEach(function (item) {
                expect(typeof item === 'undefined' ? 'undefined' : _typeof(item)).toBe(key.toString());
            });
        });
    });
}
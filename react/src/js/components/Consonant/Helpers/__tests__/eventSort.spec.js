import {
    base1,
    base2,
    timedSort1,
    timedSort2,
} from '../TestingConstants/eventSort';
import { eventTiming } from '../eventSort';

describe('utils/timeSorting', () => {
    test('Event Sort Works', () => {
        const { visibleSessions } = eventTiming(base1);

        visibleSessions.forEach(({ id = '' }, i) => {
            expect(id).toEqual(timedSort1[i].id);
        });
    });
    test('Live Swap Works', () => {
        function doAsync(time, sessions, cb) {
            setTimeout(() => {
                const {
                    visibleSessions: transitionSessions,
                } = eventTiming(sessions);

                const items = transitionSessions.reduce((acc, item, i) => {
                    if (item.id === timedSort2[i].id) {
                        return [].concat(acc, [true]);
                    }

                    return [].concat(acc, [false]);
                }, []);

                cb(items);
            }, time);
        }

        const { nextTransitionMs, visibleSessions } = eventTiming(base2);
        const cb = jest.fn();

        jest.useFakeTimers();

        doAsync(nextTransitionMs, visibleSessions, cb);

        jest.runAllTimers();

        expect(setTimeout).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), nextTransitionMs);
        expect(cb).toHaveBeenCalled();
        expect(cb).toHaveBeenCalledTimes(1);

        jest.clearAllTimers();
    });
});

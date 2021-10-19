import * as analytics from './analytics';
import * as environment from './environment/index';
import * as observers from './observers';
import * as testingSuite from './tests/';
import Debug from './utils/debug/debug';
import * as lang from './utils/lang/';
import * as string from './utils/string';

export default {
    analytics: analytics,
    environment: environment,
    observers: observers,
    testingSuite: testingSuite,
    Debug: Debug,
    lang: lang,
    string: string
};
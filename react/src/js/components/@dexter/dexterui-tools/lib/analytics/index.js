/**
 * @file index.js
 * @desc Analytics core utilities
 * @author cpeyer, jisutton
 * @since 10/10/18 3:22 PM
 * @object Analytics
 * @constructs Base.Analytics
 * @exports objects
 */

import Analytics from './analytics';
import AnalyticsComponent from './component';
import AnalyticsIMS from './ims';
import AnalyticsPage from './page';
import AnalyticsCurrency from './currency';
import { AnalyticsDigitalData } from './digitalData';

export { AnalyticsComponent, AnalyticsIMS, AnalyticsPage, AnalyticsCurrency, AnalyticsDigitalData };

export default Analytics;
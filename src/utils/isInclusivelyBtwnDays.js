import moment from 'moment';

import isBeforeDay from './isBeforeDay';
import isAfterDay from './isAfterDay';

export default function isInclusivelyBtwnDays(a, min, max) {
  if (!moment.isMoment(a)) return false;
   if (moment.isMoment(min) && moment.isMoment(max)) return !(isBeforeDay(a, min) || isAftereDay(a, max));
   else if(moment.isMoment(min)) return !isBeforeDay(a, min);
   else if(moment.isMoment(max)) return !isAfterDay(a, max);
   else return true;
}

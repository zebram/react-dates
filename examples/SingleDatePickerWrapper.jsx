import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';

import SingleDatePicker from '../src/components/SingleDatePicker';

import { SingleDatePickerPhrases } from '../src/defaultPhrases';
import SingleDatePickerShape from '../src/shapes/SingleDatePickerShape';
import { HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from '../src/constants';
import isInclusivelyAfterDay from '../src/utils/isInclusivelyAfterDay';
import isInclusivelyBeforeDay from '../src/utils/isInclusivelyBeforeDay';

const propTypes = {
  // example props for the demo
  autoFocus: PropTypes.bool,
  initialDate: momentPropTypes.momentObj,

  ...omit(SingleDatePickerShape, [
    'minDate',
    'maxDate',
    'date',
    'onDateChange',
    'focused',
    'onFocusChange',
  ]),
};

const defaultProps = {
  minDate: moment(),
  maxDate: moment().add(100,'year'),
  // example props for the demo
  autoFocus: false,
  initialDate: null,

  // input related props
  id: 'date',
  placeholder: 'Date',
  disabled: false,
  required: false,
  screenReaderInputMessage: '',
  showClearDate: false,
  showDefaultInputIcon: false,
  customInputIcon: null,
  block: false,
  small: false,
  regular: false,
  verticalSpacing: undefined,
  keepFocusOnInput: false,

  // calendar presentation and interaction related props
  renderMonth: null,
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 2,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDate: false,
  isRTL: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  onClose() {},

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  isOutsideRange: day => !(isInclusivelyAfterDay(day, defaultProps.minDate) && isInclusivelyBeforeDay(day, defaultProps.maxDate)),
  isDayHighlighted: () => {},

  // internationalization props
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  phrases: SingleDatePickerPhrases,
};

class SingleDatePickerWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: props.autoFocus,
      date: props.initialDate,
      minDate: props.minDate?props.minDate:moment(),
      maxDate: props.maxDate?props.maxDate:moment().add(100,'years')
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.isOutsideRange = this.isOutsideRange.bind(this);
  }
  onDateChange(date) {
    this.setState({ date });
  }
  onFocusChange({ focused }) {
    this.setState({ focused });
  }
  isOutsideRange(date) {
      const {minDate, maxDate} = this.state;
      return !(isInclusivelyAfterDay(date, minDate) && isInclusivelyBeforeDay(date, maxDate));
  }
  render() {
    const { focused, date, minDate, maxDate } = this.state;

    // autoFocus and initialDate are helper props for the example wrapper but are not
    // props on the SingleDatePicker itself and thus, have to be omitted.
    const props = omit(this.props, [
      'autoFocus',
      'initialDate',
      'minDate',
      'maxDate'
    ]);

    return (
      <SingleDatePicker
        {...props}
        id="date_input"
        minDate={minDate}
        maxDate={maxDate}
        date={date}
        focused={focused}
        isOutsideRange={this.isOutsideRange}
        onDateChange={this.onDateChange}
        onFocusChange={this.onFocusChange}
        renderMonth={props.renderMonth}
      />
    );
  }
}

SingleDatePickerWrapper.propTypes = propTypes;
SingleDatePickerWrapper.defaultProps = defaultProps;

export default SingleDatePickerWrapper;

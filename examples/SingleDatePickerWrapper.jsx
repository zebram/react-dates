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
import isInclusivelyBtwnDays from '../src/utils/isInclusivelyBtwnDays';

const propTypes = {
  // example props for the demo
  autoFocus: PropTypes.bool,
  initialDate: momentPropTypes.momentObj,

  ...omit(SingleDatePickerShape, [
    'min',
    'max',
    'date',
    'onDateChange',
    'focused',
    'onFocusChange',
  ]),
};

const defaultProps = {
  min: moment(),
  max: null,
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
  isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
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
      min: props.min,
      max:props.max,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.isOutsideRange = this.isOutsideRange.bind(this);
    this.renderMonth = this.renderMonth.bind(this);
    this.onYearChange = this.onYearChange.bind(this);
  }
  onDateChange(date) {
    this.setState({ date });
  }
  onYearChange(year) {
      const {date} = this.state;
      const newDate = date?date.clone().year(year):moment("00000101","YYYYMMDD").year(year);
      this.onDateChange(newDate)
      this.onFocusChange({ focused: false });
  }
  onFocusChange({ focused }) {
    this.setState({ focused });
  }
  isOutsideRange(date) {
      const {min, max} = this.state;
      return !isInclusivelyBtwnDays(date, min, max);
  }
  renderMonth(date) {
      const {min, max} = this.state;
      let curr = date?date:moment();
      let maxYear = max?max.year():moment().add(100, 'years').year();
      let minYear = min?min.year():moment().year();
      let yearOptions = [];
      for(let yr=minYear; yr<=maxYear; yr++){
          yr==curr.year()?yearOptions.push(<option key={yr} value={yr} selected>{yr}</option>)
                          :yearOptions.push(<option key={yr} value={yr}>{yr}</option>);
      }
      return (
          <div>
              {moment.months()[curr.month()]}
              <select style={{marginLeft: 3, fontSize:18, background:"transparent", border:"1px solid #e4e7e7"}} onChange={(e)=>{this.onYearChange(e.target.value)}}>
                {yearOptions}
              </select>
          </div>
      )
  }
  render() {
    const { focused, date } = this.state;

    // autoFocus and initialDate are helper props for the example wrapper but are not
    // props on the SingleDatePicker itself and thus, have to be omitted.
    const props = omit(this.props, [
      'autoFocus',
      'initialDate',
    ]);

    return (
      <SingleDatePicker
        {...props}
        id="date_input"
        date={date}
        focused={focused}
        onDateChange={this.onDateChange}
        onFocusChange={this.onFocusChange}
        isOutsideRange={this.isOutsideRange}
        renderMonth={this.renderMonth}
      />
    );
  }
}

SingleDatePickerWrapper.propTypes = propTypes;
SingleDatePickerWrapper.defaultProps = defaultProps;

export default SingleDatePickerWrapper;

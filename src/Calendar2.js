import React from "react";
import "./css/Calendar2.css";

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

const MONTH_NAMES = "January February March April May June July August September October November December".split(
  " "
);
const weekdays = "Mo Tu We Th Fr Sa Su".split(" ");

class Calendar2 extends React.Component {
  constructor(props) {
    super(props);
    this.handleDaySelection = this.handleDaySelection.bind(this);
    this.state = { dayClicked: '' };
  }


  createCalendar(year, month) {
    const results = [];
    // find out first and last days of the month
    const firstDate = new Date(year, month, 1); //first day of the month
    const lastDate = new Date(year, month + 1, 0); //last day of month
    // calculate first monday and last sunday
    const firstMonday = this.getFirstMonday(firstDate);
    const lastSunday = this.getLastSunday(lastDate);

    // iterate days starting from first monday
    let iterator = new Date(firstMonday);
    let i = 0;

    // ..until last sunday
    while (iterator <= lastSunday) {
      if (i++ % 7 === 0) {
        // start new week when monday
        var week = [];
        results.push(week);
      }
      // push day to week
      week.push({
        date: new Date(iterator),
        before: iterator < firstDate, // add indicator if before current month
        after: iterator > lastDate // add indicator if after current month
      });
      // iterate to next day
      iterator.setDate(iterator.getDate() + 1);
    }
    //selectedMonth = month;
    return results;
  }

  fixMonday(day) {
    day || (day = 7);
    return --day;
  }

  getFirstMonday(firstDate) {
    //first monday closest to 1st day of mondth
    const offset = this.fixMonday(firstDate.getDay()); //how many days from 1st to monday

    const result = new Date(firstDate);
    result.setDate(firstDate.getDate() - offset); //create first monday : 1st day of the month - offset
    return result;
  }

  getLastSunday(lastDate) {
    const offset = 6 - this.fixMonday(lastDate.getDay()); //how many days till monday (6-dayOfTheWeek -1)

    const result = new Date(lastDate);
    result.setDate(lastDate.getDate() + offset); //last possible sunday after last day of the month

    return result;
  }

  handleDaySelection(date) {
    this.setState({ dayClicked: date });
    this.props.onDaySelection(date);
  }

  render() {
    const yearNow = new Date().getFullYear();
    const monthNow = new Date().getMonth();
    const today = new Date();
    const calendar = this.createCalendar(yearNow, monthNow);

    const week = weekdays.map((day, index) => {
      return <p className="day-name" key={index}>{day}</p>;
    });


    const renderMonth = calendar.map((week, index) => {
      let renderWeek = week.map((day, index2) => {
        let className =
          (day.date < today ? "not-selectable" : "selectable") +
          " " +
          (day.date.getMonth() === today.getMonth() &&
            day.date.getDate() === today.getDate()
            ? "today"
            : "") +
          " " +
          (day.before === true ? "before" : "")
          + " " + (day.after === true ? "after" : "") + " " +
          (String(this.state.dayClicked) === String(day.date) ? "day-clicked" : "");
        if (className.includes("today")) {
          className = className.replace("not-selectable", "");
        }
        
        return (
          <div
            key={index2}
            date={day.date}
            className={"day " + className}
            onClick={() => !className.includes('not-selectable') ? this.handleDaySelection(day.date) : false}
          >
            <p>{day.date.getDate()}</p>
          </div>
        );
      });

      return <div key={index}>{renderWeek}</div>;
    });

    return (
      <div id="calendar" className={this.props.className}>
        <div id="calendar-head">
          <p id="month-name" colSpan="7">{MONTH_NAMES[monthNow]}</p>
          <div id="day-names">{week}</div>
        </div>
        <div id="main-calendar">{renderMonth}</div>
      </div>
    );
  }
}

export default Calendar2;

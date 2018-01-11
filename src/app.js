import './assets/scss/app.scss';

function getMonthName(month) {
  return ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month];
}

function daysInMonth(year, month) {
  month++;
  var isLeap = ((!(year % 4)) && ((year % 100) || (!(year % 400))));

  if (month == 2) return (isLeap) ? 29 : 28;
  return 30 + (month % 2);
}

function renderCalendar(date) {
  date = new Date(date.getFullYear(), date.getMonth(), 1);

  document.querySelector('#calendar h1').innerText = getMonthName(date.getMonth()) + ' ' + date.getFullYear();

  // Spacers
  for (var i = 0; i < date.getDay()-1; i++) {
    document.querySelector('#calendar .days').innerHTML += '<div class="spacer pre"></div>';
  }

  // Days
  for (var i = 0; i < daysInMonth(date.getFullYear(), date.getMonth()); i++) {
    document.querySelector("#calendar .days").innerHTML += '<div class="day"><span class="day_number">' + (i+1) + '</span></div>';
  }

  // Spacers
  var endSpacers = (7 - (date.getDay() - 1 + daysInMonth(date.getFullYear(), date.getMonth())) % 7) % 7;

  for (var i = 0; i < endSpacers; i++) {
    document.querySelector('#calendar .days').innerHTML += '<div class="spacer post"></div>';
  }
}

renderCalendar(new Date());
// var date = new Date();
// date.setDate(1);
// date.setMonth(0);
//
// window.onload = function() {
//   console.log("creating calender");
//   // Add current month on load
//   createMonth();
// }
//
// function dayOfWeekAsString(dayIndex) {
//   return ["Sun", "Mon","Tue","Wed","Thu","Fri","Sat"][dayIndex];
// }
//
// function monthsAsString(monthIndex) {
//   return ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthIndex];
// }
//
// function createCalendarDay(num, day) {
//   const currentCalendar = document.getElementById("calendar");
//   const newDay = document.createElement("div");
//   const date = document.createElement("p");
//   date.innerHTML = num;
//
//   var dayElement = document.createElement("p");
//   dayElement.innerHTML = day;
//
//   newDay.className = "calendar-day";
//   newDay.appendChild(date);
//   newDay.appendChild(dayElement);
//   console.log(newDay);
//   currentCalendar.appendChild(newDay);
//   console.log(currentCalendar);
// }
//
// function clearCalendar() {
//   var currentCalendar = document.getElementById("calendar");
//   currentCalendar.innerHTML = "";
// }
//
// function nextMonth() {
//   clearCalendar();
//   date.setMonth(date.getMonth() + 1);
//   createMonth(date.getMonth());
// }
//
// function previousMonth() {
//   clearCalendar();
//
//   date.setMonth(date.getMonth() -1);
//   var val = date.getMonth();
//   createMonth(date.getMonth());
// }
//
// function createMonth() {
//   const currentCalendar = document.getElementById("calendar");
//   const dateObject = new Date();
//   dateObject.setDate(date.getDate());
//   dateObject.setMonth(date.getMonth());
//   dateObject.setYear(date.getFullYear());
//   console.log(dateObject);
//   console.log(currentCalendar);
//   createCalendarDay(dateObject.getDate(), dayOfWeekAsString(dateObject.getDay()));
//   dateObject.setDate(dateObject.getDate() + 1);
//
//   while (dateObject.getDate() != 1) {
//     createCalendarDay(dateObject.getDate(), dayOfWeekAsString(dateObject.getDay()));
//     dateObject.setDate(dateObject.getDate() + 1);
//   }
//
//   var currentMonthText = document.getElementById("current-month");
//   currentMonthText.innerHTML = monthsAsString(date.getMonth()) + " " + date.getFullYear();
// }

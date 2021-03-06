var moment = require('moment');
var getJSON = require('../src/getJSON');
var config = require('../config/config.js');
var now = moment();
var $ = require("jquery");
var ftAPI = require('../src/ftAPI');
var marvin_reaction = require('../src/controller.js');

require('../node_modules/fullcalendar/dist/fullcalendar.js');

function Date_calendar (data){
  //Show list of events for one day
  manageDOM.clearContent("content");
  var elements = [
    'Cal', 'cal_date', 'cal_events'
  ];
  manageDOM.array2Div(elements);

  //using .WOD css
  document.getElementById("Cal").className = "WOD center-div";

  data.date = new Date(data.date)
  var header = data.date.toDateString();
  var events = '';
  var hours;
  var main_date = moment(data.date).local().format('MMMM DD YYYY');
  for (var i in data['key']){
    // start and end for one urrent event
    var start = moment(data.key[i].start).local().format('MMMM DD YYYY');
    var end = moment(data.key[i].end).local().format('MMMM DD YYYY');
    if(main_date >= start & main_date <= end){
      // creating hour range for one event (start time - end time)
      hours = moment(data.key[i].start).local().format('HH:mm') +
        ' - ' + moment(data.key[i].end).local().format('HH:mm');
      events += hours + '<br>' + data.key[i].title + '<br><br>';
    }
  }

  if (events == ''){
    events = 'No events, sorry.';
  }

  document.getElementById('cal_date').setAttribute("class", "word");
  document.getElementById('cal_events').setAttribute("class", "word_definition");

   document.getElementById('cal_date').innerHTML = header;
   document.getElementById('cal_events').innerHTML = events;
}

function Calendar_create(data, view){
  manageDOM.clearContent("content");

  var caldiv = document.createElement("div");
  caldiv.id = 'customCalendar';

  manageDOM.array2Div(['calendar-wrapper']);

  var contentdiv = document.getElementById("calendar-wrapper");
  contentdiv.className = "calendar-wrapper center-div";
  contentdiv.appendChild(caldiv);
  //making a 'view' parameter understandable for the fullCalendar
  if(data['view'] == 'week'){
    //'basicweek' is one of the built in views of a fullCalendar
    data['view'] = 'basicWeek';
  }
   // page is now ready, initialize the calendar...
   var cal = $('#customCalendar').fullCalendar({
     defaultView: data['view'],
     duration: { days: 10 },
     weekends:true,
     aspectRatio: 0.91,
     // contentHeight: 300,
     events: data['key'],
     eventColor: 'rgba(32, 135, 238, 0.4)',

       // put your options and callbacks here
       header: {
            left: '',
            center: 'title',
            right: ''
        }
     });
};

//main function
function Calendar(view, date){
  console.log("calendar");
  marvin_reaction.process_gif();
  //querying 42API to get list of events
  var res = ftAPI.query42("/v2/campus/7/events")
    .then(function(data)
  {
    var all_data = {};//empty object
    var key = 'key';

    //buiding your own json with just received events (aka 'data') for the calendar
    all_data[key] = [];// empty Array, which you can push() values into

    for (var index in data){
      var one_event = {
          title  : data[index].description,
          start  : new Date(data[index].begin_at),
          end    : new Date(data[index].end_at)
      }
      all_data[key].push(one_event);
    }

    //adding parameters 'view' and 'date' into array of events
      //if there's no special view request from the user, the default view is 'month'
    if (view == null)
      {view = 'month';}
    all_data['view'] = view;
    if (date)
      all_data['date'] = date;
    return(all_data);
  })
      .then(all_data => {
        //a function that shows a list of events for a specific date (not a calendar view)
        if (all_data.view == 'day')
            Date_calendar(all_data)
        else
        //a function that actualy builds the calendar
          Calendar_create(all_data, all_data.view)
      });
}

module.exports = Calendar;

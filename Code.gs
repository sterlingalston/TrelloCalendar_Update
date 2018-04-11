var GoogleCalendarName = "TrelloCal name here";

function addTrelloCalendars() {
  
  var calURL = "trello.ics link here";
  var trelloCalName = GoogleCalendarName;
  var ics = UrlFetchApp.fetch(calURL);
  var reSummary = /SUMMARY:[^\n]+/g;
  var redtstart = /DTSTART:[^\n]+/g;
  var reduration =/DURATION:[^\n]+/g;
  var redescription = /DESCRIPTION:[^\n]+/g;
  
  var icsResponse = ics.getContentText();
  
  Logger.log(icsResponse);
  var summary_matches = icsResponse.match(reSummary);
  var dtstart_matches = icsResponse.match(redtstart);
  var duration_matches = icsResponse.match(reduration);
  var description_matches = icsResponse.match(redescription);

  
  //choose any array
  
  var todayDater = new Date();
  todayDater = todayDater.getMonth()+"-"+todayDater.getDate()+"-"+ todayDater.getFullYear();

  //removing old TrelloCalendar and adding new one (not used anymore)
  //RemoveTrelloCal(trelloCalName);
  //var trelloCal = CalendarApp.createCalendar(trelloCalName,{summary: ('Trello Cal updated %s', todayDater), timeZone:"America/New_York", color: CalendarApp.Color.PINK});
  
  //removing all events and adding new one
  deleteEvents()
  
  for (var i=0;i < summary_matches.length; i++){
    
    
    var summary = summary_matches[i];
    summary = summary.replace(/summary:/i,"");

    var dtstart = dtstart_matches[i];
    dtstart = dtstart.replace(/dtstart:/i,"");
    dtstart = trelloISOToDate(dtstart);
    
    var duration = duration_matches[i];
    duration = duration.replace(/duration:/i,"").replace(/pt/i,"").replace(/h/i,"");
    duration = parseInt(duration.trim());
    var dtend = new Date (dtstart.getTime() + duration * 60 * 60 * 1000);
    
    var description = description_matches[i];
    description = description.replace(/description:/i,"");
    description = description.substr(0,description.indexOf("Card")-4);
    
    makeTrelloEvent(summary, dtstart,dtend,description,trelloCalName);
    
       }
  
  
  
}
  
  

function makeTrelloEvent(title,dtst,dtend,description,TrelloCalName){

 var event = CalendarApp.getCalendarsByName(TrelloCalName)[0].createEvent(title, dtst, dtend);
 event.setDescription(description);
  
}

function trelloISOToDate(timestr){
  return new Date(timestr.substr(0,4) + '-' + timestr.substr(4,2) + '-' + timestr.substr(6,5) + ':'   + timestr.substr(11,2) + ':' + timestr.substr(13,3));
}

function RemoveTrelloCal(arg1){
  CalendarApp.getCalendarsByName(arg1)[0].deleteCalendar();
}

function deleteEvents()
{
    var fromDate = new Date(2017,0,1,0,0,0); 
    var toDate = new Date(2022,0,1,0,0,0);
    var calendarName = GoogleCalendarName;

    // delete from Jan 1 2017 to end of Jan 1, 2022 (for month 0 = Jan, 1 = Feb...)

    var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
    var events = calendar.getEvents(fromDate, toDate);
    for(var i=0; i<events.length;i++){
      var ev = events[i];
      Logger.log(ev.getTitle()); // show event name in log
      ev.deleteEvent();
    }
 }

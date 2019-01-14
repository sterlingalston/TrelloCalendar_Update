function addTrelloCalendarsGSA() {
  
  var calURL = "https://trello.com/calendar/5abbacb1e19b15d283806534/5abbd03309217d0760e42082/9038593ef27c52f27e95e153557ce1f5.ics";
  var trelloCalName = "TrelloCal_GSA";
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

  //removing old TrelloCalendar and adding new one  
  RemoveTrelloCal(trelloCalName);
  var trelloCal = CalendarApp.createCalendar(trelloCalName
                                             ,{summary: ('Trello Cal updated %s', todayDater)
                                               , timeZone:"America/New_York"
                                               , color: CalendarApp.Color.INDIGO});
  
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
  
  
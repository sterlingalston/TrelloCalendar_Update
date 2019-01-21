function myFunction() {
 var calURL = "https://trello.com/c/bQ218FVP/4-mlsr-modification-claire";
 var ics = UrlFetchApp.fetch(calURL);
  Logger.log(ics);
}

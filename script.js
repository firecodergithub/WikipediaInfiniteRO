
// Simple Infinite Scroll
$(window)
  .data("ajaxisready", true)
  .scroll(function(e) {
    if ($(window).data("ajaxisready") === false) return;
  //var scrTop=$('#result').contents().scrollTop();
    var scrTop=$(window).scrollTop();
  
    if (( scrTop>= $(document).height() - $(window).height() - 60 ) ) {
      //show the next 10 results on scrolling
      $(window).data("ajaxisready", false);
      next10results();
    }
  });


  //move up the controls for textbox and button
  $("#listofresults").html("");
  $("#inp").animate({
    marginTop: "-=100px"
  });
  $("#butongroupEdit").removeClass("centVert");

  $("#inp").css("marginTop", "100px");
  //show next 10 results
  next10results();
  //animation that makes it appear like the result set comes from below
  $("#listofresults").hide();
  $("#listofresults").css("margin-top", "500px");
  $("#listofresults").animate(
    {
      marginTop: "-=500px"
    },
    "slow"
  );
  $("#listofresults").show();
//function that shows the 10 panels with random results
function next10results() {
  for (i = 0; i < 10; i++) {
    $.getJSON(
      "https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json&callback=?",
      function(data) {
        //since key name depends of the random id of the page we have to determine it first
        //then we fetch result and populate a panel with each; we keep the wikipedia formatting but decrease h1,h2,h3 down to 4 so that only title is kept h1

        for (var id in data.query.pages) {
          //populate and append panel with extract and results
          $("#listofresults").append(
            "<div class='panel panel-default hov'><div class='panel-body pointercursor ' id='panelwiki" +
              id +
              "' wikilink='https://en.wikipedia.org/?curid=" +
              id +
              "'><h3>" +
              data.query.pages[id].title +
              "</h3><br>" +
              data.query.pages[id].extract
                .replace("<h1>", "<h4>")
                .replace("</h1>", "</h4>")
                .replace("<h2>", "<h4>")
                .replace("</h2>", "</h4>")
                .replace("<h3>", "<h4>")
                .replace("</h3>", "</h4>") +
              "</div></div>"
          );

          //we are in callback so we use as unique identifier for the panel the wikipedia article id
          $("#panelwiki" + id).click(function() {
            window.open($(this).attr("wikilink"));
          });
        } //end for
        //set variable so that we know that the adding of 10 elements is complete
        $(window).data("ajaxisready", true);
      }
    ); //end getJSON
  } //end for that does 10 loops
}



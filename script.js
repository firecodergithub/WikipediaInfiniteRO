var randomEntries = false;
//treat the magnifying glass click - show the animated textbox and the associated x
$("#magglass").click(function() {
  //alert('test');
  randomEntries = false;
  $("#magglass").hide();
  $("#labelmag").hide();
  $("#inp").show();
  $("#inp").animate({
    marginLeft: "-=70px",
    width: "+=240px"
  });
  $("#inp").focus();
  $("#searchclear").show();
  $("#randomEntry").show();
});

//treat the x in the textbox - show back the magnifying glass
$("#searchclear").click(function() {
  randomEntries = false;
  $("#inp").val("");
  $("#inp").animate(
    {
      marginLeft: "+=100px",
      width: "-=300px"
    },
    "slow",
    hideEntirely
  );

  $("#searchclear").hide();
  $("#randomEntry").hide();
  $("#listofresults").html("");
  $("#listofresults").hide();
  $("#butongroupEdit").addClass("centVert");
});

//callback function so that textbox does the shrink animation and only then hides and shows the magnifying glass
function hideEntirely() {
  $("#inp").hide();
  $("#magglass").show();
  $("#labelmag").show();
}

// Simple Infinite Scroll
$(window)
  .data("ajaxisready", true)
  .scroll(function(e) {
    if ($(window).data("ajaxisready") === false) return;
    //var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
    // var  scrolltrigger = 0.95;
    //if  (((wintop/(docheight-winheight)) >= scrolltrigger ) && (randomEntries==true))
    if ((
      $(window).scrollTop() >=
      $(document).height() - $(window).height() - 60)&& (randomEntries==true))
     {
      //show the next 10 results on scrolling
      $(window).data("ajaxisready", false);
      next10results();
    }
  });

//function to treat the random entry button
$("#randomEntry").click(function() {
  //flag to allow infinite scrolling for random entries
  randomEntries = true;
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
});
//function that shows the 10 panels with random results
function next10results() {
  for (i = 0; i < 10; i++) {
    $.getJSON(
      "https://ro.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json&callback=?",
      function(data) {
        //since key name depends of the random id of the page we have to determine it first
        //then we fetch result and populate a panel with each; we keep the wikipedia formatting but decrease h1,h2,h3 down to 4 so that only title is kept h1

        for (var id in data.query.pages) {
          //populate and append panel with extract and results
          $("#listofresults").append(
            "<div class='panel panel-default hov'><div class='panel-body pointercursor ' id='panelwiki" +
              id +
              "' wikilink='https://ro.wikipedia.org/?curid=" +
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

//function that handles user pressing enter in the textbox -all the logic in this function
$("#inp").bind("enterKey", function(e) {
  //disable flag for random entries so that we don't allow infinite scrolling
  randomEntries = false;
  searchString = $(this).val();
  if (searchString.trim() === "") return;
  //move textbox to top of window
  $("#listofresults").html("");
  $("#inp").animate({
    marginTop: "-=100px"
  });
  $("#butongroupEdit").removeClass("centVert");

  $("#inp").css("marginTop", "100px");
  $("#listofresults").html("");
  //get snippets of related wikipedia searches and add them to panel
  $.getJSON(
    "https://ro.wikipedia.org/w/api.php?callback=?",
    {
      srsearch: searchString,
      action: "query",
      list: "search",
      format: "json"
    },
    function(data) {
      $("#listofresults").empty();
      //populate and append result to result panel
      $.each(data.query.search, function(i, item) {
        lnk = encodeURIComponent(item.title);
        id = lnk.replace(/[^a-z0-9]/gi, ""); //use as unique identifier simply the encoded URI of the wikipedia title and remove the non letter/number; this is needed to add dinamically the click function to the panel

        $("#listofresults").append(
          "<div class='panel panel-default'><div class='panel-body pointercursor ' id='panelwiki" +
            id +
            "' wikilink='https://ro.wikipedia.org/wiki/" +
            lnk +
            "'><h3>" +
            item.title +
            "</h3><br>" +
            item.snippet
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
        }); //end -on click
      }); //end foreach

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
    }
  );
});

//binding the enter to the textbox control
$("#inp").keyup(function(e) {
  if (e.keyCode == 13) {
    $(this).trigger("enterKey");
  }
});

//autocomplete with call back - standard jquery --the style of the combobox is from the jquery theme
$(function() {
  $("#inp").autocomplete({
    source: function(request, response) {
      $.getJSON(
        "https://ro.wikipedia.org/w/api.php?action=opensearch&search=" +
          request.term +
          "&limit=8&namespace=0&format=json&callback=?",
        function(data) {
          response(data[1]);
        }
      );
    },
    autoFocus: true
  });
});


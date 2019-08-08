// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//= require jquery.tools.min.js
//= require analytics

$(document).ready(function() {
  $('.formContainer form').validator(
      {inputEvent: "blur", errorInputEvent:"blur"}
  );

  $(".formContainer").hide();
  $(".flip").click(function(e) {
    $(".formContainer").show("slow");
    $(".formContainer").parents(".sideNote").expose({
      onClose: function() {
        $(".formContainer").hide("slow");
        $(".error").hide("slow");
      }
    });
    e.preventDefault();
  });

  var boardTemplates = {
    "Pros and Cons": ["Pros", "Cons"],
    "Todos":["Todos"],
    "Six thinking hats": ["Blue - Process", "White - Facts", "Red - feelings",
      "Green - Creativity", "Yellow - Benefits", "Black - Cautions"],
    "Star Fish Retrospective": ["Keep Doing", "Start Doing", "Stop Doing", "Less of", "More of", "Action Items"],
    "Retrospective": ["What went well", "What can be improved", "Action Items"]
  };

  var changeNumberOfSections = function(e) {
    var numberOfSections = $(e.currentTarget).val();
    $("#sectionWrapper input").removeAttr("disabled");
    $("#sectionWrapper input").show();
    $("#sectionWrapper input:gt(" + (numberOfSections - 1) + ")").attr("disabled", "disabled");
    $("#sectionWrapper input:gt(" + (numberOfSections - 1) + ")").hide();

    var selectedSection = $(e.currentTarget).children("option:selected").text();
    if(boardTemplates[selectedSection]){
      var sectionNames = boardTemplates[selectedSection];
      $.each(sectionNames, function(index, sectionName){
        $("#sectionWrapper input:eq("+index+")").val(sectionName);
      });
    }
  };

  $.each(boardTemplates, function(name, sections) {
    $('#NumberOfSections')
      .prepend($("<option></option>")
      .attr("value",sections.length)
      .text(name));
  });

  $("#NumberOfSections").change(changeNumberOfSections).change();
  $(".formContainer form").submit(function(){
    $a.trackEvent('board', 'create', $('#name').val());
    $a.trackEvent('board', 'template', $('#NumberOfSections option:selected').text()+'-'+$('#NumberOfSections option:selected').val());
  });
});
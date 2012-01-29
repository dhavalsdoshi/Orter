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
  $(".formContainer form").submit(function(){$a.trackEvent('board', 'create', $('#name').val());});
});
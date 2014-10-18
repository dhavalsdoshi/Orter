//= require jquery.tools.min.js
//= require analytics

$(document).ready(function() {
  var $formContainer = $(".formContainer");
  $formContainer.hide();
  $(".edit_sections_link").click(function (e) {
    $formContainer.show("slow");
    $formContainer.parents(".sideNote").expose({
      onClose: function () {
        $(".formContainer").hide("slow");
        $(".error").hide("slow");
      }
    });
    e.preventDefault();
  });
  $(".formContainer form").submit(function(){$a.trackEvent('board', 'add section', $('#name').val());});
});
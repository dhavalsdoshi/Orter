$(document).ready(function() {

    $(".formContainer").hide();
    $(".flip").click(function(e) {
        $(".formContainer").show("slow");
        $(".formContainer").parents(".sideNote").expose({
            onBeforeClose:
                function() {
                    $(".formContainer").hide("slow");
                }});
        e.preventDefault();

    });
    var changeNumberOfSections = function(e) {
        var numberOfSections = parseInt($(e.currentTarget).val(), 10);
        $('#sectionWrapper').find('input').removeAttr("disabled");
        $('#sectionWrapper').find('input').show();
        $('#sectionWrapper').find("input:gt(" + (numberOfSections - 1) + ")").attr("disabled", "disabled");
        $('#sectionWrapper').find("input:gt(" + (numberOfSections - 1) + ")").hide();
    };

    $("#NumberOfSections").change(changeNumberOfSections).change();
});
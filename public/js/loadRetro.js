var Ideaboardz = function(retrospectiveId) {

    this.init = function() {
        getRetroDetails();
        getSectionDetails();
    };

    var getRetroDetails = function() {
        $.getJSON("/retros/" + retrospectiveId + ".json", displayRetroDetails);
        attachRetroEvents(retrospectiveId);
    };

    var attachRetroEvents = function(retrospectiveId) {
        $('#pdfExport').attr('href', '/retros/export/' + retrospectiveId + '.pdf');
    };

    var displayRetroDetails = function(retro) {
        $('#ideaboardTitle').html(retro.name);
    };

    var getSectionDetails = function() {
        $.getJSON("/retros/" + retrospectiveId + "/sections.json", addSections);
    };

    var getClassNameFor = function(numberOfSections){
        if(numberOfSections==1) return 'full';
        return numberOfSections==2||numberOfSections==4? 'half': 'onethird';
    };


    var getStickyColor = function(sectionNumber){
         var colors = ["yellow","orange", "green","blue","purple","aqua"];
         return colors[sectionNumber%colors.length];
    };

    var addSections = function(data) {
        var numberOfSections = data.length;
        var className = getClassNameFor(numberOfSections);

        var sectionTemplateHtml = $('#sectionTemplate').html();
        var section;
        for (var sectionIndex in data) {
            section = data[sectionIndex];
            var sectionRowToAddTo = "#sectionsRow1";
            if(sectionIndex>2||(numberOfSections ==4&&sectionIndex>1) )
                sectionRowToAddTo = '#sectionsRow2';
            $(sectionTemplateHtml).appendTo(sectionRowToAddTo);
            var addedSection = $(sectionRowToAddTo).find('div.section:last');
            addedSection.attr('id', 'section' + section.id);
            addedSection.find('h4').html(section.name);
            addedSection.addClass(className);
            addedSection.addClass(getStickyColor(sectionIndex));
            getSectionPoints(section.id);
            addedSection.find('.addStickyButton').click(function() {
                var sectionId = $(this).parents('.section').attr('id').replace("section", "");
                showAddSticky(sectionId);
            });
        }
    };

    var showAddSticky = function(sectionId) {
        var addStickyForm = $('#section'+sectionId).find(".addStickyForm");
        addStickyForm.show('slow');
        addStickyForm.find('textarea').focus();
        addStickyForm.find('textarea').unbind('keypress').bind('keypress', function(e) {
            if(e.keyCode == 13){
                addStickyForm.hide('slow');
                addStickyTo(sectionId);
                return;
            }
            if(e.keyCode == 27){
                addStickyForm.hide('slow');
            }
        });
    };

    var addStickyTo = function(sectionId) {
            var stickyText = $('#section'+sectionId).find('textarea').val();
            $('.stickyText').val("");
            $.ajax({
                url: '/sections/' + sectionId + '/points.json?point[message]=' + encodeURIComponent(stickyText),
                type: "POST",
                success: function(result) {
                    addSticky(result);
                }
            });
    };

    var getSectionPoints = function(sectionid) {
        $.getJSON("/sections/" + sectionid + "/points.json", displaySectionPoints);
    };

    var addSticky = function(point) {
        var stickyTemplateHtml = $('#stickyTemplate').html();
        $(stickyTemplateHtml).appendTo('#section' + point.section_id + ' .points');
        var addedPoint = $('#section' + point.section_id).find('div.sticky:last');
        addedPoint.hide();
        addedPoint.find('.stickyText').html(point.message);
        addedPoint.attr('title', point.message);
        addedPoint.find('.updatedAt').html(point.updated_at);
        addedPoint.attr('id', 'point' + point.id);
        if (point.votes)
            addedPoint.find('.voteCount').html("+"+point.votes.length);
        attachStickyEvents(addedPoint);
        addedPoint.show('slow');
//        Cufon.refresh();
    };

    var attachStickyEvents=function(addedPoint){
        addedPoint.click(function()
        {
            var sectionId = $(this).parents('.section').attr('id').replace("section", "");
            var pointId = $(this).attr('id').replace("point", "");
            showLargeStickyDialog(addedPoint,sectionId,pointId);
        });
    };

    var showLargeStickyDialog = function(addedPoint,sectionId,pointId){
        $('#largeStickyDialog').find('.stickyText').html(addedPoint.find('.stickyText').html());
        $('#largeStickyDialog').find('span.voteCount').html(addedPoint.find('.voteCount').html());
        $('#largeStickyDialog').find('.removeStickyButton').unbind('click').click(
                function() {removeStickyCall(sectionId, pointId); $('#largeStickyDialog').dialog('close'); });
        $('#largeStickyDialog').find('.voteStickyButton').unbind('click').click(
                function() {addVote(pointId)});
        $('#largeStickyDialog').dialog('open');
    };

    var addVote = function(pointId) {
        $.ajax({
            url: "/points/" + pointId + "/votes.json",
            type: "POST",
            data: {"vote": {"point_id": parseInt(pointId, 10) }},
            success: function(result) {
                var newVoteCount = parseInt($('#point'+pointId).find('.voteCount').html(),10)+1;
                $('#point'+pointId+',#largeStickyDialog').find('.voteCount').html("+"+newVoteCount);
                $('#point'+pointId+',#largeStickyDialog').find('.voteCount').hide('slow');
                $('#point'+pointId+',#largeStickyDialog').find('.voteCount').show('slow');
            }
        });
    };

    var removeStickyCall = function(sectionId, pointId) {
        removeSticky(pointId);
        $.ajax({
            url: "/sections/" + sectionId + "/points/delete/" + pointId + ".json",
            type: "GET"
        });
    };

    var removeSticky = function(pointId) {
        $('#point' + pointId).hide('slow', function() {
            $('#point' + pointId).remove();
        });
    };

    var displaySectionPoints = function(data) {
        pointIds = new Array();
        for (var pointIndex in data) {
            var point = data[pointIndex];
            if (!isAlreadyExisting(point.id)) {
                addSticky(point);
            }
            else {
                updateSticky(point);
            }
            pointIds.push(point.id + "");
        }
        if(data && data[pointIndex]){
            removePointHtmlIfNotInData(pointIds, data[pointIndex].section_id);
        }
    };

    var updateSticky =  function(point){
        $('#point'+point.id).find('.voteCount').html("+"+point.votes.length);
    };

    var removePointHtmlIfNotInData = function(pointIds, sectionId) {
        $('#section' + sectionId + ' .points').find('.sticky').each(function() {
            var pointId = $(this).attr('id').replace('point', '');
            if (jQuery.inArray(pointId, pointIds) == -1) {
                removeSticky(pointId);
            }
        });
    };

    var isAlreadyExisting = function(pointId) {
        return $('#point' + pointId).length > 0;
    };

    this.refreshSections = function() {
        $('.section:visible').each(function() {
            var sectionId = $(this).attr('id').replace("section", "");
            getSectionPoints(sectionId);
        })
    };
};

$(document).ready(function() {
    var retroId = $("meta[name=retroId]").attr("content");
    var ideaBoardz = new Ideaboardz(retroId);
    ideaBoardz.init();
    $('#largeStickyDialog').dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true
    });
    setInterval(ideaBoardz.refreshSections, 20000);
});
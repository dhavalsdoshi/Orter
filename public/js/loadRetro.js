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

    var displayRetroDetails = function(data) {
        $('#ideaboardTitle').html(data.description);
    };

    var getSectionDetails = function() {
        $.getJSON("/retros/" + retrospectiveId + "/sections.json", displaySectionDetails);
    };

    var displaySectionDetails = function(data) {
        var sectionTemplateHtml = $('#sectionTemplate').html();
        var section;
        for (var sectionIndex in data) {
            section = data[sectionIndex];
            $(sectionTemplateHtml).appendTo('#sections');
            var addedSection = $("#sections").find('div.section:last');
            addedSection.attr('id', 'section' + section.id);
            addedSection.find('h4').html(section.name);
            getSectionPoints(section.id);
            addedSection.find('.addStickyButton').click(function() {
                var sectionId = $(this).parents('.section').attr('id').replace("section", "");
                showAddStickyDialog(sectionId);
            });
        }
    };

    var showAddStickyDialog = function(sectionId) {
        $('#dialog').dialog("option", "buttons", getButtonsFor(sectionId));
        $('#dialog').dialog('open');
    };

    var getButtonsFor = function(sectionId) {
        var addStickyCall = function() {
            var stickyText = $('#stickyText').val();
            $('#stickyText').val("");
            $.ajax({
                url: '/sections/' + sectionId + '/points.json?point[message]=' + encodeURIComponent(stickyText),
                type: "POST",
                success: function(result) {
                    $('#dialog').dialog('close');
                    addSticky(result);
                }
            });
        };
        return { "Cancel": function() {
            $(this).dialog("close");
        } ,"Ok":addStickyCall};
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
            addedPoint.find('.voteCount').html(point.votes.length);
        attachPointEvents(addedPoint);
        addedPoint.show('slow');
//        Cufon.refresh();
    };

    var attachPointEvents = function(addedPoint) {
        addedPoint.find('.removeStickyButton').click(
                function() {
                    var sectionId = $(this).parents('.section').attr('id').replace("section", "");
                    var pointId = $(this).parents('.sticky').attr('id').replace("point", "");
                    removeStickyCall(sectionId, pointId)
                });
        addedPoint.find('.voteStickyButton').click(
                function() {
                    var pointId = $(this).parents('.sticky').attr('id').replace("point", "");
                    addVote(pointId)
                })
    };

    var addVote = function(pointId) {
        $.ajax({
            url: "/points/" + pointId + "/votes.json",
            type: "POST",
            data: {"vote": {"point_id": parseInt(pointId, 10) }},
            success: function(result) {
                var newVoteCount = parseInt($('#point'+pointId).find('.voteCount').html(),10)+1;
                $('#point'+pointId).find('.voteCount').html(newVoteCount);
                $('#point'+pointId).find('.voteCount').hide('slow');
                $('#point'+pointId).find('.voteCount').show('slow');
            }
        });
    };

    var removeStickyCall = function(sectionId, pointId) {
        $.ajax({
            url: "/sections/" + sectionId + "/points/delete/" + pointId + ".json",
            type: "GET",
            success: function(result) {
                removeSticky(pointId);
            }
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
        removePointHtmlIfNotInData(pointIds, data[pointIndex].section_id);
    };

    var updateSticky =  function(point){
        $('#point'+point.id).find('.voteCount').html(point.votes.length);
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
    $('#dialog').dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true
    });
    setInterval(ideaBoardz.refreshSections, 20000);
});
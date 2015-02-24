var Section = function(section){
  this.id = section.attr('id').replace('section', '');
  this.stickies = new Array();
};

Section.prototype.addSticky = function(stickyText){
  var thisSection = this;
  $a.trackEvent('point', 'create', "section-"+thisSection.id);
  $.ajax({
    url: '/points.json',
    data:
    {
      "point[section_id]": thisSection.id,
      "point[message]": stickyText
    },
    type: "POST",
    success: function(result) {
      thisSection.attachSticky(result);
    }
  });
};

Section.prototype.attachSticky = function(point) {
  var sticky = Sticky.createFrom(point.message, point.votes_count, point.id);
  sticky.attachTo(point.section_id);
  this.stickies.push(sticky);
};

Section.prototype.getDom = function(){
  return $('#section'+this.id);
};

Section.prototype.setupEvents = function(){
  var thisSection = this;
  var showAddSticky = function() {
    var addStickyForm = thisSection.getDom().find(".addStickyForm");
    var textInputArea = addStickyForm.find('textarea');
    addStickyForm.show('slow');
    textInputArea.focus();
  };
  this.getDom().find('.addStickyButton').click(function() {
    showAddSticky();
  });
  var addStickyForm = this.getDom().find(".addStickyForm");
  var textInputArea = addStickyForm.find('textarea');
  textInputArea.keypress(function(e) {
    if (e.keyCode == 13) {
      addStickyForm.hide('slow');
      var text = $(this).val().trim();
      addStickyTo(thisSection.id, text);
      return;
    }
    if (e.keyCode == 27) {
      addStickyForm.hide('slow');
    }
  });
  textInputArea.blur(function() {
    addStickyForm.hide('slow');
    var text = $(this).val().trim();
    addStickyTo(thisSection.id, text);
  });

  var addStickyTo = function(sectionId, stickyText) {
    if (stickyText.length > 0) {
      $('.stickyText').val("");
      thisSection.addSticky(stickyText);
    }
  };
};

var Ideaboardz = function() {
  var that = this;
  var sections = new Array();
  this.init = function() {
    fillSectionsAndAttachEvents();
    that.refreshSections();
  };

  var fillSectionsAndAttachEvents = function() {
    $('.section').each(function() {
      var section = $(this);
      var sectionObject = new Section(section);
      sectionObject.setupEvents();
      sections.push(sectionObject);
    });
  };
  var findSectionBy = function(id){
    return _.find(sections,function(section){return section.id == id});
  };

  var displaySectionPoints = function(data) {
    var allPoints = [];
    if(data) {
      removePointHtmlIfNotInData(data);
    }
    for (var pointIndex in data) {
      var point = data[pointIndex];
      if(!isAlreadyExisting(point)) {
        var section = findSectionBy(point.section_id);
        section.attachSticky(point);
      }
      else {
        updateSticky(point);
      }
      allPoints.push(point);
    }

    $U.filterStickies();
    $U.sortStickies();
    setTimeout(that.refreshSections,10000)
  };

  var allPointsOnBoard = function(){
    return _.map($('.points .sticky'), function(dom) {return new Sticky($(dom))});
  };

  var updateSticky = function(point) {
    var stickyToUpdate = _.find(allPointsOnBoard(), function(sticky){return sticky.id == point.id && sticky.sectionId() == point.section_id});
    stickyToUpdate.update(point.message, point.votes_count);
  };

  var removePointHtmlIfNotInData = function (allPointsFromServer) {
    var stickiesToBeDeleted = _.filter(allPointsOnBoard(), function (sticky) {
      var pointOnBoard = _.find(allPointsFromServer, function (pointFromServer) {
        return sticky.id == pointFromServer.id && sticky.sectionId() == pointFromServer.section_id
      });
      return pointOnBoard === undefined;
    });
    _.invoke(stickiesToBeDeleted, "removeFromDom");
  };

  var isAlreadyExisting = function(point) {
    return $('#section' + point.section_id + ' #point' + point.id).length > 0;
  };

  this.refreshSections = function() {
    var retroId = $('meta[name="retroId"]').attr('content');
    var retroName = $('meta[name="retroName"]').attr('content');
    $.ajax({
      url: "/retros/"+ encodeURIComponent(retroName) + "/" + retroId + "/points.json",
      dataType: 'json',
      success: displaySectionPoints,
      error: function(){
        setTimeout(that.refreshSections,15000)
      },
      timeout: 9000
    });
  };
};

$(document).ready(function() {
    var ideaBoardz = new Ideaboardz();
    ideaBoardz.init();
    $('#largeStickyDialog').dialog({
        autoOpen: false,
        height: 255,
        width: 350,
        modal: true
    });
    $('#sortBy').change($U.sortStickies).change();
    $('#search').keyup($U.filterStickies);
    $('#retro_section_id').change($U.filterSection).change();
    $("#pdfExport,#excelExport").click(
      function(){$a.trackEvent('board', $(this).attr('id'),window.location.pathname.replace('/for/','') );
    });
    $('.section').droppable({
      accept: function(element){
        return $(this).attr('id') != $(element).parents('.section').attr('id');
      },
      hoverClass: "ui-state-highlight",
      drop: function( event, ui ) {
        var sticky = new Sticky(ui.draggable);
        $a.trackEvent('point','changeSection',sticky.id);
        sticky.moveTo(new Section($(this)));
      }
    });
    $('textarea').keyup(function(){
      var maxlength= $(this).attr("maxlength") !== undefined ? parseInt($(this).attr("maxlength")) : 100000000;
      if ($(this).val().length>maxlength)
      $(this).value($(this).value().substring(0, maxlength -1));
    });
});

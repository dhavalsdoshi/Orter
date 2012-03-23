var Section = function(section_id){
  this.id = section_id;
  this.stickies = new Array();
};

Section.prototype.addSticky = function(stickyText){
  var thisSection = this;
  $a.trackEvent('point', 'create', stickyText);
  $.ajax({
    url: '/points.json?point[section_id]=' + thisSection.id + '&point[message]=' + encodeURIComponent(stickyText),
    type: "POST",
    success: function(result) {
      thisSection.attachSticky(result);
    }
  });
};

Section.prototype.attachSticky = function(point) {
  var sticky = new Sticky(point.message, point.votes_count, point.id);
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
      var sectionId = section.attr('id').replace('section', '');
      var sectionObject = new Section(sectionId);
      sectionObject.setupEvents();
      sections.push(sectionObject);
    });
  };
  var findSectionBy = function(id){
    return _.find(sections,function(section){return section.id == id});
  };

  var displaySectionPoints = function(data) {
    var allPointIds = [];
    for (var pointIndex in data) {
      var point = data[pointIndex];
      if(!isAlreadyExisting(point.id)) {
        var section = findSectionBy(point.section_id);
        section.attachSticky(point);
      }
      else {
        updateSticky(point);
      }
      allPointIds.push(point.id);
    }
    if(data && data[pointIndex]) {
      removePointHtmlIfNotInData(allPointIds);
    }
    $U.filterStickies();
    $U.sortStickies();
  };

  var allPointsOnBoard = function(){
    return _.flatten(_.map(sections,function(section){return section.stickies}));
  };

  var updateSticky = function(point) {
    var stickyToUpdate = _.find(allPointsOnBoard(), function(sticky){return sticky.id == point.id});
    stickyToUpdate.update(point.message, point.votes_count);
  };

  var removePointHtmlIfNotInData = function(allPointIdsFromServer) {
    var stickiesToBeDeleted = _.filter(allPointsOnBoard(),function(sticky){ return !_.include(allPointIdsFromServer, sticky.id)});
    _.invoke(stickiesToBeDeleted, "removeFromDom");
  };

  var isAlreadyExisting = function(pointId) {
    return $('#point' + pointId).length > 0;
  };

  this.refreshSections = function() {
    var retroId = $('meta[name="retroId"]').attr('content');
    $.getJSON("/retros/" + retroId + "/points.json", displaySectionPoints);
  };
};

$(document).ready(function() {
    var ideaBoardz = new Ideaboardz();
    ideaBoardz.init();
    $('#largeStickyDialog').dialog({
        autoOpen: false,
        height: 230,
        width: 350,
        modal: true
    });
    setInterval(ideaBoardz.refreshSections, 10000);
    $('#sortBy').change($U.sortStickies).change();
    $('#search').keyup($U.filterStickies);
    $('#retro_section_id').change($U.filterSection).change();
    $("#pdfExport,#excelExport").click(
      function(){$a.trackEvent('board', $(this).attr('id'),window.location.pathname.replace('/for/','') );
    });
});

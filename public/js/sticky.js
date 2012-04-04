var Sticky = function(text, votes, id, tag){
  this.text = $.trim(text);
  this.votes = votes;
  this.id = id;
  this.tag = tag;
};

Sticky.prototype.attachTo = function(sectionId){
  var thisSticky= this;

  var showLargeStickyDialog = function(addedPoint, sticky) {
    var colorOfSticky = addedPoint.parents('.section').attr('data-color');
    var uiDialog = $('#largeStickyDialog').parent('.ui-widget-content');
    uiDialog.removeClass(uiDialog.attr('class').split(/\s+/).pop())
      .addClass(colorOfSticky);
    //TODO: this should use the sticky object data
    $('#largeStickyDialog .stickyText').val(sticky.text);
    $('#largeStickyDialog .voteCountContainer .count').html(sticky.votes);
    $('#tagNameText').val(sticky.tag);
    $('#largeStickyDialog .removeStickyButton').unbind('click').click(
      function() {
        thisSticky.remove();
        $('#largeStickyDialog').dialog('close');
      });
    $("#largeStickyDialog textarea").unbind('blur').blur(function(){
      thisSticky.edit($.trim($(this).val()));
    });
    $("#largeStickyDialog #tagNameText").unbind('blur').blur(function(){
      thisSticky.addTag($.trim($(this).val()));
    });
    $('#largeStickyDialog').find('.voteStickyButton').unbind('click').click(function(){thisSticky.upVote();});
    $('#largeStickyDialog').dialog('open');
  };

  var stickyTemplateHtml = $('#stickyTemplate').html();
  $(stickyTemplateHtml).appendTo('#section' + sectionId + ' .points');
  var addedPoint = $('#section' + sectionId).find('div.sticky:last');
  addedPoint.hide().attr('title', this.text)
    .attr('id', 'point' + this.id)
    .attr('data-id', this.id)
    .find('.stickyText').html(this.text);
  addedPoint.find('.tag').html(this.tag);
  addedPoint.find('.voteCount .count').html(this.votes);
  addedPoint.click(function() {
      showLargeStickyDialog(addedPoint,thisSticky);
    });
  addedPoint.show('slow');
};

Sticky.prototype.getDom = function(){
  return $("#point" + this.id);
};

Sticky.prototype.updateDom = function(){
  this.getDom().find(".stickyText").html(this.text);
  this.getDom().find(".count").html(this.votes);
  this.getDom().find(".tag").html(this.tag);
};


//var allTags = [];
Sticky.prototype.addTag = function(tag){
//  allTags.push("someTag");
  this.tag = tag;
  var thisSticky = this;
  $('#largeStickyDialog .tagUpdated').show('updating...');
  $.ajax({
    url: "/points/tag",
    type: "POST",
    data: {"point_ids": thisSticky.id, "tag": thisSticky.tag},
    success: function(result) {
      thisSticky.updateDom();
      $('#largeStickyDialog .tagUpdated').text('done').show().delay(2000).fadeOut();
    },
    error: function(result) {
      alert('something went wrong. Please refresh the page');
    }
  });
};

Sticky.prototype.upVote = function(){
  this.votes += 1;
  var thisSticky = this;
  $('#largeStickyDialog').find('.voteCountContainer').addClass("ajaxLoader");
  $('#largeStickyDialog .voteUpdated').text('Updating..').show();

  $.ajax({
    url: "/points/" + thisSticky.id + "/votes.json",
    type: "POST",
    data: {"vote": {"point_id": thisSticky.id }},
    success: function(result) {
      $('#largeStickyDialog .count').text(thisSticky.votes);
      $('#largeStickyDialog .voteCountContainer').removeClass("ajaxLoader");
      $('#largeStickyDialog .voteUpdated').text('Done').show().delay(2000).fadeOut();
      thisSticky.updateDom();
    },
    error: function(result) {
      alert('something went wrong. Please refresh the page');
    }
  });
};

Sticky.prototype.removeFromDom = function(){
  var thisSticky = this;
  this.getDom().hide('slow', function() {
    thisSticky.getDom().remove();
  });
};

Sticky.prototype.remove = function(){
  this.removeFromDom();
  $a.trackEvent('point', 'delete', $('#point' + this.id + " .stickyText").text());
  $.ajax({
    url: "/points/delete/" + this.id + ".json",
    type: "GET"
  });
};

Sticky.prototype.update = function(text,votes,tag){
  this.text = $.trim(text);
  this.votes = votes;
  this.tag = tag;
  this.updateDom();
};

Sticky.prototype.edit = function(value) {
    this.update(value);
    $('#largeStickyDialog .stickyUpdated').text('updating...').show();
    $.ajax({
      url: '/points/' + this.id,
      type: 'PUT',
      data: {
          'point' :{
              'message': this.text
          }
      },
      success: function(result) {
        $('#largeStickyDialog .stickyUpdated').text('done').show().delay(2000).fadeOut();
      }
    });
};

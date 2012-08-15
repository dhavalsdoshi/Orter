var Sticky = function(dom){
  this.element = dom;
  this.text = $.trim(dom.attr('data-content'));
  this.votes = parseInt($.trim(dom.find('.voteCount .count').html()));
  this.id = parseInt(dom.attr('data-id'));
};

Sticky.createFrom = function(text, votes, id) {
  var stickyTemplateHtml = $('#stickyTemplate').html();
  var addedPoint = $(stickyTemplateHtml);
  addedPoint.hide()
    .attr('title', text)
    .attr('data-content', text)
    .attr('id', 'point' + id)
    .attr('data-id', id)
    .find('.stickyText').html(text);
  addedPoint.find('.voteCount .count').html(votes);
  return new Sticky(addedPoint);
};

Sticky.prototype.displayText = function(){
  return this.text.replace(/\n-{3,}\n/g,'<hr/>');
};

Sticky.prototype.titleText = function(){
  return this.text.replace(/\n-{3,}\n/g,' | ');
};

Sticky.prototype.attachTo = function(sectionId){
  var thisSticky= this;

  var showLargeStickyDialog = function(addedPoint) {
    var colorOfSticky = addedPoint.element.parents('.section').attr('data-color');
    var uiDialog = $('#largeStickyDialog').parent('.ui-widget-content');
    uiDialog.removeClass(uiDialog.attr('class').split(/\s+/).pop())
      .addClass(colorOfSticky);

    $('#largeStickyDialog').find('.stickyText').val(addedPoint.text);
    $('#largeStickyDialog').find('.voteCountContainer .count').html(addedPoint.votes);
    $('#largeStickyDialog').find('.removeStickyButton').unbind('click').click(
      function() {
        if(confirm("Do you want to delete this sticky?")){
          thisSticky.remove();
          $('#largeStickyDialog').dialog('close');
        }
      });
    $("#largeStickyDialog textarea").unbind('blur').blur(function(){
      thisSticky.edit_message($.trim($(this).val()));
    });
    $('#largeStickyDialog').find('.voteStickyButton').unbind('click').click(function(){thisSticky.upVote();});
    $('#largeStickyDialog').dialog('open');
  };

  $('#section' + sectionId + ' .points').append(this.element);
  this.element = $('#section' + sectionId + ' .points div.sticky:last');
  this.element.draggable({revert: 'invalid', scroll: false, containment: '.whiteboard', appendTo: "body", helper: "clone"}).droppable({
  			hoverClass: "ui-state-highlight",
        greedy: true,
  			drop: function( event, ui ) {
          thisSticky.merge(new Sticky(ui.draggable));
  			}
  		}).click(function() {
      showLargeStickyDialog(thisSticky);
  });
  this.element.show();
  this.updateDom();
};

Sticky.prototype.merge = function(otherSticky) {
  var sticky = this;
  this.text += "\n---------------\n" + otherSticky.text;
  sticky.updateDom();
  console.log(this.displayText());
  console.log(this.text);
  this.edit({'message': this.text}, function() {
    otherSticky.remove();
  });
};

Sticky.prototype.moveTo = function(section) {
  var sticky = this;
  this.edit({'section_id': section.id}, function() {
    sticky.edit_section(section.id);
    sticky.removeFromDom();
    Sticky.createFrom(sticky.text, sticky.votes, sticky.id).attachTo(section.id);
  });
};


Sticky.prototype.updateDom = function(){
  this.element.find(".stickyText").html(this.displayText());
  this.element.attr("data-content", this.text);
  this.element.attr("title", this.titleText());
  this.element.find(".count").html(this.votes);
};

Sticky.prototype.upVote = function(){
  this.votes += 1;
  var thisSticky = this;
  $('#largeStickyDialog .voteUpdated').text('Updating...').addClass('show');
  $.ajax({
    url: "/points/" + thisSticky.id + "/votes.json",
    type: "POST",
    data: {"vote": {"point_id": thisSticky.id }},
    success: function(result) {
      $('#largeStickyDialog .count').text(thisSticky.votes);
      $('#largeStickyDialog .voteUpdated').text('Updated');
      setTimeout(function(){$('#largeStickyDialog .voteUpdated').removeClass('show');}, 2000);
      thisSticky.updateDom();
    },
    error: function(result) {
      alert('something went wrong. Please refresh the page');
    }
  });
};

Sticky.prototype.removeFromDom = function(){
  var thisSticky = this;
  this.element.hide('slow', function() {
    thisSticky.element.remove();
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

Sticky.prototype.update = function(text,votes){
  this.text = $.trim(text);
  if(votes){
    this.votes = votes;
  }
  this.updateDom();
};

Sticky.prototype.edit_message = function(value) {
  this.update(value);
  $('#largeStickyDialog .stickyUpdated').text('Updating...').addClass('show');
  this.edit({'message': value}, function(result) {
    $('#largeStickyDialog .stickyUpdated').text('Updated');
    setTimeout(function(){$('#largeStickyDialog .stickyUpdated').removeClass('show');}, 2000);
  });
};

Sticky.prototype.edit_section = function(section_id) {
  this.edit({'section_id': section_id}, function() {});
};

Sticky.prototype.edit = function(value_hash, success) {
    $.ajax({
      url: '/points/' + this.id,
      type: 'PUT',
      data: {
          'point' : value_hash
      },
      success: function(result) {
        success(result);
      }
    });
};

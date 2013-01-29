var Sticky = function(dom){
  this.element = dom;
  this.text = $.trim(dom.attr('data-content'));
  this.upVotes = parseInt($.trim(dom.find('.upVoteCount .count').html()) || 0);
  this.downVotes = parseInt($.trim(dom.find('.downVoteCount .count').html()) || 0);
  this.id = parseInt(dom.attr('data-id'));
};

Sticky.createFrom = function(text, upVotesCount, downVotesCount, id) {
  var encodedText = $.isHtmlEncoded(text) ? text : $.htmlEncode(text)
  var stickyTemplateHtml = $('#stickyTemplate').html();
  var addedPoint = $(stickyTemplateHtml);
  addedPoint.hide()
    .attr('title', text)
    .attr('data-content', text)
    .attr('id', 'point' + id)
    .attr('data-id', id)
    .find('.stickyText').html(encodedText);
  addedPoint.find('.upVoteCount .count').html(upVotesCount);
  addedPoint.find('.downVoteCount .count').html(downVotesCount);
  return new Sticky(addedPoint);
};

Sticky.prototype.decodedText = function(){
  return $.isHtmlEncoded(this.text) ? $.htmlDecode(this.text) : this.text;
};

Sticky.prototype.encodedText = function(){
  return $.isHtmlEncoded(this.text) ? this.text : $.htmlEncode(this.text);
};

Sticky.prototype.displayText = function(){
  return this.encodedText().replace(/\n-{3,}\n/g,'<hr/>');
};

Sticky.prototype.titleText = function(){
  return this.text.replace(/\n-{3,}\n/g,' | ');
};

Sticky.prototype.sectionId = function(){
  return parseInt(this.element.parents('.section').attr('id').replace('section', ''));
};

Sticky.prototype.attachTo = function(sectionId){
  var thisSticky= this;

  $('#section' + sectionId + ' .points').append(this.element);
  this.element = $('#section' + sectionId + ' .points div.sticky:last');
  this.element.draggable({revert: 'invalid', scroll: false, containment: '.whiteboard', appendTo: "body", helper: "clone"}).droppable({
  			hoverClass: "ui-state-highlight",
        greedy: true,
  			drop: function( event, ui ) {
          $a.trackEvent('point','merge', thisSticky.id);
          thisSticky.merge(new Sticky(ui.draggable));
  			}
  		}).unbind('click').bind('click', function() {
      new EditableSticky(new Sticky(thisSticky.element)).show();
  });
  this.element.show();
  this.updateDom();
};

Sticky.prototype.merge = function(otherSticky) {
  if(!confirm("You are about to merge two stickies into one. Do you want to continue?")) {
    return;
  }

  var sticky = this;
  this.text += "\n---------------\n" + otherSticky.text;
  sticky.updateDom();
  this.edit({'message': this.text}, function() {
    otherSticky.remove();
  });
  if (otherSticky.votes > 0) {
    this.edit_vote("UpVote", this.upVotes + otherSticky.upVotes, function(){})
    this.edit_vote("DownVote", this.downVotes + otherSticky.downVotes, function(){})
  }
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
  this.element.find(".upVoteCount .count").html(this.upVotes);
  this.element.find(".downVoteCount .count").html(this.downVotes);
};

Sticky.prototype.removeFromDom = function(){
  var thisSticky = this;
  this.element.hide('slow', function() {
    thisSticky.element.remove();
  });
};

Sticky.prototype.remove = function(){
  this.removeFromDom();
  $a.trackEvent('point', 'delete', this.id);
  $.ajax({
    url: "/points/delete/" + this.id + ".json",
    type: "GET"
  });
};

Sticky.prototype.update = function(text,upVotes,downVotes){
  this.text = $.trim(text);
  this.upVotes = upVotes || this.upVotes;
  this.downVotes = downVotes || this.downVotes;
  this.updateDom();
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

Sticky.prototype.edit_vote = function(type, count, success) {
  var thisSticky = this;
  if (type === 'UpVote') thisSticky.upVotes = count;
  if (type === 'DownVote') thisSticky.downVotes = count;
  $.ajax({
    url: "/points/" + thisSticky.id + "/votes.json",
    type: "POST",
    data: {"vote": {"point_id": thisSticky.id, "type": type}},
    success: function(result) {
      thisSticky.updateDom();
      success(result)
    },
    error: function(result) {
      alert('something went wrong. Please refresh the page');
    }
  });
};

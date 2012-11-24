var EditableSticky = function(sticky) {
  this.sticky = sticky;
  this.dialog = $('#largeStickyDialog').dialog();
};

//function htmlDecode(input){
//  var e = document.createElement('div');
//  e.innerHTML = input;
//  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
//}

EditableSticky.prototype.show = function () {
  var thisSticky = this;
  var colorOfSticky = this.sticky.element.parents('.section').attr('data-color');
  var uiDialog = this.dialog.parent('.ui-widget-content');
  uiDialog.removeClass(uiDialog.attr('class').split(/\s+/).pop())
      .addClass(colorOfSticky);

  this.dialog.find('.stickyText').val(this.sticky.decodedText());
  this.dialog.find('.voteCountContainer .count').html(this.sticky.votes);
  this.dialog.find('.removeStickyButton').unbind('click').click(
      function () {
        if (confirm("Do you want to delete this sticky?")) {
          thisSticky.sticky.remove();
          thisSticky.dialog.dialog('close');
        }
      });
  this.dialog.find("textarea").unbind('blur').blur(function () {
    thisSticky.edit_message($.trim($(this).val()));
  });
  this.dialog.find('.voteStickyButton').unbind('click').click(function () {
    thisSticky.upVote();
  });
  this.dialog.dialog('option','beforeClose',function(){
    thisSticky.dialog.find("textarea").blur();
  });
  this.dialog.dialog('open');
};

EditableSticky.prototype.edit_message = function(value) {
  var thisSticky = this;
  this.sticky.update(value);
    console.log(value);
  this.dialog.find('.stickyUpdated').text('Updating...').addClass('show');
  this.sticky.edit({'message': value}, function(result) {
    thisSticky.dialog.find('.stickyUpdated').text('Updated');
    setTimeout(function(){thisSticky.dialog.find('.stickyUpdated').removeClass('show');}, 2000);
  });
};


EditableSticky.prototype.upVote = function(){
  var thisSticky = this;
  this.dialog.find('.voteUpdated').text('Updating...').addClass('show');
  this.sticky.edit_vote(this.sticky.votes + 1, function(result){
    $('.count', thisSticky.dialog).text(thisSticky.sticky.votes);
    $('.voteUpdated', thisSticky.dialog).text('Updated');
    setTimeout(function(){$('.voteUpdated', thisSticky.dialog).removeClass('show');}, 2000);
  });
};

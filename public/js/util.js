$.extend($.expr[':'], {
  'containsi': function(elem, i, match, array)
  {
    return (elem.textContent || elem.innerText || '').toLowerCase()
    .indexOf((match[3] || "").toLowerCase()) >= 0;
  }
});

var $U = {};
$U.filterStickies = function(){
  var text = $('#search').val();
  $('div.sticky:containsi("'+ text +'")').show();
  $('div.sticky:not(:containsi("'+ text +'"))').hide();
};

$U.filterSection= function(){
  if($('#retro_section_id').length >0){
    var filterSectionId = $('#retro_section_id').val();
    if(filterSectionId){
      $('.section').removeClass('full').hide();
      $("#section"+filterSectionId).addClass("full").show();
    }
    else{
      $('.section').removeClass('full').show();
    }
  }
};

$U.sortStickies= function(){
  if($('#sortBy').val() == "votes") {
    $('.section').each(function() {
      $(this).find('.sticky').tsort('.voteCount .count', {order:"desc"});
    });
  }
  else if($('#sortBy').val() == "tags") {
    $('.section').each(function() {
      $(this).find('.sticky').tsort('.tag', {order:"asc"});
    });
  }
  else {
    $('.section').each(function() {
      $(this).find('.sticky').tsort({attr:"data-id", order:"asc"});
    });
  }
};

//var $urls = {};
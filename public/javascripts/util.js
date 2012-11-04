jQuery.extend( {
    isHtmlEncoded: function(str) {
        if(str == null) { return false; }
        if(str.search(/&amp;/g) != -1 || str.search(/&lt;/g) != -1 || str.search(/&gt;/g) != -1)
            return true;
        else
            return false;
    },

    htmlDecode: function(str) {
        if($.isHtmlEncoded(str))
            return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        return str;
    }
});

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
  else {
    $('.section').each(function() {
      $(this).find('.sticky').tsort({attr:"data-id", order:"asc"});
    });
  }
};

//var $urls = {};
var $a = {
  trackEvent : function(resource, action, data){
    _gaq.push(['_trackEvent', resource, action, data]);
  }
};

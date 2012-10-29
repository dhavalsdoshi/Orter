IdeaBoardz.WebIdeaBoardz = function(domain) {
    this.domain = domain;
};

function ajaxGetRequest(type, context, url, dataType, success, error) {
    $.ajax({
        timeout: 9000,
        type:type,
        context:context,
        url:url,
        dataType:dataType,
        success:success,
        error:error
    });
}
function ajaxPostRequest(type, context, url, success, error) {
    $.ajax({
        type:type,
        context:context,
        url:url,
        success:success,
        error:error
    });
}
IdeaBoardz.WebIdeaBoardz.prototype = {

    createIdea: function(sectionId, message, callbacks) {
        callbacks = callbacks || {};
        var success = callbacks.success || function() {};
        var error = callbacks.error || function() {};
        var context = callbacks.context;

        var url = this.domain + '/points.json?point[section_id]='+encodeURIComponent(sectionId)+'&point[message]=' + encodeURIComponent(message);
        var type = 'POST';

        ajaxPostRequest(type, context, url, success, error);
    },

    getBoard: function(boardName, boardId, callbacks) {
        callbacks = callbacks || {};
        var context = callbacks.context;

        var success = callbacks.success || function() {};
        var error = callbacks.error || function() {};

        var url = this.domain + '/for/' + encodeURIComponent(boardName) + '/' + boardId + '.json';
        var type = 'GET';
        var dataType = 'json';

        ajaxGetRequest(type, context, url, dataType, success, error);
    },

    getIdeas : function(boardID, callbacks){
        callbacks = callbacks || {};
        var context = callbacks.context;

        var success = callbacks.success || function() {};
        var error = callbacks.error || function() {};

        var url = this.domain + '/retros/' + boardID + '/points.json';
        var type = 'GET';
        var dataType = 'json';
        ajaxGetRequest(type, context, url, dataType, success, error);
    }
};

IdeaBoardz.WebIdeaBoardz.instance = new IdeaBoardz.WebIdeaBoardz("");


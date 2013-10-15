var IdeaBoardz = $.extend({}, IdeaBoardz || {});

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

function ajaxPutRequest(context, url, success, error, point) {
    $.ajax({
        type:'PUT',
        context:context,
        url:url,
        success:success,
        error:error,
        data: {
            'point' : point
        }
    });
}

IdeaBoardz.WebIdeaBoardz.prototype = {

    voteIdea: function(pointId,callbacks){
        $.ajax({
            url: "/points/" + pointId + "/votes.json",
            type: "POST",
            data: {"vote": {"point_id": pointId }},
            success:callbacks.success || function() {},
            error:callbacks.error || function() {},
            context: callbacks.context
        });
    },
    deleteIdea: function(pointId, message, callbacks){
        $.ajax({
            url: "/points/delete/" + pointId + ".json",
            type: "GET",
            data: {
              message: message
            },
            success:callbacks.success || function() {},
            error:callbacks.error || function() {},
            context: callbacks.context
        });
    },
    editIdea: function(pointId, oldmessage, message,callbacks){
        callbacks = callbacks || {};
        var success = callbacks.success || function() {},
            error = callbacks.error || function() {},
            context = callbacks.context,
            url = this.domain + '/points/' + pointId;
        ajaxPutRequest( context, url, success, error, {'message': message, 'oldmessage': oldmessage});
    },

    createIdea: function(sectionId, message, callbacks) {
        callbacks = callbacks || {};
        var success = callbacks.success || function() {},
            error = callbacks.error || function() {},
            context = callbacks.context,
            url = this.domain + '/points.json?point[section_id]='+encodeURIComponent(sectionId)+'&point[message]=' + encodeURIComponent(message),
            type = 'POST';
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

    getIdeas : function(boardID, boardName, callbacks){
        callbacks = callbacks || {};
        var context = callbacks.context;

        var success = callbacks.success || function() {};
        var error = callbacks.error || function() {};

        var url = this.domain + '/retros/'+ encodeURIComponent(boardName)+ '/' + boardID + '/points.json';
        var type = 'GET';
        var dataType = 'json';
        ajaxGetRequest(type, context, url, dataType, success, error);
    }
};

IdeaBoardz.WebIdeaBoardz.instance = new IdeaBoardz.WebIdeaBoardz("");


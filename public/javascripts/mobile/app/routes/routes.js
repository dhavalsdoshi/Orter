IdeaBoardz.AppRouter = Backbone.Router.extend({
    routes: {
        "": "sectionsList", //#for/mibTest/9
        "createIdea": "createIdea", // #for/mibTest/9/createIdea
        ":sid": "ideasList", //#for/mibTest/9/1
        "*actions":"error"
    },

    initialize: function(){
        var findSlash = new RegExp("(\/)+$", "g");
        this.route(/(.*)\/+$/, "trailFix", function (id) {
            var idWithNoEndingSlash = id.replace(findSlash, '');
            this.navigate(idWithNoEndingSlash, true);
        });
    },

    sectionsList: function(){
        var boardName = $('body').attr('data-name');
        var bid = $('body').attr('data-id');
        boardName=decodeURIComponent(boardName);
        var sectionsView = new IdeaBoardz.SectionsView("#container", boardName, bid);
    },

    ideasList: function(sid){
      var boardName = $('body').attr('data-name');
      var bid = $('body').attr('data-id');

      boardName=decodeURIComponent(boardName);
        var ideasView = new IdeaBoardz.IdeasView("#container", boardName, bid, sid);
    },

    createIdea: function(){
      var boardName = $('body').attr('data-name');
      var bid = $('body').attr('data-id');

      boardName=decodeURIComponent(boardName);
      var createIdeaView = new IdeaBoardz.CreateIdeaView("#container", boardName, bid);
    },

    error: function(actions){
        var errorView = new IdeaBoardz.ErrorView();
    }
});

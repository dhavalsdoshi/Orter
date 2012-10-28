$(document).ready(function () {

    IdeaBoardz.IdeasView = Backbone.View.extend({
        el:$('#viewWrapper'),
        template:_.template($('#template-ideasView').html()),
        navigationTemplate:_.template($("#template-navigation").html()),
        ideaTemplate:_.template($('#template-stickyView').html()),
        container: null,
        board: null,
        sectionId:null,

        initialize:function (container, boardName, boardId, sectionId) {
            this.container = container;
            this.sectionId = sectionId;

            var ideasViewHelper = new IdeaBoardz.ViewHelper(this, this.checkValidityOfSectionId);
            ideasViewHelper.getBoardForCurrentView(boardName, boardId);
        },

        checkValidityOfSectionId: function(){
            var sectionName = this.getSectionName();
            if (sectionName == undefined){
                this.renderSectionError();
            } else {
                this.renderBaseTemplate();
            }
        },

        renderSectionError: function(){
            var errorMsg = "<h4>No such section exists.</h4>The provided URL is invalid.<br/> Please check the URL again.";
            $(this.el).find(this.container).html(
                '<div id="alert-area" class="alert alert-error alert-main">'+ errorMsg +'</div>'
            );
        },

        renderBaseTemplate: function(){
            var html = this.template({boardName:this.board.name, sectionName:this.getSectionName()});
            $(this.el).find(this.container).html(html);
            $(this.container).find('.sectionWrapper').addClass(this.getSectionColor());
            $(this.container).find('#ideasList').append('<h2 class="loading">Retrieving Ideas</h2>');
            this.pollForIdeas();
        },

        pollForIdeas:function () {
            this.startListeningToGetIdeasEvents();

            IdeaBoardz.WebIdeaBoardz.instance.getIdeas(this.board.id, {
                success: function(data){
                    IdeaBoardz.Board.instance.ideas = data;
                    IdeaBoardz.dispatcher.trigger("change:ideasData");
                },
                error: function(){
                    IdeaBoardz.dispatcher.trigger("error:ideasData");
                }
            });

            var currentView = this;     //In setTimeout, 'this' always refers to the global object, so we have to pass the current context as a variable.
            IdeaBoardz.Board.instance.timer = setTimeout(function(){currentView.pollForIdeas()}, 10000);
        },

        startListeningToGetIdeasEvents:function () {
            IdeaBoardz.dispatcher.on("change:ideasData", this.renderSection, this);
            IdeaBoardz.dispatcher.on("error:ideasData", this.renderIdeasErrorNotice, this);
        },

        stopListeningToGetIdeasEvents:function () {
            IdeaBoardz.dispatcher.off("change:ideasData", this.renderSection, this);
            IdeaBoardz.dispatcher.off("error:ideasData", this.renderIdeasErrorNotice, this);
        },

        getSectionName: function(){
            var sections = this.board.sections;
            for(var index in sections){
                if(this.sectionId == sections[index].id){
                    return sections[index].name;
                }
            }
        },

        getSectionColor: function(){
          var colors = ["yellow","orange", "green","purple","aqua","blue"];
          return colors[this.sectionId%colors.length];
        },

        getIdeasListForThisSection: function(){
            var ideas = IdeaBoardz.Board.instance.ideas;
            var ideasInThisSection = [];

            for (var index = 0; index < ideas.length; index++) {
                var idea = ideas[index];
                if (idea.section_id == this.sectionId) {
                    ideasInThisSection.push(idea);
                }
            }
            return ideasInThisSection;
        },

        renderIdeasList:function(ideas){
            var stickyHtml = "";
            for (var index = 0; index < ideas.length; index++) {
                var idea = ideas[index];
                stickyHtml += this.ideaTemplate({ideaText:idea.message, vote_count:idea.votes_count});
            }
            $(this.container).find('#ideasList').html(stickyHtml);
        },

        renderEmptySectionMessage:function(){
            var emptyMessageHtml = "<li><a id='emptyMessage' href='#createIdea'>Got any ideas?</a></li>";
            $(this.container).find('#ideasList').html(emptyMessageHtml);
        },

        renderSection:function () {
            this.stopListeningToGetIdeasEvents();
            var ideasInThisSection = this.getIdeasListForThisSection();

            if (ideasInThisSection.length == 0){
                this.renderEmptySectionMessage();
            } else {
                this.renderIdeasList(ideasInThisSection);
            }
        },

        renderIdeasErrorNotice: function() {
            this.stopListeningToGetIdeasEvents();
            var errorMsg = "<h4>Problem retrieving ideas.</h4> Please check your URL or section id.";
            $(this.currentView.el).find(this.currentView.container).html(
                '<div id="alert-area" class="alert alert-error alert-main">'+ errorMsg +'</div>'
            );
        }
    });
});
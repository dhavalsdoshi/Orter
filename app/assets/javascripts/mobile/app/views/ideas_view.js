var IdeaBoardz = $.extend({}, IdeaBoardz || {});

$(document).ready(function () {
    _.templateSettings = {
        interpolate : /\{\{(.+?)\}\}/g
    };
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
            this.resetBinding();
            var ideasViewHelper = new IdeaBoardz.ViewHelper(this, this.checkValidityOfSectionId);
            ideasViewHelper.getBoardForCurrentView(boardName, boardId);
        },

        events: {
            "click .okBtn": "resumePoll",
            "click .editIdeaBtn": "makeStickyEditable",
            "click .deleteBtn": "deletePoint",
            "click .voteNumber": "votePoint"
        },

        resetBinding:function(){
            $(this.el).undelegate('.editIdeaBtn', 'click');
            $(this.el).undelegate('.okBtn', 'click');
            $(this.el).undelegate('.deleteBtn','click');
            $(this.el).undelegate('.voteNumber','click');
        },
        votePoint: function(event){
            event.preventDefault();
            var thisEl =$(event.currentTarget),
                currentVotes = parseInt(thisEl.find('.voteCount').text()),
                me=this;
            thisEl.find('.voteCount').text(currentVotes+1+"");
            IdeaBoardz.WebIdeaBoardz.instance.voteIdea(event.currentTarget.id,{
                success: me.showSuccess,
                error: me.showError,
                context: "this"
            });
            return false;
        },
        deletePoint: function(event){
            event.preventDefault();
            var me=this;
            var message = $("#"+event.currentTarget.id).find(".ideaText").html().replace(/<hr>/, "\n---------------\n");
            IdeaBoardz.WebIdeaBoardz.instance.deleteIdea(event.currentTarget.id, message, {
                success: me.showSuccess,
                error: me.showError,
                context: "this"
            });
            $("#ideasList>li[id='"+ event.currentTarget.id +"']").anim({opacity:'0'},0.5,'ease-out', function(){
                $(this).remove();
            });

            return false;
        },
        resumePoll: function(event){
            event.preventDefault();
            var el = $(event.currentTarget)[0],
                ideaTextEl = $(event.currentTarget).siblings('.ideaText')[0],
                editIdeaBtn = $(event.currentTarget).siblings('.editIdeaBtn')[0],
                message = $(ideaTextEl).html(),
                oldMessage = $(ideaTextEl).attr('oldContent'),
                me = this;

            $(ideaTextEl).attr('contentEditable',false).removeClass('editing');
            message = $.trim(message).replace(/<hr>/, "\n---------------\n").replace(/&nbsp;/, ' ');
            if (message == '') {
                me.showEmptyError();
            }
            else {
                IdeaBoardz.WebIdeaBoardz.instance.editIdea(event.currentTarget.id, oldMessage, message, {
                    success: me.showSuccess,
                    error: me.showError,
                    context: "this"
                });
            }
            $(el).hide();
            $(editIdeaBtn).show();
            clearTimeout(IdeaBoardz.Board.instance.timer);
            IdeaBoardz.Board.instance.timer = setTimeout(function(){me.pollForIdeas()}, 10000);
            return false;
        },

        makeStickyEditable: function(event){
            event.preventDefault();
            event.stopPropagation();
            var el = $(event.currentTarget)[0],
                ideaTextEl = $(event.currentTarget).siblings()[0],
                okBtn = $(event.currentTarget).siblings('.okBtn')[0],
                me = this;
            $(ideaTextEl).addClass('editing');
          var message = $(ideaTextEl).html().replace(/<hr>/, "\n---------------\n");
          $(ideaTextEl).attr('contentEditable',true).attr('oldContent', message).focus();
            clearTimeout(IdeaBoardz.Board.instance.timer);
            $(el).hide();
            $(okBtn).show();
            $(okBtn).css({display: 'inline-block'});
            $(okBtn).children().css({display: 'inline-block'});
            return false
        },

        showError: function(event){
            $(this.el).find("#alert-area").html($("<div id=‘error-msg’ align='center'  class='alert alert-error'>Failed to submit. Please try again in some time.</div>"));
        },

        showEmptyError: function(event){
            $(this.el).find("#alert-area").html($("<div id=‘empty-msg’ align='center' class='alert alert-error'>Please enter some text.</div>"));
        },

        showSuccess: function(event){
            $(this.el).find("#alert-area").html($("<div id=‘success-msg’ align='center'  class='alert alert-success'>Your idea has been Updated.</div>"));
            $(this.el).find("#ideaText").val("");
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
            var currentView = this;
            IdeaBoardz.WebIdeaBoardz.instance.getIdeas(this.board.id, this.board.name,{
                success: function(data){
                    IdeaBoardz.Board.instance.ideas = data;
                    IdeaBoardz.dispatcher.trigger("change:ideasData");
                    IdeaBoardz.Board.instance.timer = setTimeout(function(){currentView.pollForIdeas()}, 10000);
                },
                error: function(){
                    IdeaBoardz.dispatcher.trigger("error:ideasData");
                }
            });
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
                stickyHtml += this.ideaTemplate({
                    ideaText:idea.message.replace(/\n-{3,}\n/g,'<hr/>'),
                    vote_count:idea.votes_count,
                    section_id: this.sectionId,
                    point_id: idea.id
                });
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
            var errorMsg = "<h4>Problem retrieving ideas.</h4> Please check your URL or section id. Or just try refreshing the page.";
            $(this.el).find(this.container).html(
                '<div id="alert-area" class="alert alert-error alert-main">'+ errorMsg +'</div>'
            );
        }
    });
});
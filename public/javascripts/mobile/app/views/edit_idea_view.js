$(document).ready(function() {
    IdeaBoardz.EditIdeaView = Backbone.View.extend({
        el: $("#viewWrapper"),
        template: _.template($("#template-newIdea").html()),
        container: null,
        board: null,
        pointId: null,
        sectionId: null,

        initialize: function(container, boardName, boardId,sectionId, pointId) {
            this.container = container;
            this.resetBinding();
            this.pointId = pointId;
            this.sectionId= sectionId;
            var createViewHelper = new IdeaBoardz.ViewHelper(this, this.render);
            createViewHelper.getBoardForCurrentView(boardName, boardId);
        },

        render: function(){
            this.renderBaseTemplate();
            this.renderSectionListInDropdown();
            this.renderOldIdea();
        },

        renderOldIdea: function(){
            var ideas = this.board.ideas;
            for(var index = 0,len=ideas.length;index<len;index++){
                if(ideas[index].id == this.pointId){
                    $(this.el).find("#ideaText").text(ideas[index].message);
                    return false;
                }
            }
        },

        renderBaseTemplate: function(){
            var html = this.template({ boardName: this.board.name});
            $(this.el).find(this.container).html(html);  // Append the result to the view's element.
            $(this.el).find('#submitBtn').attr('id','editIdeaBtn').text('Update Idea');
            $(this.el).find('#menu').removeClass('navbar-fixed-top');
            $(this.el).find('.mib_content').addClass('content-pull-up');
        },

        renderSectionListInDropdown: function(){
            var sections = this.board.sections;
            for (var i in sections) {
                if(this.sectionId == sections[i].id){
                    $(this.el).find("#sectionId").append('<option value='+ sections[i].id +' >' + sections[i].name+'</option>');
                    break;
                }
            }

            $(this.el).find("#ideaText").focus();
        },

        // EVENTS SPECIFIC METHODS

        events: {
            "click #editIdeaBtn": "updateIdea"
        },

        resetBinding:function(){
            $(this.el).undelegate('#editIdeaBtn', 'click');
        },

        updateIdea: function(event){
            var message = $(this.el).find("#ideaText").val();
            message = $.trim(message);

            if (message == '') {
                this.showEmptyError();
            }
            else {
                IdeaBoardz.WebIdeaBoardz.instance.editIdea(this.pointId, message, {
                    success: this.showSuccess,
                    error: this.showError,
                    context: this
                });
            }
            $(this.el).find("#ideaText").focus();
            return false;
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

        toString: function(){
            return "A EditIdeaView";
        }
    });
});
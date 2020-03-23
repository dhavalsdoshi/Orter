var IdeaBoardz = $.extend({}, IdeaBoardz || {});
$(document).ready(function() {
    IdeaBoardz.CreateIdeaView = Backbone.View.extend({
        el: $("#viewWrapper"),
        template: _.template($("#template-newIdea").html()),
        container: null,
        board: null,

        initialize: function(container, boardName, boardId) {
            this.container = container;
            this.resetBinding();

            var createViewHelper = new IdeaBoardz.ViewHelper(this, this.render);
            createViewHelper.getBoardForCurrentView(boardName, boardId);
        },

        render: function(){
            this.renderBaseTemplate();
            this.renderSectionListInDropdown();
        },

        renderBaseTemplate: function(){
            var html = this.template({ boardName: this.board.name});
            $(this.el).find(this.container).html(html);  // Append the result to the view's element.
            $(this.el).find('#menu').removeClass('navbar-fixed-top');
            $(this.el).find('.mib_content').addClass('content-pull-up');
        },

        renderSectionListInDropdown: function(){
            var sections = this.board.sections;
            for (var i in sections) {

                $(this.el).find("#sectionId").append('<option value='+ sections[i].id +' >' + sections[i].name+'</option>');
            }

            $(this.el).find("#ideaText").focus();
        },

        // EVENTS SPECIFIC METHODS

        events: {
            "click #submitBtn": "submitIdea",
            "click #createIdeaBtn": "render"
        },

        resetBinding:function(){
            $(this.el).undelegate('#submitBtn', 'click');
        },

        submitIdea: function (event) {
            var message = $(this.el).find("#ideaText").val();
            message = $.trim(message);
            var sectionId = $(this.el).find("#sectionId").val();
            var retroId = this.board.id;
            var retroName = this.board.name;
            if (message == '') {
                this.showEmptyError();
            } else {
                IdeaBoardz.WebIdeaBoardz.instance.createIdea(sectionId, message, retroId, retroName, {
                    success: this.showSuccess,
                    error: this.showError,
                    context: this
                });
            }
            $(this.el).find("#ideaText").focus();
            return false;
        },

        showSuccess: function(event){
            $(this.el).find("#alert-area").html($("<div id=‘success-msg’ align='center'  class='alert alert-success'>Your idea has been posted.</div>"));
            $(this.el).find("#ideaText").val("");
        },

        showError: function(event){
            $(this.el).find("#alert-area").html($("<div id=‘error-msg’ align='center'  class='alert alert-error'>Failed to submit. Please try again in some time.</div>"));
        },

        showEmptyError: function(event){
            $(this.el).find("#alert-area").html($("<div id=‘empty-msg’ align='center' class='alert alert-error'>Please enter some text.</div>"));
        },

        toString: function(){
            return "A CreateIdeaView";
        }
    });
});

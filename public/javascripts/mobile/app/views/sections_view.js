$(document).ready(function () {

    IdeaBoardz.SectionsView = Backbone.View.extend({
        el:$('#viewWrapper'),
        template:_.template($('#template-sectionsView').html()),
        sectionTemplate:_.template($('#template-sectionItem').html()),
        container:null,
        board:null,

        initialize: function(container, boardName, boardId) {
            this.container = container;
            var sectionsViewHelper = new IdeaBoardz.ViewHelper(this, this.render);
            sectionsViewHelper.getBoardForCurrentView(boardName, boardId);
        },

        render: function(){
            this.renderBaseTemplate();
            this.renderSectionsList();
        },

        renderBaseTemplate: function(){
            var html = this.template({ boardName: this.board.name});
            $(this.el).find(this.container).html(html);  // Append the result to the view's element.
        },

        renderSectionsList: function(){
            var sections = this.board.sections;
            var sectionListHtml = "";

            for (i = 0; i < sections.length; i++) {
                sectionListHtml += this.sectionTemplate({
                    sectionName:sections[i].name,
                    sectionId:sections[i].id,
                    boardName:this.board.name,
                    boardId:this.board.id
                });
            }

            $(this.container).find('#sectionsList').html(sectionListHtml);
        }
    });
});
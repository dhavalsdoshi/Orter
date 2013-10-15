
var IdeaBoardz = $.extend({}, IdeaBoardz || {});

$(document).ready(function () {
    IdeaBoardz.ErrorView = Backbone.View.extend({
        el:$("#viewWrapper"),
        template:_.template($("#template-errorView").html()),

        initialize:function () {
            if (IdeaBoardz.Board.instance){
                clearTimeout(IdeaBoardz.Board.instance.timer);
            }
            this.render();
        },

        render:function () {
            $(this.el).find('#boardName').html('').hide();
            $(this.el).find("#navigation").empty();
            $(this.el).find("#container").html(this.template());
        }
    });
});


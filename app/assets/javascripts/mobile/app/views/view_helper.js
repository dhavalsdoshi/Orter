var IdeaBoardz = $.extend({}, IdeaBoardz || {});
// Initialize Global Dispatcher
IdeaBoardz.dispatcher = _.clone(Backbone.Events);

IdeaBoardz.ViewHelper = function(currentView, renderBoardCallback) {
    this.currentView = currentView;
    this.renderBoardCallback = renderBoardCallback;
};

IdeaBoardz.ViewHelper.prototype = {
    navigationTemplate: _.template($("#template-navigation").html()),

    getBoardForCurrentView: function(boardName, boardId){
        var board = IdeaBoardz.Board.instance;

        if(board === undefined || board.name != boardName || board.id != boardId) {
            IdeaBoardz.Board.instance = null;
            this.renderPlaceHolder();
            this.requestBoardData(boardName, boardId);
        } else {
            clearTimeout(IdeaBoardz.Board.instance.timer);
            this.renderView();
        }
    },

    requestBoardData: function(boardName, boardId){
        this.startListeningToGetBoardEvents();
        IdeaBoardz.WebIdeaBoardz.instance.getBoard(boardName, boardId, {
            success: function(data){
                IdeaBoardz.dispatcher.trigger('success:boardData', data);
            },
            error: function(message){
                IdeaBoardz.dispatcher.trigger('error:boardData');
            }
        });
    },

    renderPlaceHolder:function () {
        $(this.currentView.el).find(this.currentView.container).html('<h2 class="loading">Retrieving Board Data</h2>');
    },

    renderBoardErrorNotice: function() {
        this.stopListeningToGetBoardEvents();
        $(this.currentView.el).find('#boardName').html('').hide();
        var errorMsg = "<h4>No such board exists.</h4>The provided board URL is invalid.<br/> Please check the URL again.";
        $(this.currentView.el).find(this.currentView.container).html(
            '<div id="alert-area" class="alert alert-error alert-main">'+ errorMsg +'</div>'
        );
    },

    updateViewWithReturnedBoardData: function(data){
        this.stopListeningToGetBoardEvents();
        IdeaBoardz.Board.instance = new IdeaBoardz.Board(data.name, data.id, data.sections);
        this.renderView();
    },

    renderView:function(){
        this.currentView.board = IdeaBoardz.Board.instance;
        this.customizeMenuLinks();
        this.renderBoardCallback.call(this.currentView);
    },

    makeMenuBarNotFixedToTop:function () {
        $(this.currentView.el).find('#menu').addClass('navbar-fixed-top');
        $(this.currentView.el).find('.mib_content').removeClass('content-pull-up');
    },

    makeMenuBarFixedToTop:function () {
        $(this.currentView.el).find('#menu').removeClass('navbar-fixed-top');
        $(this.currentView.el).find('.mib_content').addClass('content-pull-up');
    },

    customizeMenuLinks:function () {
        var board = this.currentView.board;
        $(this.currentView.el).find("#navigation").html(
            this.navigationTemplate({
                boardName:board.name,
                boardId:board.id//,
//                commentCount:0
            })
        );

        var hideMenu = function(e){
          $("#navigation").hide();
        };

        var handleMenu = function(e){
          $('#navigation').toggle();
          $('#menu_overlay_container').toggle();
        };

        $(this.currentView.el).find("#navigation li").on('click',hideMenu);
        $(this.currentView.el).find("#menu-options #main-menu a").off('click').on('click', handleMenu);
        $(this.currentView.el).find("#menu-options li.hide-menu").off('click').on('click', hideMenu);

        $('#menu_overlay_container').off('click').on('click',function(){
          $("#navigation").toggle();
          $(this).toggle();
        });

        // make the top menu bar fixed to top for all views except createIdea & Comments

        if (typeof this.currentView != IdeaBoardz.CreateIdeaView || typeof this.currentView != IdeaBoardz.CreateCommentsView) {
            this.makeMenuBarNotFixedToTop();
        } else {
            this.makeMenuBarFixedToTop();
        }

        var boardNameURL = '<a href="#">'+board.name+'</a>';
        $(this.currentView.el).find('#boardName').html(boardNameURL);
        $(this.currentView.el).find('#boardName').show();

    },

    startListeningToGetBoardEvents: function(){
        IdeaBoardz.dispatcher.on('success:boardData', this.updateViewWithReturnedBoardData, this);
        IdeaBoardz.dispatcher.on('error:boardData', this.renderBoardErrorNotice, this);
    },

    stopListeningToGetBoardEvents: function(){
        IdeaBoardz.dispatcher.off('success:boardData', this.updateViewWithReturnedBoardData, this);
        IdeaBoardz.dispatcher.off('error:boardData', this.renderBoardErrorNotice, this);
    },
    renderSectionListInDropdown: function(currentView){
        var sections = currentView.board.sections;
        for (var i in sections) {

            $(currentView.el).find("#sectionId").append('<option value='+ sections[i].id +' >' + sections[i].name+'</option>');
        }

        $(currentView.el).find("#ideaText").focus();
    }
};

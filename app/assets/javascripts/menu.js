$(".removeBoardFromFav").on("click", function () {
  var boardName  = this.getAttribute("data-board-name"),
      boardId = this.getAttribute("data-board-id"),
      element =  this;
  $a.trackEvent('board', 'delete', boardId);
  if (confirm("Are you sure you want to delete " + boardName + " from favorite boards?")) {
    $.ajax({
      url: "/retros/" + boardId + "/remove_from_my_board.json",
      type: "POST",
      success: function () {
        element.closest('li').remove()
      },
      xhrFields: {
        withCredentials: true
      },
      error: function () {
        alert("Not able to remove the Board. Please try again. ")
      }
    });
  }
});

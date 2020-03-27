App.messages = App.cable.subscriptions.create({
  channel: 'UpdatesChannel',
  retro_id: $('meta[name="retroId"]').attr('content'),
  retro_name: $('meta[name="retroName"]').attr('content')},
  { received: function(data) {
    $(document).trigger("go_fetch");
    },
    disconnected: function(data){
      showSnackbar()
    },
    connected: function(data){
      hideSnackbar();
     $(document).trigger("go_fetch");
    }
  });


function showSnackbar(){
  var snackbarElement = document.getElementById("snackbar");

  snackbarElement.className = "show";
}

function hideSnackbar(){
  var snackbarElement = document.getElementById("snackbar");

  snackbarElement.className = snackbarElement.className.replace("show","");
}
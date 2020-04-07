App.messages = App.cable.subscriptions.create({
  channel: 'UpdatesChannel',
  retro_id: $('meta[name="retroId"]').attr('content'),
  retro_name: $('meta[name="retroName"]').attr('content')
},
  {
    initialized() {
      this.update = this.update.bind(this)
    },
    connected() {
      console.log("Socket Connected")
      hideSnackbar();
      this.update();
    },
    disconnected() {
      console.log("Socket Disconnected")
      showSnackbar()
    },
    update() {
        $(document).trigger("go_fetch")
    },
    received() {
      this.update()
    },
    get documentIsActive() {
      console.log(document.visibilityState)
      return document.visibilityState == "visible"
    }
  });

  document.addEventListener('visibilitychange', function () {
     if(document.hidden){
      App.cable.disconnect()
     } else {
      App.cable.connect()
     };
  });

function showSnackbar() {
  var snackbarElement = document.getElementById("snackbar");

  snackbarElement.className = "show";
}

function hideSnackbar() {
  var snackbarElement = document.getElementById("snackbar");

  snackbarElement.className = snackbarElement.className.replace("show", "");
}
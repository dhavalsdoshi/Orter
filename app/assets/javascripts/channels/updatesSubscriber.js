App.messages = App.cable.subscriptions.create({
  channel: 'UpdatesChannel',
  retro_id: $('meta[name="retroId"]').attr('content'),
  retro_name: $('meta[name="retroName"]').attr('content')},
  { received: function(data) {
    $(document).trigger("go_fetch");
  },
});
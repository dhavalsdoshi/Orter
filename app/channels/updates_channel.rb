class UpdatesChannel< ApplicationCable::Channel
  def subscribed
    stream_from "updates_#{params['retro_id']}_channel"
  end

  def unsubscribed

  end
end
class UpdateBroadcastJob < ApplicationJob
  queue_as :low_priority

  def perform(retro)
    ActionCable.server.broadcast "updates_#{retro.id}_channel", message: "There is a change in the Points table"
  end
end
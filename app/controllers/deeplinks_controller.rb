class DeeplinksController < ApplicationController
  def index
    parameters = RetroDeepLink.decode(params[:id])
    @retrospective_id = parameters[:retro_id]
    @participant_code = parameters[:participant_code]
  end
end

class DeeplinksController < ApplicationController
  def index
    @retrospective_id = Retro.find_by_name(params[:name]).id
  end
end

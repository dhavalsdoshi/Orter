class DeeplinksController < ApplicationController
  def index
    @retrospective_id = params[:id]
  end
end
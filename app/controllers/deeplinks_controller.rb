class DeeplinksController < ApplicationController
  def index_old
    @retrospective_id = Retro.find_by_name(params[:name]).id
	render :action => :index
  end
  
  def index
    @retrospective_id = Retro.find(params[:id]).id
  end
end

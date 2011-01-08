class DeeplinksController < ApplicationController

  def index_old
    @retrospective = Retro.find_by_name(params[:name], :include => :sections)
	render :action => :index
  end

  def index
    @retrospective = Retro.find_by_id_and_name(params[:id],params[:name], :include => :sections)
    render :action => :index
  end

end

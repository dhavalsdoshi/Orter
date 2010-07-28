class DeeplinksController < ApplicationController

  def index_old
    @retrospective = Retro.find_by_name(params[:name], :include => :sections)
	render :action => :index
  end

  def index
    @retrospective = Retro.find(params[:id], :include => :sections)
    render :action => :index
  end

end

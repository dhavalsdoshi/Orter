class DeeplinksController < ApplicationController
  def index_old
    @retrospective_id = Retro.find_by_name(params[:name]).id
	render :action => :index
  end
  
  def index
    @retrospective_id = Retro.find(params[:id]).id
  end

  def index_old_html
    @retrospective_id = Retro.find_by_name(params[:name]).id
	render :action => :index_html
  end

  def index_html
    @retrospective_id = Retro.find(params[:id]).id
    render :action => :index_html
  end

end

class SectionsController < ApplicationController      
  before_filter :load_retro

  def load_retro
    @retro = Retro.find(params[:retro_id]) unless params[:retro_id].nil?
    @retro = @retro || Section.find(params[:id]).retro
  end

  def index
    @sections = @retro.sections.find(:all)

    respond_to do |format|
  	  format.json  { render :json => @sections.to_json }
    end
  end

  def show
    @section = @retro.sections.find(params[:id])

    respond_to do |format|
	    format.json  { render :json => @section.to_json }
    end
  end

  def create
    @section = @retro.sections.build(params[:section])

    respond_to do |format|
      if @section.save
        flash[:notice] = 'Section was successfully created.'
    		format.json  { render :json => @section.to_json, :status => :created, :location => @section.to_json }
      else
		    format.json  { render :json => @section.to_json, :status => :unprocessable_entity, :location => @section.to_json }
      end
    end
  end
end

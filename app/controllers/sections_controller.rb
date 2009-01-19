class SectionsController < ApplicationController      
  before_filter :load_retro

  def load_retro
    @retro = Retro.find(params[:retro_id]) unless params[:retro_id].nil?
    @retro = @retro || Section.find(params[:id]).retro
  end

  def index
    @sections = @retro.sections.find(:all)

    respond_to do |format|
      format.xml  { render :xml => @sections }
    end
  end

  def show
    @section = @retro.sections.find(params[:id])

    respond_to do |format|
      format.xml  { render :xml => @section }
    end
  end

  def create
    @section = @retro.sections.build(params[:section])

    respond_to do |format|
      if @section.save
        flash[:notice] = 'Section was successfully created.'
        format.xml  { render :xml => @section, :status => :created, :location => @section }
      else
        format.xml  { render :xml => @section.errors, :status => :unprocessable_entity }
      end
    end
  end
end

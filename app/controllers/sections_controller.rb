class SectionsController < ApplicationController      
  before_filter :load_retro

  def load_retro
    @retro = Retro.find(params[:retro_id]) unless params[:retro_id].nil?
    @retro = @retro || Section.find(params[:id]).retro
  end
  
  def index
    @sections = @retro.sections.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @sections }
    end
  end

  def show
    @section = @retro.sections.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @section }
    end
  end

  def new
    @section = @retro.sections.build

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @section }
    end
  end

  def edit
    @section = @retro.sections.find(params[:id])
  end

  def create
    @section = @retro.sections.build(params[:section])

    respond_to do |format|
      if @section.save
        flash[:notice] = 'Section was successfully created.'
        format.html { redirect_to([@retro, @section]) }
        format.xml  { render :xml => @section, :status => :created, :location => @section }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @section.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @section = @retro.sections.find(params[:id])

    respond_to do |format|
      if @section.update_attributes(params[:section])
        flash[:notice] = 'Section was successfully updated.'
        format.html { redirect_to([@retro, @section]) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @section.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @section = @retro.sections.find(params[:id])
    @section.destroy

    respond_to do |format|
      format.html { redirect_to(retro_sections_url) }
      format.xml  { head :ok }
    end
  end
end

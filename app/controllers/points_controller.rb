class PointsController < ApplicationController
  before_filter :load_section

  def load_section
    @section = Section.find(params[:section_id])
  end

  def index
    @points = @section.points.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @points }
    end
  end

  def show
    @point = @section.points.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @point }
    end
  end

  def new
    @point = @section.points.build

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @point }
    end
  end

  def edit
    @point = @section.points.find(params[:id])
  end

  def create
    @point = @section.points.build(params[:point])

    respond_to do |format|
      if @point.save
        flash[:notice] = 'Point was successfully created.'
        format.html { redirect_to([@section, @point]) }
        format.xml  { render :xml => @point, :status => :created, :location => @point }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @point.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update
    @point = @section.points.find(params[:id])

    respond_to do |format|
      if @point.update_attributes(params[:point])
        flash[:notice] = 'Point was successfully updated.'
        format.html { redirect_to([@section, @point]) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @point.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @point = @section.points.find(params[:id])
    @point.destroy

    respond_to do |format|
      format.html { redirect_to(section_points_url) }
      format.xml  { head :ok }
    end
  end
end

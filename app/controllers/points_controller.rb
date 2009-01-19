class PointsController < ApplicationController
  before_filter :load_section, :except => [:update]

  def load_section
    @section = Section.find(params[:section_id])
  end

  def index
    @points = @section.points.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @points.to_xml(:include => :votes)}
    end
  end

  def point_url(point)
    return point.to_s
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
  def destroy
     @point = @section.points.find(params[:id])
     @point.destroy

     respond_to do |format|
       format.html { redirect_to(section_points_url) }
       format.xml  { head :ok }
     end
   end
end

class PointsController < ApplicationController
  before_filter :load_section, :except => [:update]

  def load_section
    @section = Section.find(params[:section_id])
  end

  def index
    @points = @section.points.find(:all)
    respond_to do |format|
      format.xml  { render :xml =>  @points.to_xml(:include => :votes)}
	  format.json  { render :json =>  @points.to_json(:include => :votes)}
    end
  end

  def point_url(point)
    return point.to_s
  end
  
  def create
    point = params[:point]
    point[:message] = CGI.escapeHTML(point[:message])
    @point = @section.points.build(point)

    respond_to do |format|
		
      if @point.save
        flash[:notice] = 'Point was successfully created.'
        LOGGER.info("POINT: {#{@point.message}} created in SECTION: {#{@section.name}}")

        format.xml  { render :xml => @point, :status => :created, :location => @point }
		format.json  { render :json => @point.to_json, :status => :created, :location => @point.to_json }
		
      else
        format.xml  { render :xml => @point.errors, :status => :unprocessable_entity }
		format.json  { render :json => @point.errors.to_json, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
     @point = @section.points.find(params[:id])
     @point.destroy

     LOGGER.info("POINT: {#{@point.message}} deleted from SECTION: {#{@section.name}}")

     respond_to do |format|
       format.xml  { head :ok }
       format.json  { head :ok }
     end
   end
end

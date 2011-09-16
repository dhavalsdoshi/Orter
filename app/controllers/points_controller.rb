class PointsController < ApplicationController

  def index
    section = Section.find(params[:section_id])
    points = section.points
    respond_to do |format|
      format.xml { render :xml => points.to_xml(:include => :votes) }
      format.json { render :json => points.to_json(:include => :votes) }
    end
  end

  def create
    point_params = params[:point]
    point_params[:message] = CGI.escapeHTML(point_params[:message])
    point = Point.new(point_params)

    respond_to do |format|
      if point.save
        flash[:notice] = 'Point was successfully created.'
        LOGGER.info("POINT: {#{point.message}} created in SECTION: {#{point.section.name}}")

        format.xml { render :xml => point, :status => :created, :location => point }
        format.json { render :json => point.to_json, :status => :created, :location => point.to_json }
      else
        format.xml { render :xml => point.errors, :status => :unprocessable_entity }
        format.json { render :json => point.errors.to_json, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
     point = Point.find(params[:id])
     point.destroy

     LOGGER.info("POINT: {#{point.message}} deleted from SECTION: {#{point.section.name}}")

     respond_to do |format|
       format.xml  { head :ok }
       format.json  { head :ok }
     end
   end
end

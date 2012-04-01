class PointsController < ApplicationController

  def index_for_retro
    points = Retro.find(params[:retro_id]).points
    respond_to do |format|
      format.json { render :json => points.to_json(:methods => [:votes_count, :tag_list]) }
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

        format.json { render :json => point.to_json(:methods => :votes_count), :status => :created, :location => point.to_json }
      else
        format.json { render :json => point.errors.to_json, :status => :unprocessable_entity }
      end
    end
  end

  def tag
    point_ids = params[:point_ids].split(",")
    points = Point.find(:all, :conditions => {:id => point_ids} )
    points.each { |p|
      p.tag_list = params[:tag]
      p.save
    }
    head :created
  end

  def update
    point = Point.find(params[:id])
    if point.update_attributes(params[:point])
      head :ok
    else
      render :json => point.errors.to_json, :status => :unprocessable_entity
    end
  end

  def destroy
     point = Point.destroy(params[:id])
     LOGGER.info("POINT: {#{point.message}} deleted from SECTION: {#{point.section.name}}")
     respond_to do |format|
       format.json  { head :ok }
     end
   end
end

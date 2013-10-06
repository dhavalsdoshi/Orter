class PointsController < ApplicationController

  def index_for_retro
    points = Retro.find_by_id_and_name(params[:retro_id], params[:retro_name]).points
    #points = Retro.find(params[:retro_id]).points
    respond_to do |format|
      format.json { render :json => points.to_json(:methods => :votes_count) }
    end
  end

  def create
    point_params = params[:point]
    point_params[:message] = CGI.escapeHTML(point_params[:message])
    point = Point.new(point_params)

    respond_to do |format|
      if point.save
        flash[:notice] = 'Point was successfully created.'
        format.json { render :json => point.to_json(:methods => :votes_count), :status => :created, :location => point.to_json }
      else
        format.json { render :json => point.errors.to_json, :status => :unprocessable_entity }
      end
    end
  end

  def update
    #point = Point.find(params[:id])
    point = Point.find_by_id_and_message(params[:id], params[:point][:oldmessage])
    points_params = params[:point]
    points_params.delete(:oldmessage)
    #point_params = params[:point]
    #point_params[:message] = CGI.escapeHTML(point_params[:message])
    if point.update_attributes(params[:point])
      head :ok
    else
      render :json => point.errors.to_json, :status => :unprocessable_entity
    end
  end

  def destroy
    point = Point.find_by_id_and_message(params[:id], params[:message])
    return head :error if point.nil?
    point.destroy
    respond_to do |format|
      format.json { head :ok }
    end
  end

  #def destroy
  #   point = Point.destroy(params[:id])
  #   respond_to do |format|
  #     format.json  { head :ok }
  #   end
  # end
end

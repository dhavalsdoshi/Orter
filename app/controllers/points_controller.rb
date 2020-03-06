class PointsController < ApplicationController

  def index_for_retro
    respond_to do |format|
      format.json { render :json => points_json(params) }
    end
  end

  def create
    if validate_retro_id
      if point_params[:message] = CGI.escapeHTML(point_params[:message])
        point = Point.new(point_params)
        respond_to do |format|
          if point.save
            flash[:notice] = 'Point was successfully created.'
            delete_cache_for(point)
            format.json { render :json => point.to_json(:methods => :votes_count), :status => :created, :location => point }
          else
            format.json { render :json => point.errors, :status => :unprocessable_entity }
          end
        end
      end
    else
      respond_to do |format|
        format.json { render :json => "Section Id and " , :status => :unprocessable_entity }
      end
    end
  end

  def update
    #point = Point.find(params[:id])
    point = Point.find_by_id_and_message(params[:id], params[:point][:oldmessage])
    params[:point].delete(:oldmessage)
    #point_params = params[:point]
    #point_params[:message] = CGI.escapeHTML(point_params[:message])
    if point.update_attributes(point_params)
      delete_cache_for(point)
      head :ok
    else
      render :json => point.errors.to_json, :status => :unprocessable_entity
    end
  end

  def destroy
    point = Point.find_by_id_and_message(params[:id], params[:message])
    return head :error if point.nil?
    point.destroy
    delete_cache_for(point)
    respond_to do |format|
      format.json { head :ok }
    end
  end


  private

  def delete_cache_for(point)
    Rails.cache.delete("retro_#{point.section.retro.name}_#{point.section.retro.id}")
  end

  def points_json(params)
    retro_id = params[:retro_id]
    retro_name = params[:retro_name]
    Rails.cache.fetch("retro_#{retro_name}_#{retro_id}", expires_in: 10.minutes) do
      points = Retro.find_by_id_and_name(retro_id, retro_name).points
      #points = Retro.find(params[:retro_id]).points
      points.to_json(:methods => :votes_count)
    end
  end

  def point_params
    params.require(:point).permit(:section_id, :message)
  end

  def validate_retro_id
    if Section.find(point_params[:section_id].to_i).retro_id == params[:board_id].to_i
      return true
    end
    false
  end

  #def destroy
  #   point = Point.destroy(params[:id])
  #   respond_to do |format|
  #     format.json  { head :ok }
  #   end
  # end
end

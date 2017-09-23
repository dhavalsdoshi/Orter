class AdminController < ApplicationController

  def deleted_points
    if params[:retro_id].present?
      retro = Retro.where(id: params[:retro_id], name: params[:retro_name]).includes(:sections).take
      @points = []
      retro.sections.each do |s|
        @points.concat(Point::Deleted.where(section_id: s.id).all)
      end
    end
  end

  def restore_deleted
    point = Point::Deleted.find(params[:point_id])
	  point.undestroy!
	  redirect_to :action => :deleted_points
  end
  
end

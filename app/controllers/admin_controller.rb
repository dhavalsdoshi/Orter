class AdminController < ApplicationController

  def deleted_points
    retro = Retro.find_by_name(params[:retro_id]) unless params[:retro_id].nil?
	@points = []
	retro.sections.each do |s| 
		@points.push Point::Deleted.find_by_section_id(s.id) 
	end
  end

  def restore_deleted
    point = Point::Deleted.find(params[:point_id])
	p point
	point.undestroy!
	redirect_to :action => :deleted_points
  end
  
end

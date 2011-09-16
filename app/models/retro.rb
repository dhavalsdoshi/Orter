class Retro < ActiveRecord::Base
  has_many :sections

  def all_points
    points = []
    sections.each{|section| points.concat(section.points)}
    points
  end
end
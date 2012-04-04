class Retro < ActiveRecord::Base
  has_many :sections
  has_many :points, :through => :sections, :include => :tags
end

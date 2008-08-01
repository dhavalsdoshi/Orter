class Section < ActiveRecord::Base
  belongs_to :retro
  has_many :points
end

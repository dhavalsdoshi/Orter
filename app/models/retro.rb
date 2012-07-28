class Retro < ActiveRecord::Base
  has_many :sections
  has_many :points, :through => :sections
  has_and_belongs_to_many :users
end

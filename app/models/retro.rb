class Retro < ActiveRecord::Base
  has_many :sections
  has_many :participants
end

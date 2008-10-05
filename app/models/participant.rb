class Participant < ActiveRecord::Base
  belongs_to :retro
  has_many :votes
end

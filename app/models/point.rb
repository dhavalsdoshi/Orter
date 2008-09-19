class Point < ActiveRecord::Base
  belongs_to :section
  has_many :votes
end

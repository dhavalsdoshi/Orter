class Point < ActiveRecord::Base
  acts_as_soft_deletable
  
  belongs_to :section
end

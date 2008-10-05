class Vote < ActiveRecord::Base
  belongs_to :point
  belongs_to :participant
end

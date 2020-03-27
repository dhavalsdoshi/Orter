class Vote < ActiveRecord::Base
  belongs_to :point
  after_commit { UpdateBroadcastJob.perform_later(self.point.section.retro) }
end
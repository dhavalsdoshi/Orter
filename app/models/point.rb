class Point < ActiveRecord::Base
  acts_as_soft_deletable

  belongs_to :section
  has_many :votes

  after_commit :schedule_broadcast

  def schedule_broadcast
    UpdateBroadcastJob.perform_later(self.section.retro)
  end

  def votes_count
    votes.count
  end
end

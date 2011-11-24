class Point < ActiveRecord::Base
  acts_as_soft_deletable

  belongs_to :section
  has_many :votes

  def votes_count
    votes.count
  end
end

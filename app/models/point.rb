class Point < ActiveRecord::Base
  acts_as_soft_deletable

  belongs_to :section
  has_many :up_votes
  has_many :down_votes
  has_many :votes

  def votes_count
    votes.count
  end

  def up_votes_count
    up_votes.count
  end

  def down_votes_count
    down_votes.count
  end
end

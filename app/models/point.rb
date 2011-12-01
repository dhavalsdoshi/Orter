class Point < ActiveRecord::Base
  acts_as_soft_deletable
  acts_as_taggable

  belongs_to :section
  has_many :votes

  def votes_count
    votes.count
  end
end

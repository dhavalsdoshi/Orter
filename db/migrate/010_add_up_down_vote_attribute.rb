class AddUpDownVoteAttribute < ActiveRecord::Migration
  def self.up
    add_column :votes, :type, :string, :default => "UpVote"
  end

  def self.down
    remove_column :votes, :vote_type
  end
end


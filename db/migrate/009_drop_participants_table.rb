class DropParticipantsTable < ActiveRecord::Migration
  def self.up
    remove_column :votes, :participant_id
    drop_table :participants
  end
end

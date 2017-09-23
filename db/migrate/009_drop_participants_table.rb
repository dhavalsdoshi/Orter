class DropParticipantsTable < ActiveRecord::Migration[5.1]
  def self.up
    remove_column :votes, :participant_id
    drop_table :participants
  end
end

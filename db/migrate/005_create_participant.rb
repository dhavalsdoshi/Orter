class CreateParticipant < ActiveRecord::Migration
  def self.up
    create_table :participants do |t|
      t.references :retro
      t.string :email
      t.timestamps
    end
    
    change_table :votes do |v|
      v.references :participant
    end
  end

  def self.down
    remove_column :votes, :participant_id
    drop_table :participants
  end
end
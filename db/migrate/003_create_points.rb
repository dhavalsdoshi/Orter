class CreatePoints < ActiveRecord::Migration
  def self.up
    create_table :points do |t|
      t.references :section
      t.text :message

      t.timestamps
    end
  end

  def self.down
    drop_table :points
  end
end

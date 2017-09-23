class ActAsSoftDeletable < ActiveRecord::Migration[5.1]
  def self.up
    create_table :deleted_points do |t|
      t.references :section
      t.text :message

      t.timestamps
      t.datetime :deleted_at
    end
  end

  def self.down
    Point::Deleted.drop_table
  end
end
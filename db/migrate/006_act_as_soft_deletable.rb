class ActAsSoftDeletable < ActiveRecord::Migration
  def self.up
	Point::Deleted.create_table
  end

  def self.down
	Point::Deleted.drop_table
  end
end
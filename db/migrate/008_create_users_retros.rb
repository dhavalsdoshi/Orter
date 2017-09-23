class CreateUsersRetros < ActiveRecord::Migration[5.1]
  def self.up
    create_table :retros_users, :id => false do |t|
      t.integer :user_id
      t.integer :retro_id
    end
  end

  def self.down
    drop_table :users
  end
end

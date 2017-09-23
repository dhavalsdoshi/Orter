class CreateUsers < ActiveRecord::Migration[5.1]
  def self.up
    create_table :users do |t|
#      t.id
      t.string :provider
      t.string :uid
      t.string :name
      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end

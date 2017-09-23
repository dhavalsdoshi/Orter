class CreateRetros < ActiveRecord::Migration[5.1]
  def self.up
    create_table :retros do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
  end

  def self.down
    drop_table :retros
  end
end

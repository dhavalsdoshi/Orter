class CreateSections < ActiveRecord::Migration[5.1]
  def self.up
    create_table :sections do |t|
      t.references :retro
      t.string :name

      t.timestamps
    end
  end

  def self.down
    drop_table :sections
  end
end

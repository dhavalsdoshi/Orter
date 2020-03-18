class AddCreatedByToRetro < ActiveRecord::Migration[5.2]
  def change
    add_column :retros, :user_id, :integer
  end
end

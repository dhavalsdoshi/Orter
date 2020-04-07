class AddColumnTermsAcceptedVersionToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :retros, :terms_version_accepted , :string
  end
end

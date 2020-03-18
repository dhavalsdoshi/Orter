class Retro < ActiveRecord::Base
  has_many :sections
  has_many :points, :through => :sections
  belongs_to :created_by , class_name: "User" , foreign_key: "user_id" ,optional: true
  validates_format_of :name, without: /\./i, message: "You cannot include dot(.) in the Retro's Name."
  has_and_belongs_to_many :users
end

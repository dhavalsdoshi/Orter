require File.dirname(__FILE__) + '/../test_helper'

class PointsControllerTest < ActionController::TestCase

  def test_should_create_point
    assert_difference('Point.count') do
      post :create, :point => {:section_id => sections(:one).id }
    end
  end

  def test_should_destroy_point
    assert_difference('Point.count', -1) do
      points(:one).section = sections(:one)
      points(:one).save
      delete :destroy, :id => points(:one).id, :section_id => points(:one).section
    end
  end

  def test_should_add_tag_to_points
    point1 = Point.new(:message => "first")
    point1.save!
    point2 = Point.new(:message => "second")
    point2.save!
    post :tag , :tag => "abc", :point_ids => [point1.id, point2.id].join(',')
    assert_equal "abc", Point.find_by_message("first").tags.first.name
    assert_equal "abc", Point.find_by_message("second").tag_list.first
  end

end

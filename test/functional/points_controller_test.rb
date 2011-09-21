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
end

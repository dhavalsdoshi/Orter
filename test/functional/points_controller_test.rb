require File.dirname(__FILE__) + '/../test_helper'

class PointsControllerTest < ActionController::TestCase

  def test_should_create_point
    assert_difference('Point.count') do
      post :create, :point => {:section_id => sections(:one).id, :message => 'abc'}
    end
  end

end

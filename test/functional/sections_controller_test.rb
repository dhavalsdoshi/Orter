require File.dirname(__FILE__) + '/../test_helper'

class SectionsControllerTest < ActionController::TestCase
  def test_should_get_index
    get :index , :retro_id => retros(:one)
    assert_response :success
    assert_not_nil assigns(:sections)
  end

  def test_should_create_section
    assert_difference('Section.count') do
      post :create, :section => { },:retro_id => retros(:one)
    end
  end

  def test_should_show_section
    sections(:one).retro = retros(:one)
    sections(:one).save
    get :show, :id => sections(:one).id,:retro_id => retros(:one).id
    assert_response :success
  end
end

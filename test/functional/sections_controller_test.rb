require File.dirname(__FILE__) + '/../test_helper'

class SectionsControllerTest < ActionController::TestCase
  def test_should_get_index
    get :index
    assert_response :success
    assert_not_nil assigns(:sections)
  end

  def test_should_get_new
    get :new
    assert_response :success
  end

  def test_should_create_section
    assert_difference('Section.count') do
      post :create, :section => { }
    end

    assert_redirected_to section_path(assigns(:section))
  end

  def test_should_show_section
    get :show, :id => sections(:one).id
    assert_response :success
  end

  def test_should_get_edit
    get :edit, :id => sections(:one).id
    assert_response :success
  end

  def test_should_update_section
    put :update, :id => sections(:one).id, :section => { }
    assert_redirected_to section_path(assigns(:section))
  end

  def test_should_destroy_section
    assert_difference('Section.count', -1) do
      delete :destroy, :id => sections(:one).id
    end

    assert_redirected_to sections_path
  end
end

require File.dirname(__FILE__) + '/../test_helper'

class RetrosControllerTest < ActionController::TestCase
  def test_should_get_index
    get :index
    assert_response :success
    assert_not_nil assigns(:retros)
  end

  def test_should_get_new
    get :new
    assert_response :success
  end

  def test_should_create_retro
    assert_difference('Retro.count') do
      post :create, :retro => { }
    end

    assert_redirected_to retro_path(assigns(:retro))
  end

  def test_should_show_retro
    get :show, :id => retros(:one).id
    assert_response :success
  end

  def test_should_get_edit
    get :edit, :id => retros(:one).id
    assert_response :success
  end

  def test_should_update_retro
    put :update, :id => retros(:one).id, :retro => { }
    assert_redirected_to retro_path(assigns(:retro))
  end

  def test_should_destroy_retro
    assert_difference('Retro.count', -1) do
      delete :destroy, :id => retros(:one).id
    end

    assert_redirected_to retros_path
  end
end

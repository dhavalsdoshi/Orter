require File.dirname(__FILE__) + '/../test_helper'

class RetrosControllerTest < ActionController::TestCase
  def test_should_create_retro
    assert_difference('Retro.count') do
      post :create, :retro => { :name => 'a retro', :sections => {:section =>{}}}
    end
  end

  def test_should_show_retro
    get :show, :id => retros(:one).id
    assert_response :success
  end
end

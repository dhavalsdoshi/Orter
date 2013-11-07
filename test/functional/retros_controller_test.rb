require File.dirname(__FILE__) + '/../test_helper'

class RetrosControllerTest < ActionController::TestCase
  def test_should_create_retro
    assert_difference('Retro.count') do
      post :create, { :name => 'a retro',:description => 'a retro desc', :sectionname1 => "one section", :numberOfSections => "0"}
    end
  end

end

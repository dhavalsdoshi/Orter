class ErrorController < ApplicationController

  def index
    render :file => "#{Rails.root}/public/error.html"
  end

end

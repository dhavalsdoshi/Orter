class ErrorController < ApplicationController

  def index
    render :file => "#{RAILS_ROOT}/public/error.html"
  end

end

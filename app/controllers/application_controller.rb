class ApplicationController < ActionController::Base
  protect_from_forgery
  helper :all # include all helpers, all the time

  def rescue_action(e)
    p e
    #LOGGER.error e.message
    #LOGGER.error e.backtrace.join("\n")
    render :file => "#{Rails.root}/public/error.html"
  end
end

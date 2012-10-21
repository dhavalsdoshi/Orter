# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time

  MOBILE_BROWSERS = [
    "android", "avantgo", "blackberry", "blazer", "elaine", "hiptop", "iphone", "ipod", "kindle",
    "midp", "mmp", "mobile", "o2", "opera mini", "palm", "pda", "plucker", "pocket", "psp",
    "smartphone", "symbian", "treo", "up.browser", "up.link", "vodafone", "wap",
    "windows ce; iemobile", "windows ce; ppc;", "windows ce; smartphone;", "xiino"
  ]
  # See ActionController::RequestForgeryProtection for details
  # Uncomment the :secret if you're not using the cookie session store
  protect_from_forgery # :secret => 'f92c99c75424ae3a97cc0033145fe066'

  def rescue_action(e)
    p e
    LOGGER.error e.message
    LOGGER.error e.backtrace.join("\n")
    render :file => "#{RAILS_ROOT}/public/error.html"
  end

  def current_user
    @user ||= User.find session[:user_id] if session[:user_id]
  end

  def mobile?
    (non_mobile_user_agent?(request.user_agent) ? false : true)
  end

  private
  def non_mobile_user_agent? (user_agent)
    (user_agent =~ /Pad|Tab/i) || (user_agent =~ /android/i && !(user_agent =~ /mobile/i)) || !(user_agent =~ /#{MOBILE_BROWSERS.join('|')}/i)
  end

end

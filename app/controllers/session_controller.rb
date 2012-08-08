class SessionController < ApplicationController
  def new
    session["referer_url"] = request.env["HTTP_REFERER"]
    redirect_to '/auth/google'
  end

  def create
    auth = request.env["omniauth.auth"]
    user = User.find_by_provider_and_uid(auth["provider"], auth["uid"]) || User.create_with_omniauth(auth)
    session[:user_id] = user.id
    redirect_to session["referer_url"] || root_url, :notice => "Signed in!"
  end

  def destroy
    session[:user_id] = nil
    redirect_to request.env["HTTP_REFERER"] || root_url, :notice => "Signed out!"
  end
end


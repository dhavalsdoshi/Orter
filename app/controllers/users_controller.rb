class UsersController < ApplicationController

  def retros
    @user = current_user
    @retros = @user.retros
  end

  def add_retro
    url_params = ActionController::Routing::Routes.recognize_path(URI.parse(params["url"]).path, :method => :get)
    retro = Retro.find url_params[:id]
    if retro
      flash[:success] = "Added successfully"
      retro.users += current_user
    else
      flash[:error] = "Link invalid"
    end
    redirect_to :action => :retros
  end

end

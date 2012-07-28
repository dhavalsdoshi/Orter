class UsersController < ApplicationController

  def retros
    @user = current_user
    @retros = @user.retros
  end

end

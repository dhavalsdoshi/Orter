class PagesController < ApplicationController
  #layout :simple_board
  def show
    render :action => params[:name], :layout => 'simple_board'
  end
end

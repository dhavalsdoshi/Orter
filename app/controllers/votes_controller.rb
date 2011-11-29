class VotesController < ApplicationController

  def create
    vote = Vote.new(params[:vote])

    respond_to do |format|
      if vote.save
        format.json  { render :xml => vote.to_json, :status => :created, :location => vote.to_json }
      else
        format.json  { render :json => vote.errors.to_json, :status => :unprocessable_entity }
      end
    end
  end

end
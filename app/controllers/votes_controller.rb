class VotesController < ApplicationController

  def create
    vote = Vote.new(params[:vote])
    vote.type = params[:vote].fetch(:type)
    puts "PARAMS! #{params[:vote]}"
    puts "TYPE! #{vote.type}"
    puts "VOTE! #{vote.inspect}"
    respond_to do |format|
      if vote.save
        format.json  { render :xml => vote.to_json, :status => :created, :location => vote.to_json }
      else
        format.json  { render :json => vote.errors.to_json, :status => :unprocessable_entity }
      end
    end
  end

end

class VotesController < ApplicationController

  def create
    vote = Vote.new(
        point_id: params[:point_id]
    )
    respond_to do |format|
      if vote.save
        point = vote.point
        Rails.cache.delete("retro_#{point.section.retro.name}_#{point.section.retro.id}")
        format.json  { render :json => vote.to_json, :status => :created }
      else
        format.json  { render :json => vote.errors.to_json, :status => :unprocessable_entity }
      end
    end
  end



end
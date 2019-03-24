class VotesController < ApplicationController

  def create
    vote = Vote.new(vote_params)

    respond_to do |format|
      if vote.save
        point = vote.point
        delete_cache_for(point)
        format.json  { render :json => vote.to_json, :status => :created }
      else
        format.json  { render :json => vote.errors.to_json, :status => :unprocessable_entity }
      end
    end
  end

  private

  def vote_params
    params.require(:vote).permit(:point_id)
  end

  def delete_cache_for(point)
    Rails.cache.delete("retro_#{point.section.retro.name}_#{point.section.retro.id}")
    ActionCable.server.broadcast "updates_#{point.section.retro.id}_#{point.section.retro.name}", message: 'go_fetch'
  end

end
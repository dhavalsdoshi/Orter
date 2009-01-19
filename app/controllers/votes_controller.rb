class VotesController < ApplicationController
  
  before_filter :load_point

  def load_point
    @point = Point.find(params[:point_id])
  end
  
  def index
    @votes = @point.votes.find(:all)

    respond_to do |format|
      format.xml  { render :xml => @votes }
    end
  end

  def show
    @vote = @point.vote.find(params[:id])

    respond_to do |format|
      format.xml  { render :xml => @vote }
    end
  end

  def vote_url(vote)
    return vote.to_s
  end
  
  def create
    @vote = @point.votes.build(params[:vote])

    respond_to do |format|
      if @vote.save
        flash[:notice] = 'Vote was successfully created.'
        format.xml  { render :xml => @vote, :status => :created, :location => @vote }
      else
        format.xml  { render :xml => @vote.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @vote = @point.vote.find(params[:id])
    @vote.destroy

    respond_to do |format|
      format.xml  { head :ok }
    end
  end
end

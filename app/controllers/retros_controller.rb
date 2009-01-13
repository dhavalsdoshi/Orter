class RetrosController < ApplicationController
  # GET /retros
  # GET /retros.xml
  def index
    @retros = Retro.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @retros }
    end
  end

  # GET /retros/1
  # GET /retros/1.xml
  def show
    @retro = Retro.find(params[:id])
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @retro }
    end
  end
  
    # render(:text => "<pre>" + email.encoded + "</pre>") 
  
  def temp_render retro
    retro.instance_eval do
      def event_date
        Time.new
      end
      def organizer
        "organizer@thoughtworks.com"
      end
      def participants
        ["anayak@thoughtworks.com"]
      end
    end
  end

  # GET /retros/new
  # GET /retros/new.xml
  def new
    @retro = Retro.new
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @retro }
    end
  end

  # GET /retros/1/edit
  def edit
    @retro = Retro.find(params[:id])
  end

  # POST /retros
  # POST /retros.xml
  def create
    @retro = Retro.new({:name =>params[:retro][:name], :description =>params[:retro][:description]})

    params[:retro][:sections][:section].each do |section_name|
      @retro.sections << Section.new({:name =>section_name})
    end
    respond_to do |format|
      if @retro.save
        participants = create_participants(params[:retro][:participants].split(","))
        
        participants.each do |participant|
          email = RetrospectiveMailer.create_new_retro(@retro, participants, participant, params[:retro][:event_date]) 
          RetrospectiveMailer.deliver(email)
        end
        
        flash[:notice] = 'Retro was successfully created.'
        format.html { redirect_to(@retro) }
        format.xml  { render :xml => @retro, :status => :created, :location => @retro }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @retro.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  # PUT /retros/1
  # PUT /retros/1.xml
  def update
    @retro = Retro.find(params[:id])

    respond_to do |format|
      if @retro.update_attributes(params[:retro])
        flash[:notice] = 'Retro was successfully updated.'
        format.html { redirect_to(@retro) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @retro.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /retros/1
  # DELETE /retros/1.xml
  def destroy
    @retro = Retro.find(params[:id])
    @retro.destroy

    respond_to do |format|
      format.html { redirect_to(retros_url) }
      format.xml  { head :ok }
    end
  end
  
  private
  
  def create_participants(email_ids)
    participants = []
    email_ids.each do |email_id|
      next if email_id.nil? || email_id.strip.empty? 
      participants << Participant.create({:email => email_id.strip, :retro => @retro})
    end
    participants
  end
  
end

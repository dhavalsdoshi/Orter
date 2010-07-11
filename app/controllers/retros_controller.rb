class RetrosController < ApplicationController

  def show
    @retro = Retro.find(params[:id])
    respond_to do |format|
      format.xml  { render :xml => @retro }
      p @retro
	  format.json  { render :json => @retro.to_json }
    end
  end

  def create
    @retro = Retro.new({:name =>CGI.escapeHTML(params[:retro][:name]), :description =>CGI.escapeHTML(params[:retro][:description])})

    params[:retro][:sections][:section].each do |section_name|
      @retro.sections << Section.new({:name =>CGI.escapeHTML(section_name)})
    end
    respond_to do |format|
      if @retro.save
		session['created_retro_id'] = @retro.id
        flash[:notice] = 'Retro was successfully created.'
        LOGGER.info("retro created for: {#{@retro.name}}")
        format.xml  { render :xml => @retro, :status => :created, :location => @retro }
		format.json  { render :json => @retro.to_json, :status => :created, :location => @retro.to_json }
      else
        format.xml  { render :xml => @retro.errors, :status => :unprocessable_entity }
		format.json  { render :json => @retro.errors.json, :status => :unprocessable_entity }
      end
    end
  end

  #because IE sucks
  def last_created_retro_id
	@retro_id = session['created_retro_id'] || ''
	@retro = Retro.find @retro_id
	respond_to do |format|
      format.xml  { render :xml => @retro }
	  format.json  { render :json => @retro.to_json }
    end
  end
  
  def export
    @retro = Retro.find(params[:id])
    headers["Content-Disposition"] = "attachment; filename=\"retro.pdf\""
    respond_to do|format|
      format.pdf {render :layout =>false}
    end
  end
  
  
end

class RetrosController < ApplicationController

  def new
  end

  def show
    @retro = Retro.find(params[:id])
    respond_to do |format|
      format.xml  { render :xml => @retro }
      p @retro
	  format.json  { render :json => @retro.to_json }
    end
  end

  def create
    @retro = Retro.new({:name =>CGI.escapeHTML(params[:name]), :description =>CGI.escapeHTML(params[:description])})

    params[:numberOfSections].to_i.times do |section_number|
      section_name = ("sectionname"+section_number.to_s)
      @retro.sections << Section.new({:name =>CGI.escapeHTML(params[section_name])})
    end

    if @retro.save
      session['created_retro_id'] = @retro.id
      flash[:notice] = 'Retro was successfully created.'
      LOGGER.info("retro created for: {#{@retro.name}} #{@retro.id.to_s}")
      redirect_to :controller => :deeplinks, :action => :index, :id=>@retro.id.to_s,:name=> @retro.name
    else
      render new
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
    headers["Content-Disposition"] = "attachment; filename=\"#{@retro.name}.#{params[:format]}\""
    respond_to do|format|
      format.pdf {render :layout =>false} if params[:format] == 'pdf'
      format.xls {render :layout =>false} if params[:format] == 'xls'
    end
  end
  
  
end

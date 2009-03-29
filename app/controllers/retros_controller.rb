class RetrosController < ApplicationController

  def show
    @retro = Retro.find(params[:id])
    respond_to do |format|
      format.xml  { render :xml => @retro }
    end
  end

  def create
    @retro = Retro.new({:name =>params[:retro][:name], :description =>params[:retro][:description]})

    params[:retro][:sections][:section].each do |section_name|
      @retro.sections << Section.new({:name =>section_name})
    end
    respond_to do |format|
      if @retro.save
        flash[:notice] = 'Retro was successfully created.'
        LOGGER.info("retro created for: {#{@retro.name}}")
        format.xml  { render :xml => @retro, :status => :created, :location => @retro }
      else
        format.xml  { render :xml => @retro.errors, :status => :unprocessable_entity }
      end
    end
  end

  def export
    @retro = Retro.find(params[:id])
    respond_to do|format|
      format.pdf {render :layout =>false}
    end
  end
end

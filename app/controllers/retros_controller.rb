class RetrosController < ApplicationController
  protect_from_forgery except: :remove_from_my_board

  def new
    @user = current_user
    #if mobile?
    #  render 'mobile_new' and return
    #end
  end

  def create
    @retro = Retro.new({:name => CGI.escapeHTML(params[:name]), :description => CGI.escapeHTML(params[:description])})

    params[:numberOfSections].to_i.times do |section_number|
      section_name = ("sectionname"+section_number.to_s)
      @retro.sections << Section.new({:name => CGI.escapeHTML(params[section_name])})
    end
    @retro.users = [current_user] if current_user

    if verify_recaptcha(timeout: 60) && @retro.save
      flash[:notice] = 'Retro was successfully created.'
      redirect_to retro_for_url(:id => @retro.id.to_s, :name => @retro.name)
    else
      @user = current_user
      flash[:error] = 'Error creating board. Please try again.'
      render :new
    end
  end

  def show
    @retrospective = Retro.where(id: params[:id], name: params[:name]).includes(:sections).take
    add_current_user(@retrospective)
    if mobile?
      respond_to do |format|
        format.html{render :mobile_show}
        format.json{render :json => @retrospective.to_json(:include => {:sections => {:only => [:name, :id]}}, :except => [:created_at, :updated_at]) }
      end
      return
    end

    respond_to do |format|
      format.html{render :action => :show}
      format.json{render :json => @retrospective.to_json(:include => {:sections => {:only => [:name, :id]}}, :except => [:created_at, :updated_at]) }
    end
  end

  def show_old
    @retrospective = Retro.where(name: params[:name]).includes(:sections).take
    add_current_user(@retrospective)
    if mobile?
      render :mobile_show and return
    end
    render :action => :show
  end

  def remove_from_my_board
    @retrospective = Retro.where(id: params[:id]).includes(:users).take
    remaining_users = @retrospective.users - [User.find(current_user.id)]
    @retrospective.users = remaining_users
    respond_to do |format|
      format.json{render json: @retrospective.users.to_json , status: :ok}
    end
  end

  def export
    @retro = Retro.find_by_id_and_name(params[:id], params[:name])
    headers["Content-Disposition"] = "attachment; filename=\"#{@retro.name}.#{params[:format]}\""
    respond_to do|format|
      format.pdf {render :layout =>false}
      format.xls {render :layout =>false}
    end
  end

  private
  def add_current_user(retrospective)
    retrospective.users ||= []
    retrospective.users << current_user unless current_user.nil? or retrospective.users.include?(current_user)
  end
end

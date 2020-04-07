class SectionsController < ApplicationController

  def new
    @retro = Retro.find_by_id_and_name(params[:retro_id], params[:retro_name])
    return head :unprocessable_entity if @retro.nil? || params[:name].blank?
    new_section = Section.new(section_params)
    @retro.sections << new_section
    respond_to do |format|
      format.json{render json: @retro.to_json , status: :ok}
    end
  end

  def update
    @retro = Retro.find_by_id_and_name(params[:retro_id], params[:retro_name])
    return head :unprocessable_entity if @retro.nil?
    section = Section.where(id: params[:id], name: params[:old_name], retro_id: params[:retro_id]).first
    return head :unprocessable_entity if section.nil?
    section.name = params[:name]
    if section.save
      respond_to do |format|
        format.json{render json: @retro.to_json , status: :ok}
      end
    else
      respond_to do |format|
        format.json{render error: "Unable to update the Section" , status: :unprocessable_entity}
      end
    end

  end

  private
  def section_params
    params.require(:section).permit(:name)
  end
end
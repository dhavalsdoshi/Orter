module DeeplinksHelper
  def get_section_width(number_of_sections_in_row)
    class_name_for = {1 => "full", 2=> "half", 3 => "oneThird"}
    class_name_for[number_of_sections_in_row]
  end

  def get_sticky_color(section_number)
    colors = ["yellow","orange", "green","blue","purple","aqua"]
    return colors[section_number%colors.length]
  end

  def get_rows_for_sections(sections)
    if sections.size <= 3
      return sections, []
    else
      return sections.slice(0..((sections.size/2.0).ceil)-1),sections.slice((sections.size/2.0).ceil, sections.size-1) 
    end
  end

end

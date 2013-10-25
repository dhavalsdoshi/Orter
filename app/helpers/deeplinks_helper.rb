module DeeplinksHelper
  def get_section_width(number_of_sections_in_row)
    class_name_for = {1 => "full", 2 => "half", 3 => "oneThird"}
    class_name_for[number_of_sections_in_row]
  end

  def get_sticky_color(section_number)
    colors = ["yellow","orange", "green","purple","aqua","blue"]
    colors[section_number%colors.length]
  end

  def get_rows_for_sections(sections)
    rows = sections.each_slice(3).to_a
    return rows
  end

end

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
    number_of_sections = sections.size
    if number_of_sections == 1
      [sections[0..0]].to_a
    elsif number_of_sections % 3 == 1
      sections[0..-5].each_slice(3).to_a.concat(sections[-4..-1].each_slice(2).to_a)
    else
      sections.each_slice(3).to_a
    end
  end

end

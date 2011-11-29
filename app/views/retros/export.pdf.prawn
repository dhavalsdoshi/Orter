pdf.font "Helvetica"
pdf.text CGI.unescapeHTML(@retro.name), :size => 18,:align => :center, :style => :bold, :spacing => 4
pdf.text CGI.unescapeHTML(@retro.description), :align => :center, :size => 12, :spacing => 4
pdf.text " "

@retro.sections.each do |section|
  pdf.text CGI.unescapeHTML(section.name), :size => 14, :style =>:bold, :spacing => 4
  data = section.points.sort{|a,b| b.votes.length <=> a.votes.length}.collect{ |p| [p.message, p.votes.count]}
  header =[["Point","Votes"]]
  pdf.table(header+data,:row_colors => ["FFFFFF", "F8F8F8"], :column_widths => [400, 100]) do
   row(0).font_style = :bold
  end
  pdf.text " "
end



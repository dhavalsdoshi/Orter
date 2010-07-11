pdf.font "Helvetica"
pdf.text CGI.unescapeHTML(@retro.name), :size => 18, :style => :bold, :spacing => 4
pdf.text CGI.unescapeHTML(@retro.description), :size => 12, :spacing => 4
pdf.text " "
@retro.sections.each do |section|
    pdf.text CGI.unescapeHTML(section.name), :size => 14, :style =>:bold, :spacing => 4
    section.points.sort{|a,b| b.votes.length <=> a.votes.length}.each do |point|
        voteText = point.votes.length > 0 ? "(votes : #{point.votes.length})" : ""
        pdf.text "\302\273 #{CGI.unescapeHTML(point.message)} " + voteText, :size => 12, :spacing => 2
    end
    pdf.text " "
end

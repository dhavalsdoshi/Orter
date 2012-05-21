unless Retro.find_by_name("test")
  p "Creating a test retro"
  retro = Retro.create!(:name => "test", :description => "test")
  ["Went Well", "Didn't Go Well", "Action Items"].each { |name| Section.create!(:name => name, :retro => retro )}
end

unless Retro.find_by_name("feedback")
  p "Creating a feedback retro"
  retro = Retro.create!(:name => "feedback", :description => "feedback")
  ["Good features", "Features to improve", "New features"].each { |name| Section.create!(:name => name, :retro => retro )}
end

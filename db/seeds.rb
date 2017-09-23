if Retro.find_by(name: "test").nil?
  p "Creating a test retro"
  retro = Retro.create!(:name => "test", :description => "test")
  Section.create!(:name => "Went Well", :retro => retro)
  Section.create!(:name => "Didn't Go Well", :retro => retro)
  Section.create!(:name => "Action Items", :retro => retro)
end

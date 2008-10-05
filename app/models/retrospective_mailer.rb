class RetrospectiveMailer < ActionMailer::Base
  

  def new_retro(retro, participants, participant,event_date)
    subject    "Retrospective scheduled on #{event_date}"
    recipients participant.email
    from       "noreply-orteR@thoughtworks.com"
    sent_on    Time.now
    
    body      :event_date => event_date, 
              :retro_name => retro.name, 
              :retro_description =>retro.description, 
              :participants =>participants,
              :retro_link => "#{CONTEXT_PATH}/deeplinks/#{RetroDeepLink.encode(:retro_id => retro.id, :participant_code=>participant.id)}"
  end

end

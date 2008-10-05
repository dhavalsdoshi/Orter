class RetrospectiveMailer < ActionMailer::Base
  

  def new_retro(retro, participant,event_date)
    subject    "Retrospective scheduled on #{event_date}"
    recipients participant
    from       "noreply-orteR@thoughtworks.com"
    sent_on    Time.now
    
    body      :event_date => event_date, 
              :retro_name => retro.name, 
              :retro_description =>retro.description, 
              :retro_link => "#{CONTEXT_PATH}/deeplinks?id=#{retro.id}&user=#{participant}"
  end

end

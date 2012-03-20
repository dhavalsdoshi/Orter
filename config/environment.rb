# Load the rails application
require File.expand_path('../application', __FILE__)

class Logger
  def format_message(severity, timestamp, progname, msg)
    "#{timestamp} #{severity.to_s} #{msg.to_s.gsub(/\s/,' ')}\n"
  end
end


LOGGER = Logger.new("#{Rails.root}/log/retro.log",100, 50 * 1024 * 1024)

# Initialize the rails application
Gorter::Application.initialize!

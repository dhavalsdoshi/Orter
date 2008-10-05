require "cgi"

class RetroDeepLink
  
  def self.encode params
    CGI.escape(Base64.encode64(Marshal.dump(params)))
  end
  
  def self.decode encoded_params
    Marshal.load(Base64.decode64(CGI.unescape(encoded_params)))
  end
  
end

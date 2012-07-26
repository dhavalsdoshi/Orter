OmniAuth.config.full_host = "http://localhost:3000"

ActionController::Dispatcher.middleware.use OmniAuth::Builder do
  provider :google, '45486672807.apps.googleusercontent.com', 'ncK0Anc4VO_QnKcrijVDqlQX', :scope => 'https://mail.google.com/mail/feed/atom/'
end

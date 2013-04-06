omni_auth = YAML::load(File.read(RAILS_ROOT + '/config/omniauth.yml'))[Rails.env]

OmniAuth.config.full_host = omni_auth['host']

ActionController::Dispatcher.middleware.use OmniAuth::Builder do
  provider :google, omni_auth['id'], omni_auth['secret'], :scope => 'https://www.google.com/m8/feeds/'
end

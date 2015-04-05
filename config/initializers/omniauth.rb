omni_auth = YAML::load(File.read(Rails.root.join('config/omniauth.yml')))[Rails.env]

OmniAuth.config.full_host = omni_auth['host']

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, omni_auth['id'], omni_auth['secret'], :scope => 'email, profile'
end

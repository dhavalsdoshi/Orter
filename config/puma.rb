# config/server/puma.rb

# Change to match your CPU core count
workers 4

# Min and Max threads per worker
threads 4, 24

app_dir = "/root/apps/orter"
shared_dir = "/root/apps/orter/tmp" # shared is outside of vagrant since there is some permission problem if is inside /vagrant

# Default to production
rails_env = ENV['RAILS_ENV'] || "production"
environment rails_env

preload_app!

# Set up socket location
bind "unix://#{shared_dir}/sockets/puma.sock?backlog=4096"

# Logging
stdout_redirect "#{shared_dir}/log/puma.stdout.log", "#{shared_dir}/log/puma.stderr.log", true

# Set master PID and state locations
pidfile "#{shared_dir}/pids/puma.pid"
state_path "#{shared_dir}/pids/puma.state"
activate_control_app

on_worker_boot do
  require "active_record"
  ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
  ActiveRecord::Base.establish_connection(YAML.load_file("#{app_dir}/config/database.yml")[rails_env])
end

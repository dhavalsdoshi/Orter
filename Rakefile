# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

Rails.application.load_tasks

task :ensure_db_up do
    db_is_up = false
    attempts = 0
    while !db_is_up || attempts > 30
        begin
            attempts += 1
            client = Mysql2::Client.new(Rails.configuration.database_configuration[Rails.env])
            db_is_up = true
            puts "DB Up"
        rescue Exception => ex
            puts "DB Not Up Yet; Exception message: #{ex.message}"
            sleep 1
        end
    end
    abort "DB took too long to become available" unless db_is_up
end

task :mygrate_db => [:ensure_db_up] do
    Rake::Task["db:migrate"].invoke
end

task :migrate_and_start => [:mygrate_db] do
    Process.exec("rails s")
end

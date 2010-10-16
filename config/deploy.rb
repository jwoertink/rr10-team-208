require "bundler/capistrano"

set :application, "twithole"
set :repository, "git@github.com:railsrumble/rr10-team-208.git"
set :deploy_to, "/u/apps/#{application}"
set :scm, :git
set :git_enable_submodules, 1
set :git_shallow_clone, 1

set :use_sudo, false
set :ssh_options, { :forward_agent => true }
ssh_options[:keys] = %w(~/.ssh/twithole)
ssh_options[:username] = "deploy"

role :web, "173.255.195.64"
role :app, "173.255.195.64"
role :db,  "173.255.195.64", :primary => true

namespace :deploy do
  task :start do; end
  task :stop do; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path, "tmp", "restart.txt")}"
  end

  desc "Link in the production database.yml" 
  task :set_database_yml do
    run "cp #{release_path}/config/database.yml.release #{release_path}/config/database.yml" 
  end
end

after "deploy:update_code", "deploy:set_database_yml"

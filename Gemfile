source 'https://rubygems.org'

gem 'rails', '4.0.3'
gem 'pg'
gem 'sass-rails', '~> 4.0.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.0.0'
gem 'jquery-rails'
gem 'jbuilder', '~> 1.2'
gem 'devise'
gem 'd3-rails'
gem 'sendgrid'
gem 'pony'
gem 'httparty'

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

group :development do
  gem 'bullet'
  gem 'coffee-rails-source-maps'
  # Add model attributes
  gem 'annotate'
  # Turn off verbose logging of asset requests
  gem 'quiet_assets'
  # better error console
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'meta_request'
end

# For testing
group :development, :test do
  gem 'dotenv-rails'
  gem 'pry'
  gem 'pry-nav'
  gem 'pry-rails'
  gem 'pry-stack_explorer'
  gem 'rspec-rails'
end

group :test do
  gem 'simplecov'
  gem 'factory_girl_rails'
  gem 'shoulda-matchers'
  gem 'faker'
  gem 'capybara'
  gem 'database_cleaner'
  gem 'guard-rspec'
  gem 'launchy'
  gem 'poltergeist'
  gem 'webmock'
end

group :production do
  gem 'rails_12factor'
end

ruby '2.0.0'

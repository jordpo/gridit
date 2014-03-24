# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
GridIt::Application.initialize!


ActionMailer::Base.smtp_settings = {
  :user_name => 'jordan.morano@gmail.com',
  :password => ENV['MAIL_PWD'],
  :domain => 'gridit.herokuapp.com',
  :address => 'smtp.gmail.com',
  :port => 587,
  :authentication => :plain,
  :enable_starttls_auto => true
}

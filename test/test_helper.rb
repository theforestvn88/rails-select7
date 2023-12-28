# Configure Rails Environment
ENV["RAILS_ENV"] = "test"

require_relative "../test/dummy/config/environment"
ActiveRecord::Migrator.migrations_paths = [File.expand_path("../test/dummy/db/migrate", __dir__)]
ActiveRecord::Migrator.migrations_paths << File.expand_path("../db/migrate", __dir__)
require "rails/test_help"

# Load fixtures from the engine
if ActiveSupport::TestCase.respond_to?(:fixture_path=)
  ActiveSupport::TestCase.fixture_path = File.expand_path("fixtures", __dir__)
  ActionDispatch::IntegrationTest.fixture_path = ActiveSupport::TestCase.fixture_path
  ActiveSupport::TestCase.file_fixture_path = ActiveSupport::TestCase.fixture_path + "/files"
  ActiveSupport::TestCase.fixtures :all
end

# 
require 'capybara/rails'
require 'capybara/minitest'

# Capybara.register_driver :headless_chrome do |app|
#     options = Selenium::WebDriver::Chrome::Options.new
#     options.add_argument('--headless')
  
#     Capybara::Selenium::Driver.new(
#       app,
#       browser: :chrome,
#       options: options
#     )
#   end
  
#   Capybara.register_driver :chrome do |app|
#     options = Selenium::WebDriver::Chrome::Options.new
  
#     Capybara::Selenium::Driver.new(
#       app,
#       browser: :chrome,
#       options: options
#     )
#   end
  
#   Capybara.default_driver = :chrome

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
#   driven_by :selenium, using: :firefox
    driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
end

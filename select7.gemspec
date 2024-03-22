require_relative "lib/select7/version"

Gem::Specification.new do |spec|
  spec.name        = "select7"
  spec.version     = Select7::VERSION
  spec.authors     = ["Lam Phan"]
  spec.email       = ["theforestvn88@gmail.com"]
  spec.homepage    = "https://github.com/theforestvn88/rails-select7.git"
  spec.summary     = "Multiple choices selector (similar to select2, but with rails hotwire)"
  spec.description = "Multiple choices selector (similar to select2, but with rails hotwire)"
  spec.license     = "MIT"
  
  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/theforestvn88/rails-select7.git"
  spec.metadata["changelog_uri"] = "https://github.com/theforestvn88/rails-select7.git"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end

  spec.add_dependency "rails", ">= 7.0"
  spec.add_dependency 'stimulus-rails'

  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'minitest'
  spec.add_development_dependency 'capybara', ">= 3.26"
  spec.add_development_dependency 'selenium-webdriver', "4.8.0"
  spec.add_development_dependency 'webdrivers', ">= 5.0.0"
end

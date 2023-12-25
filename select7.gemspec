require_relative "lib/select7/version"

Gem::Specification.new do |spec|
  spec.name        = "select7"
  spec.version     = Select7::VERSION
  spec.authors     = ["Lam Phan"]
  spec.email       = ["theforestvn88@gmail.com"]
  spec.homepage    = "https://github.com/theforestvn88/rails-select7.git"
  spec.summary     = "selector (similar to select2, but no jquery, only use stimulus.js) for rails"
  spec.description = "selector (similar to select2, but no jquery, only use stimulus.js) for rails"
    spec.license     = "MIT"
  
  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the "allowed_push_host"
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  spec.metadata["allowed_push_host"] = "https://github.com/"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/theforestvn88/rails-select7.git"
  spec.metadata["changelog_uri"] = "https://github.com/theforestvn88/rails-select7.git"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end

  spec.add_dependency "rails"#, ">= 7.0"
end

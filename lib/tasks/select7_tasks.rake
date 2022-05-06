def run_select7_install_template(path)
    system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{path}"
end

namespace :select7 do
    task :install do
        run_select7_install_template "../select7/lib/install/stimulus.rb"
    end
end
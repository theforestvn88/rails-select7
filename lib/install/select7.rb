IMPORTMAP_PATH = Rails.root.join("config/importmap.rb")
APPLICATION_LAYOUT_PATH = Rails.root.join("app/views/layouts/application.html.erb")

say "Import Select7 Js"

if IMPORTMAP_PATH.exist?
  append_to_file IMPORTMAP_PATH, %(\npin "lodash.debounce", to: "https://cdn.jsdelivr.net/npm/lodash.debounce@4.0.8/+esm", preload: true\n)
  append_to_file IMPORTMAP_PATH, %(pin "select7", to: "select7.esm.js", preload: true\n)
  
  copy_file "#{__dir__}/app/javascript/controllers/select7_esm_controller.js", "app/javascript/controllers/select7_controller.js"

elsif Rails.root.join("package.json").exist?
  if APPLICATION_LAYOUT_PATH.exist?
    run "yarn add lodash.debounce"
    
    insert_into_file APPLICATION_LAYOUT_PATH.to_s, <<~ERB.indent(4), before: /\s*<\/head/
      \n<%= javascript_include_tag "select7", "data-turbo-track": "reload", rel: :preload, async: true %>
    ERB

    append_to_file Rails.root.join("app/javascript/controllers/index.js"), <<~ERB
      import Select7Controller from "./select7_controller.js"
      application.register("select7", Select7Controller)
    ERB

    append_to_file Rails.root.join("app/javascript/application.js"), <<~ERB
    ERB

    copy_file "#{__dir__}/app/javascript/controllers/select7_controller.js", "app/javascript/controllers/select7_controller.js"
  else
    say %(Couldn't Import Select7 Js), :red
  end
else
  say %(You must either be running with node (package.json) or importmap-rails (config/importmap.rb) to use this gem.), :red
end


# ==============

say "Import Select7 Css"
if (Rails.root.join("app/assets/stylesheets/application.css")).exist?
  append_to_file "app/assets/stylesheets/application.css", %(\n@import "select7.css"\n)
elsif APPLICATION_LAYOUT_PATH.exist?
  insert_into_file APPLICATION_LAYOUT_PATH.to_s, <<~ERB.indent(4), before: /^\s*<%= stylesheet_link_tag/
    <%= stylesheet_link_tag "select7", "select7", "data-turbo-track": "reload" %>
  ERB
else
  say %(Couldn't Import Select7 Css), :red
end
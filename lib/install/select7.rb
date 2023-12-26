APPLICATION_LAYOUT_PATH = Rails.root.join("app/views/layouts/application.html.erb")

say "Import Select7 Js"
if (Rails.root.join("app/javascript/application.js")).exist?
  append_to_file "app/javascript/application.js", %(\nimport "select7"\n)
elsif APPLICATION_LAYOUT_PATH.exist?
  insert_into_file APPLICATION_LAYOUT_PATH.to_s, <<~ERB.indent(4), before: /\s*<\/head>/
    \n<%= javascript_import_module_tag "select7" %>
  ERB
else
  say %(Couldn't Import Select7 Js), :red
end


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
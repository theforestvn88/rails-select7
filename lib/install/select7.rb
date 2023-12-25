say "Import Select7 Js"
copy_file "#{__dir__}/app/javascript/controllers/select7_controller.js",
  "app/javascript/controllers/select7_controller.js"

if (Rails.root.join("app/assets/stylesheets/application.css")).exist?
  say "Import Select7 Css"
  append_to_file "app/assets/stylesheets/application.css", %(\n@import "select7";\n)
else
  say %(Couldn't find "app/assets/stylesheets/application.css".), :red
end
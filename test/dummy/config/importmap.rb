# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "lodash.debounce", to: "https://cdn.jsdelivr.net/npm/lodash.debounce@4.0.8/+esm", preload: true
pin "select7", to: "select7.esm.min.js", preload: true

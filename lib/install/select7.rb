say "Import Js"
copy_file "#{__dir__}/app/javascript/controllers/select7_controller.js",
  "app/javascript/controllers/select7_controller.js"

say "Import Css"
copy_file "#{__dir__}/app/assets/stylesheets/select7.css",
  "app/assets/stylesheets/select7.css"
# append_to_file "app/assets/stylesheets/application.tailwind.css", %(
#   .select7-container {
#     @apply my-5 relative;
#   }
    
#   .select7-selection {
#     @apply flex justify-start block shadow rounded-md border border-gray-200 outline-none py-2 px-3 mt-2 w-full;
#   }
#   .select7-selected-container {
#     @apply flex justify-start;
#   }

#   .select7-input {
#     @apply border-none outline-none;
#   }

#   .select7-suggestion {
#     @apply absolute left-0 w-full h-20 drop-shadow-xl border-b-2 border-x-2 border-gray-200 z-50 bg-white;
#   }

#   .select7-selected-item {
#     @apply border-2 border-gray-300 rounded-md pl-1 mr-1 flex justify-between items-center;
#   }

#   .select7-selected-item-content {
#     @apply text-xs font-bold pointer-events-none;
#   }

#   .select7-item-close {
#     @apply text-center text-xs px-1 hover:rounded-full hover:bg-red-200 hover:cursor-pointer;
#   }

#   .select7-option-item {
#     @apply hover:bg-gray-200 hover:cursor-pointer px-2 py-1 w-full;
#   }
# )
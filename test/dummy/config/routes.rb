Rails.application.routes.draw do
  resources :projects do
    get :search, on: :collection
  end
end

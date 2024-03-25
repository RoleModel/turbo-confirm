Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  resources :todos
  resources :confirms, only: :index
  root "todos#index"
end

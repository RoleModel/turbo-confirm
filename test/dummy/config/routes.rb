Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  resources :todos
  resources :confirms, only: [] do
    get :div, on: :collection # div/css based confirm
    get :dialog, on: :collection # dialog element based confirm
  end
  root "todos#index"
end

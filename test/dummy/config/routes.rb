Rails.application.routes.draw do
  resources :todos do
    post :setup, on: :collection # test setup
    delete :teardown, on: :collection # test teardown
  end
  resources :confirms, only: [] do
    get :div, on: :collection # div/css based confirm
    get :dialog, on: :collection # dialog element based confirm
    get :custom, on: :collection # custom confirm
  end

  root to: 'todos#index'
end

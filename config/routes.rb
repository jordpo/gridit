GridIt::Application.routes.draw do

  get "dashboard/index"
  resources :bills
  devise_for :users

  root to: 'dashboard#index'
end

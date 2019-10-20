Rails.application.routes.draw do
  devise_for :users
  get 'groups/new'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'messages#index'
  resources :users, only: [:edit, :update]
end

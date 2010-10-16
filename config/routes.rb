Twithole::Application.routes.draw do
  
  resources :rules

  resources :questions, :only => [:show]
  
  resources :psas do
    collection do
      get :random
    end
  end

  root :to => "welcome#index"
end

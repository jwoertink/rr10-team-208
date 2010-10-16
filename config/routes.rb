Twithole::Application.routes.draw do
  resources :psas do
    collection do
      get :random
    end
  end

  root :to => "welcome#index"
end

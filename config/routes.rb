Twithole::Application.routes.draw do
  resources :questions, :only => [ :new ]
  resources :rules

  match '/questions/new' => 'questions#new'
  match '/player_setup_form' => 'partials#player_setup_form'
  match '/setting_player_order' => 'partials#setting_player_order'
  match '/waiting_on_players' => 'partials#waiting_on_players'
  match '/terms_and_conditions' => 'welcome#terms_and_conditions'
  match '/official_rules' => 'welcome#official_rules'


  resources :psas do
    collection do
      get :random
    end
  end

  root :to => "welcome#index"
end

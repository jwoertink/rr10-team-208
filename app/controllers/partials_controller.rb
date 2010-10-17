class PartialsController < ApplicationController
  # The partials controller will allow easy URLs to different partials to be used on the site
  
  before_filter :remove_layout
  
  def player_setup_form;end
  def setting_player_order;end
  def waiting_on_players;end
  def welcome_screen;end
  def end_of_term;end
  def end_of_game;end
  
  private
  
    def remove_layout
      render :layout => false
    end
  
end

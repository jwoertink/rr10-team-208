class WelcomeController < ApplicationController
  def index
  end
  
  def terms
  end
  
  def official_rules
    render(:layout => false)
  end
end

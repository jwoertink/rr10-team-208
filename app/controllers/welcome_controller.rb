class WelcomeController < ApplicationController
  def index
  end
  
  def terms
    render(:layout => false)
  end
  
  def official_rules
    render(:layout => false)
  end
end

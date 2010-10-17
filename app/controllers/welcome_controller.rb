class WelcomeController < ApplicationController
  def index
  end
  
  def terms_and_conditions
    render(:layout => false)
  end
  
  def official_rules
    render(:layout => false)
  end
  
  def faq
    render(:layout => false)
  end
end

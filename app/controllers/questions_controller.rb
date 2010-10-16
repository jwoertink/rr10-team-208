class QuestionsController < ApplicationController
  
  def show
    respond_to do :format
      format.json { render :json => question }
    end
  end
  
end

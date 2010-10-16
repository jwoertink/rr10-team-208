class QuestionsController < ApplicationController
  respond_to :json
  
  def new
    Question.take_random do |question|
      respond_to do |format|
        format.json { render :json => question }
      end
    end
  end
  
end

class QuestionsController < ApplicationController
  
  def show
    question = Question.random
    respond_to do :format
      format.json { render :json => question }
    end
    question.delete
  end
  
end

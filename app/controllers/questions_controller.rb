class QuestionsController < ApplicationController
  respond_to :json
  
  def new
    Question.take_random do |question|
      respond_with(question.to_json(
        :only => [:category, :heading, :content, :value, :countdown,
          :profile_image_url, :profile_image_urls],
        :methods => [:answers, :selection]
      ))
    end
  end
  
end

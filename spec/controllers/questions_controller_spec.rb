require 'spec_helper'

describe QuestionsController do
  describe 'GET new' do
    it 'gets a random question' do
      Question.should_receive(:random)
      get :new
    end
  end
end

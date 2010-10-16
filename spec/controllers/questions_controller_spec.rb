require 'spec_helper'

describe QuestionsController do
  describe 'GET new' do
    
    let(:question) { mock_model(Question).as_null_object }
    
    before { Question.stub(:random).and_return question }
    
    it 'gets a random question' do
      Question.should_receive :random
      get :new, :format => :json
    end
    
    it 'renders the question as json' do
      question.should_receive :to_json
      get :new, :format => :json
    end
    
    it 'deletes the question from the database' do
      question.should_receive :delete
      get :new, :format => :json
    end
    
    it 'succeeds' do
      get :new, :format => :json
      controller.should respond_with(:success)
    end
    
  end
end

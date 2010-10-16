require 'spec_helper'

describe Question do
  
  subject do
    Fabricate(:question,
      :correct_answer => 'this one',
      :incorrect_answers => ['not this one', 'or this one'])
  end
  
  describe '#answers' do
    it 'returns both correct and incorrect answers' do
      subject.should have(3).answers
    end
  end
  
  describe '#selection' do
    it 'returns the index of the correct answer' do
      subject.answers[subject.selection].should == 'this one'
    end
  end
  
  describe '#to_json' do
    
    let(:data) { (ActiveSupport::JSON.decode subject.to_json)['question'] }
    
    it 'includes answers' do
      data['answers'].should == subject.answers
    end
    
    it 'includes selection' do
      data['selection'].should == subject.selection
    end
    
    it 'excludes correct_answer' do
      data['correct_answer'].should_not be
    end
    
    it 'excludes incorrect_answers' do
      data['incorrect_answers'].should_not be
    end
    
  end
  
end

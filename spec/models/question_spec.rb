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
  
end

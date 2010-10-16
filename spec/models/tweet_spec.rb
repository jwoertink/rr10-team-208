require 'spec_helper'

describe Tweet do
  
  describe '#hash_tags' do
    
    subject { Fabricate(:tweet, :text => 'this is a #tweet for with some #tags for #twithole') }
    
    it 'returns an array of the hash tags in the tweet' do
      subject.hash_tags.should == ['#tweet', '#tags', '#twithole']
    end
    
  end
  
end

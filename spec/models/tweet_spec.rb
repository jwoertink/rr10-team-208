require 'spec_helper'

describe Tweet do
  
  subject { Fabricate(:tweet, :text => 'this is a #tweet for with some #tags for #twithole') }
  
  describe '#hash_tags' do
    it 'returns an array of the hash tags in the tweet' do
      subject.hash_tags.should == ['#tweet', '#tags', '#twithole']
    end
  end
  
  describe '#text_without_hash_tags' do
    it 'returns the text with hash tags removed' do
      subject.text_without_hash_tags.should == 'this is a _ for with some _ for _'
    end
  end
  
end

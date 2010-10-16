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
  
  describe '#has_profile_image?' do
    
    context 'with a default profile_image_url' do
      subject do
        Fabricate(:tweet,
          :profile_image_url => 'http://s.twimg.com/a/1287010001/images/default_profile_5_normal.png')
      end
      it 'returns false' do
        subject.should_not have_profile_image
      end
    end
    
    context 'with a custom profile_image_url' do
      subject do
        Fabricate(:tweet,
          :profile_image_url => 'http://a0.twimg.com/profile_images/1146099900/photo54_normal.jpg')
      end
      it 'returns true' do
        subject.should have_profile_image
      end
    end
  end
  
end

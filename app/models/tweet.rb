class Tweet < ActiveRecord::Base
  
  @@hash_tag_pattern = /\#\w+/
  
  def self.random(n=1)
    results = []
    for offset in (0...count).to_a.shuffle
      tweet = find :first, :offset => offset
      results << tweet if !block_given? or yield(tweet)
      return results unless results.size < n
    end
    results unless results.size < n
  end
  
  def hash_tags
    @hash_tags ||= self.text.scan(@@hash_tag_pattern)
  end
  
  def text_without_hash_tags
    self.text.gsub(@@hash_tag_pattern, '_')
  end
  
end

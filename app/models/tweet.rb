class Tweet < ActiveRecord::Base
  extend ActiveSupport::Memoizable
  
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
    self.text.scan(@@hash_tag_pattern)
  end
  memoize :hash_tags
  
  def text_without_hash_tags
    self.text.gsub(@@hash_tag_pattern, '_____')
  end
  memoize :text_without_hash_tags
  
  def has_profile_image?
    !(profile_image_url =~ /\/images\/default_profile/)
  end
  memoize :has_profile_image?
  
  def language
    Language.find_by_code(lang)
  end
  memoize :language
  
end

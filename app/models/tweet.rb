class Tweet < ActiveRecord::Base
  
  def hash_tags
    @hash_tags ||= text.scan(/\#\w+/)
  end
  
end

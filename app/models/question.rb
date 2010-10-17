class Question < ActiveRecord::Base
  extend ActiveSupport::Memoizable
  
  serialize :incorrect_answers
  serialize :profile_image_urls
  
  def self.take_random
    if q = self.random
      yield q
      q.delete
    end
  end
  
  def self.random
    if (c = count) > 0
      find :first, :offset => rand(c)
    end
  end
  
  def answers
    ([correct_answer] + incorrect_answers).shuffle
  end
  memoize :answers
  
  def selection
    answers.find_index correct_answer
  end
  memoize :selection
  
end

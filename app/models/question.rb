class Question < ActiveRecord::Base
  
  serialize :incorrect_answers
  
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
    @answers ||= ([correct_answer] + incorrect_answers).shuffle
  end
  
  def selection
    answers.find_index correct_answer
  end
  
end

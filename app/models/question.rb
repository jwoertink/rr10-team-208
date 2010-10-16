class Question < ActiveRecord::Base
  
  serialize :incorrect_answers
  
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
  
  def to_json
    super(:only => [:content, :value, :countdown],
      :methods => [:answers, :selection])
  end
  
end

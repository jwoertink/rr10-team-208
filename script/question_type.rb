require 'set'

class QuestionType
  
  def initialize(opts = {})
    @weight = opts[:weight] || 1
    @value = opts[:value] || 1
    @countdown = opts[:countdown] || 10
  end
  
  attr_reader :weight
  
  def new_question(tweet, content, answers)
    question = Question.new(
      :content => content,
      :correct_answer => answers.first,
      :incorrect_answers => answers.drop(1),
      :value => 1,
      :countdown => 10)
    question.save
    tweet.delete
    question
  end
  
  def tweet_sample(n)
    Tweet.random(n) {|_| yield _ }
  end
  
  def tweets_with_counts(n)
    counts = Set[]
    Tweet.random(n) do |t|
      count = yield t
      counts << count unless counts.include? count
    end
  end
  
  class Chooser
    
    def initialize(*question_types)
      @question_types = question_types.each_with_object([]) do |qt, a|
        qt.weight.times { a << qt }
      end
    end
    
    def choose
      @question_types.sample
    end
    
  end
  
end

require 'set'

class QuestionType
  
  def initialize(opts = {})
    @weight = opts[:weight] || 1
    @value = opts[:value] || 1
    @countdown = opts[:countdown] || 10
  end
  
  attr_reader :weight, :value, :countdown
  
  def new_question(tweet, content, answers)
    question = Question.new(
      :category => category,
      :content => content,
      :correct_answer => answers.first,
      :incorrect_answers => answers.drop(1),
      :profile_image_url => tweet.profile_image_url,
      :value => value,
      :countdown => countdown)
    tweet.delete
    question.save
    question
  end
  
  def tweet_sample(n)
    if block_given?
      Tweet.random(n) {|_| yield _ }
    else
      Tweet.random(n)
    end
  end
  
  def tweets_with_counts(n)
    counts = Set[]
    tweet_sample(n) do |t|
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

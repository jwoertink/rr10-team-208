require 'set'

class QuestionType
  
  def initialize(opts = {})
    @weight = opts[:weight] || 1
    @value = opts[:value] || 1
    @countdown = opts[:countdown] || 10
  end
  
  attr_reader :weight, :value, :countdown
  
  def new_question(tweets, heading, content, answers)
    image_urls = tweets.each_with_object({}) do |_, h|
      h[_.screen_name] = _.profile_image_url
    end
    question = Question.new(
      :category => category,
      :heading => heading,
      :content => content,
      :correct_answer => answers.first,
      :incorrect_answers => answers.drop(1),
      :profile_image_url => tweets.first.profile_image_url,
      :profile_image_urls => image_urls,
      :value => value,
      :countdown => countdown)
    tweets.first.delete
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
  
  def tweet_sample_uniq(n)
    values = Set[]
    tweet_sample(n) do |t|
      v = yield t
      if v and not values.include? v
        values << v
      end
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

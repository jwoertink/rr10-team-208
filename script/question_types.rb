require File.expand_path('../question_type', __FILE__)

class HowManyQuestion < QuestionType
  def category
    'How Many?'
  end
end

class HashTagsQuestion < QuestionType
  def category
    'Hash Tags'
  end
end

class TrueFalseQuestion < QuestionType
  def category
    'True or False'
  end
  def true_false_question(tweet, content, answer)
    new_question(tweet, 'True or False?', content,
      [answer, !answer].map {|_| _ ? 'True' : 'False' })
  end
end

class LocationQuestion < QuestionType
  def category
    'Location'
  end
end

class PicturesQuestion < QuestionType
  def category
    'Pictures'
  end
end

class HowManyTweets < HowManyQuestion
  def generate
    if tweets = tweet_sample_uniq(3) {|_| _.tweet_count }
      new_question(tweets.first,
        'How Many Tweets?',
        "How many times has @#{tweets.first.screen_name} tweeted?",
        tweets.map {|_| _.tweet_count.to_s })
    end
  end
end

class HowManyCharacters < HowManyQuestion
  def generate
    if tweets = tweet_sample_uniq(3) {|_| _.text.size }
      new_question(tweets.first,
        'How many characters are in this tweet?',
        "\"#{tweets.first.text}\"",
        tweets.map {|_| _.text.size.to_s })
    end
  end
end

class HowManyFollowers < HowManyQuestion
  def generate
    if tweets = tweet_sample_uniq(3) {|_| _.follower_count }
      new_question(tweets.first,
        'How Many Followers?',
        "How many followers does @#{tweets.first.screen_name} have?",
        tweets.map {|_| _.follower_count.to_s })
    end
  end
end

class HowManyRetweets < HowManyQuestion
  def generate
    if tweets = tweet_sample_uniq(3) {|_| _.retweet_count }
      new_question(tweets.first,
        'How many times was this retweeted?',
        "\"#{tweets.first.text}\"",
        tweets.map {|_| _.retweet_count.to_s })
    end
  end
end

class GuessTagForTweet < HashTagsQuestion
  def generate
    if tweets = tweet_sample(3) {|_| _.hash_tags.size == 1 }
      new_question(tweets.first,
        "Guess the missing hash tag.",
        "\"#{tweets.first.text_without_hash_tags}\"",
        tweets.map {|_| _.hash_tags.first })
    end
  end
end

class GuessTweetForTag < HashTagsQuestion
  def generate
    if tweets = tweet_sample(3) {|_| _.hash_tags.size == 1 and _.text.size <= 70 }
      new_question(tweets.first,
        "Which tweet does this hash tag go with?",
        tweets.first.hash_tags.first,
        tweets.map {|_| _.text_without_hash_tags })
    end
  end
end

class HasMoreFollowers < TrueFalseQuestion
  def generate
    if tweets = tweet_sample(2)
      true_false_question(tweets.first,
        "@#{tweets.first.screen_name} has more followers than @#{tweets.last.screen_name}",
        tweets.first.follower_count > tweets.last.follower_count)
    end
  end
end

class HasMoreTweets < TrueFalseQuestion
  def generate
    if tweets = tweet_sample(2)
      true_false_question(tweets.first,
        "@#{tweets.first.screen_name} has more tweets than @#{tweets.last.screen_name}",
        tweets.first.tweet_count > tweets.last.tweet_count)
    end
  end
end

class GuessLocationOfTweet < LocationQuestion
  def generate
    if tweets = tweet_sample(3) {|_| !_.location.empty? }
      new_question(tweets.first,
        "Guess the location of this tweet.",
        "\"#{tweets.first.text}\"",
        tweets.map {|_| _.location })
    end
  end
end

class GuessLanguageOfTweet < LocationQuestion
  def generate
    if tweets = tweet_sample_uniq(3) {|_| _.lang }
      new_question(tweets.first,
        "Guess the language of this tweet.",
        "\"#{tweets.first.text}\"",
        tweets.map {|_| _.language.name })
    end
  end
end

class GuessPicForTweet < PicturesQuestion
  def generate
    if tweets = tweet_sample(3) {|_| _.has_profile_image? and _.text.size <= 70 }
      new_question(tweets.first,
        "Which avatar goes with this tweet?",
        "\"#{tweets.first.text}\"",
        tweets.map {|_| _.profile_image_url })
    end
  end
end

class GuessTweetForPic < PicturesQuestion
  def generate
    if tweets = tweet_sample(3) {|_| _.has_profile_image? }
      new_question(tweets.first,
        tweets.first.profile_image_url,
        "Which tweet goes with this avatar?",
        tweets.map {|_| _.text })
    end
  end
end

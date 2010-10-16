require File.expand_path('../question_type', __FILE__)

class HowManyTweets < QuestionType
  def generate
    if tweets = tweets_with_counts(3) {|_| _.tweet_count }
      new_question(tweets.first,
        "How many times has #{tweets.first.screen_name} tweeted?",
        tweets.map {|_| _.tweet_count.to_s })
    end
  end
end

class HowManyCharacters < QuestionType
  def generate
    if tweets = tweets_with_counts(3) {|_| _.text.size }
      new_question(tweets.first,
        "#{tweets.first.text}\n\nHow many characters are in this tweet?",
        tweets.map {|_| _.text.size.to_s })
    end
  end
end

class HowManyFollowers < QuestionType
  def generate
    if tweets = tweets_with_counts(3) {|_| _.follower_count }
      new_question(tweets.first,
        "How many followers does #{tweets.first.screen_name} have?",
        tweets.map {|_| _.follower_count.to_s })
    end
  end
end

class HowManyRetweets < QuestionType
  def generate
    if tweets = tweets_with_counts(3) {|_| _.retweet_count }
      new_question(tweets.first,
        "#{tweets.first.text}\n\nHow many times was this retweeted?",
        tweets.map {|_| _.retweet_count.to_s })
    end
  end
end

class GuessTagForTweet < QuestionType
  def generate
    if tweets = tweet_sample(3) {|_| _.hash_tags.size == 1 }
      new_question(tweets.first,
        "#{tweets.first.text_without_hash_tags}\n\nGuess the missing hash tag",
        tweets.map {|_| _.hash_tags.first })
    end
  end
end

class GuessTweetForTag < QuestionType
  def generate
    if tweets = tweet_sample(3) {|_| _.hash_tags.size == 1 }
      new_question(tweets.first,
        "#{tweets.first.hash_tags.first}\n\nWhich tweet does this hash tag go with?",
        tweets.map {|_| _.text_without_hash_tags })
    end
  end
end

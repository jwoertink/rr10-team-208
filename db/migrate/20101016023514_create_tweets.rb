class CreateTweets < ActiveRecord::Migration
  def self.up
    create_table :tweets do |t|
      t.string :screen_name, :limit => 20
      t.string :text, :limit => 140
      t.integer :tweet_count
      t.integer :follower_count
      t.integer :retweet_count
      t.timestamps
    end
  end

  def self.down
    drop_table :tweets
  end
end

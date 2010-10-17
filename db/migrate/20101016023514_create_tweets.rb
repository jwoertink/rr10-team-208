class CreateTweets < ActiveRecord::Migration
  def self.up
    create_table :tweets do |t|
      t.integer :status_id,       :limit => 8
      t.string  :screen_name,     :limit => 20
      t.string  :text,            :limit => 140
      t.string  :lang,            :limit => 2
      t.string  :location
      t.string  :profile_image_url
      t.integer :tweet_count,     :default => 0,  :null => false
      t.integer :follower_count,  :default => 0,  :null => false
      t.integer :retweet_count,   :default => 0,  :null => false
      t.datetime :joined_at
      t.boolean :verified_user
      t.timestamps
    end
  end

  def self.down
    drop_table :tweets
  end
end

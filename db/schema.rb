# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20101017010507) do

  create_table "languages", :force => true do |t|
    t.string   "code",       :limit => 2
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "psas", :force => true do |t|
    t.text     "text"
    t.integer  "weight"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "questions", :force => true do |t|
    t.string   "category"
    t.text     "heading"
    t.text     "content"
    t.text     "correct_answer"
    t.text     "incorrect_answers"
    t.string   "profile_image_url"
    t.integer  "value"
    t.integer  "countdown"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rules", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tweets", :force => true do |t|
    t.string   "screen_name",       :limit => 20
    t.string   "text",              :limit => 140
    t.string   "lang",              :limit => 2
    t.string   "location"
    t.string   "profile_image_url"
    t.integer  "tweet_count",                      :default => 0, :null => false
    t.integer  "follower_count",                   :default => 0, :null => false
    t.integer  "retweet_count",                    :default => 0, :null => false
    t.datetime "joined_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end

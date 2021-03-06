class CreateQuestions < ActiveRecord::Migration
  def self.up
    create_table :questions do |t|
      t.string :category
      t.text :heading
      t.text :content
      t.text :correct_answer
      t.text :incorrect_answers
      t.string :profile_image_url
      t.text :profile_image_urls
      t.integer :value
      t.integer :countdown
      t.timestamps
    end
  end

  def self.down
    drop_table :questions
  end
end

class CreateQuestions < ActiveRecord::Migration
  def self.up
    create_table :questions do |t|
      t.text :category
      t.text :content
      t.text :correct_answer
      t.text :incorrect_answers
      t.integer :value
      t.integer :countdown
      t.timestamps
    end
  end

  def self.down
    drop_table :questions
  end
end

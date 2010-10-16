class QuestionsController < ApplicationController
  respond_to :json
  
  def new
    respond_with(
        {:questions => [
          {
            :content => "What is blah blah blah?",
            :answers => ["Answer A",  "Answer B", "Answer C"],
            :selection => "0",
            :value => 15,
            :countdown => 20
          },
          {
            :content => "Where is blah blah blah?",
            :answers => ["Answer A",  "Answer B", "Answer C"],
            :selection => "1",
            :value => 10,
            :countdown => 15
          },
          {
            :content => "How does blah blah blah?",
            :answers => ["Answer A",  "Answer B", "Answer C"],
            :selection => "2",
            :value => 5,
            :countdown => 5
          },
          {
            :content => "When will there be a blah blah?",
            :answers => ["Answer A",  "Answer B", "Answer C"],
            :selection => "0",
            :value => 1,
            :countdown => 5
          }
        ]}.to_json
    )
  end
  
end

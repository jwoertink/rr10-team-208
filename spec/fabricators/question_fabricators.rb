Fabricator(:question) do
  content 'which one?'
  correct_answer 'this one'
  incorrect_answers ['not this one', 'or this one']
  value 15
  countdown 20
end

require "csv"

CSV.parse(File.read(File.join(Rails.root, "db", "data", "psas.csv")), :headers => true) do |row|
  Psa.create!(
    :weight => row["weight"],
    :text => row["text"])
end

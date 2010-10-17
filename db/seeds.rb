require "csv"

CSV.parse(File.read(File.join(Rails.root, "db", "data", "psas.csv")), :headers => true) do |row|
  Psa.create!(
    :weight => row["weight"],
    :text => row["text"])
end
    
CSV.parse(File.read(File.join(Rails.root, "db", "data", "ISO_639.csv")), :headers => true) do |row|
  Language.create!(
    :code => row["code"],
    :name => row["name"])

end

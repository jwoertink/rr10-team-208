class CreatePsas < ActiveRecord::Migration
  def self.up
    create_table :psas do |t|
      t.text :text
      t.integer :weight

      t.timestamps
    end
  end

  def self.down
    drop_table :psas
  end
end

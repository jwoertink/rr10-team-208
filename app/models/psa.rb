class Psa < ActiveRecord::Base
  validates_presence_of :text
  validates_presence_of :weight

  scope :random, order("(RAND() * weight)")
end

require 'spec_helper'

describe Psa do
  it { should validate_presence_of(:text) }
  it { should validate_presence_of(:weight) }
end

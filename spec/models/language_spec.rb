require 'spec_helper'

describe Language do
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:code) }end

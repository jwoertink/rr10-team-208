require 'spec_helper'

describe WelcomeController do
  subject { controller }

  describe "index", "get" do
    before do
      get "index"
    end

    it { should respond_with(:success) }
  end
end

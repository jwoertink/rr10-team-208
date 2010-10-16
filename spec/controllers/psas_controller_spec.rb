require 'spec_helper'

describe PsasController do
  subject { controller }

  describe "when request is for :json" do
    describe "random", "get" do
      before do
        get "random", :format => :json
      end

      it { should respond_with(:success) }
    end
  end
end

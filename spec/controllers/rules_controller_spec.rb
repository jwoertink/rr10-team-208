require 'spec_helper'

describe RulesController do
  subject { controller }

  describe "when request is for :json" do
    describe "index", "get" do
      before do
        get "index", :format => :json
      end

      it { should respond_with(:success) }
    end
  end
  
  describe "when request is for :json" do
    describe "new", "get" do
      before do
        get "new", :format => :json
      end

      it { should respond_with(:success) }
    end
  end
  
  describe "when request is for :json" do
    describe "create", "get" do
      before do
        get "create", :format => :json
      end

      it { should respond_with(:success) }
    end
  end
  
  describe "when request is for :json" do
    describe "edit", "get" do
      let(:rule){Fabricate(:rule)}
      before do
        get "edit", :id => rule.id, :format => :json
      end

      it { should respond_with(:success) }
    end
  end
  
  describe "when request is for :json" do
    describe "update", "put" do
      let(:rule){Fabricate(:rule)}
      before do
        put "update", :id => rule.id, :format => :json
      end

      it { should respond_with(:success) }
    end
  end
  
  describe "when request is for :json" do
    describe "destroy", "delete" do
      let(:rule){Fabricate(:rule)}
      before do
        delete "destroy", :id => rule.id, :format => :json
      end

      it { should respond_with(:success) }
    end
  end
  
end

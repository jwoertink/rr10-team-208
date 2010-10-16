require "spec_helper"

describe RulesController do
  describe "routing" do

    it "recognizes and generates #index" do
      { :get => "/rules" }.should route_to(:controller => "rules", :action => "index")
    end

    it "recognizes and generates #new" do
      { :get => "/rules/new" }.should route_to(:controller => "rules", :action => "new")
    end

    it "recognizes and generates #show" do
      { :get => "/rules/1" }.should route_to(:controller => "rules", :action => "show", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/rules/1/edit" }.should route_to(:controller => "rules", :action => "edit", :id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/rules" }.should route_to(:controller => "rules", :action => "create")
    end

    it "recognizes and generates #update" do
      { :put => "/rules/1" }.should route_to(:controller => "rules", :action => "update", :id => "1")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/rules/1" }.should route_to(:controller => "rules", :action => "destroy", :id => "1")
    end

  end
end

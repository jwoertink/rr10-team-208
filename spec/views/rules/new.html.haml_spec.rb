require 'spec_helper'

describe "rules/new.html.haml" do
  before(:each) do
    assign(:rule, stub_model(Rule,
      :name => "MyString",
      :description => "MyString"
    ).as_new_record)
  end

  it "renders new rule form" do
    render

    # Run the generator again with the --webrat-matchers flag if you want to use webrat matchers
    assert_select "form", :action => rules_path, :method => "post" do
      assert_select "input#rule_name", :name => "rule[name]"
      assert_select "input#rule_description", :name => "rule[description]"
    end
  end
end

require 'spec_helper'

describe "rules/edit.html.haml" do
  before(:each) do
    @rule = assign(:rule, stub_model(Rule,
      :new_record? => false,
      :name => "MyString",
      :description => "MyString"
    ))
  end

  it "renders the edit rule form" do
    render

    # Run the generator again with the --webrat-matchers flag if you want to use webrat matchers
    assert_select "form", :action => rule_path(@rule), :method => "post" do
      assert_select "input#rule_name", :name => "rule[name]"
      assert_select "input#rule_description", :name => "rule[description]"
    end
  end
end

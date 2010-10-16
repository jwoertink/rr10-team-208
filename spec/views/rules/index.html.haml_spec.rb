require 'spec_helper'

describe "rules/index.html.haml" do
  before(:each) do
    assign(:rules, [
      stub_model(Rule,
        :name => "Name",
        :description => "Description"
      ),
      stub_model(Rule,
        :name => "Name",
        :description => "Description"
      )
    ])
  end

  it "renders a list of rules" do
    render
    # Run the generator again with the --webrat-matchers flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Name".to_s, :count => 2
    # Run the generator again with the --webrat-matchers flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Description".to_s, :count => 2
  end
end

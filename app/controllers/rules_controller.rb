class RulesController < ApplicationController
  respond_to :json

  def index
    respond_with(@rules = Rule.all)
  end

  def new
    respond_with(@rule  = Rule.new)
  end

  def create
    respond_with(@rule  = Rule.create(params[:user]))
  end

  def edit
    respond_with(@rule  = Rule.find(params[:id]))
  end

  def update
    @rule               = Rule.find(params[:id])
    @rule.update_attributes(params[:user])
    respond_with(@rule)
  end

  def destroy
    @rule               = Rule.find(params[:id])
    @rule.destroy
    respond_with(@rule)
  end
end

class PsasController < ApplicationController
  respond_to :json

  def random
    _ = Psa.random.first
    _[:previous_question] = params[:previousQuestion]
    respond_with(_)
  end
end

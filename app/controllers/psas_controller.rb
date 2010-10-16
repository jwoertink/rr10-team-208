class PsasController < ApplicationController
  respond_to :json

  def random
    respond_with(Psa.random.first, :only => [ :text ])
  end
end

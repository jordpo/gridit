class BillsController < ApplicationController
  def index
    @bills = Bill.order(bill_period: :desc)
    render json: @bills
  end

  def create
    @bill = Bill.new(bill_params)
    if @bill.save
      render json: @bill
    else
      render json: {error: @bill.errors.full_messages.join(', ')}
    end
  end


  private
  def bill_params
    params.require(:bill).permit(:actual, :bill_period, :heat, :a_c, :utility)
  end
end

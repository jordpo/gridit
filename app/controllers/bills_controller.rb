class BillsController < ApplicationController
  def index
    @bills = Bill.order(bill_period: :desc)
    render json: @bills
  end

  def create
    @bill = Bill.new(bill_params)
    if @bill.save
      if @bill.prior
        @predicted = Bill.new(
          bill_period: @bill.bill_period + 1.months,
          prior: false,
          utility: @bill.utility
          )
        @predicted.predict!
        @predicted.save
      end
      render json: @bill
    else
      render json: {error: @bill.errors.full_messages.join(', ')}
    end
  end

  private
  def bill_params
    params.require(:bill).permit(:actual, :bill_period, :prior, :utility)
  end
end

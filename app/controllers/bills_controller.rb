class BillsController < ApplicationController
  def index
    @bills = Bill.order(bill_period: :desc)
    render json: @bills
  end

  def create
    @bill = Bill.new(bill_params)
    if @bill.save
      if @bill.prior
        # create a new bill for the proceeding month as well
        @predicted = Bill.new(
          bill_period: @bill.bill_period + 1.months,
          prior: false,
          utility: @bill.utility
          )
        @predicted.predict!
        @predicted.save
        render json: {bills: {bill: @bill, predicted: @predicted}}
      else
        # or just return the newly saved bill
        render json: {bills: {bill: @bill}
      end
    else
      render json: {error: @bill.errors.full_messages.join(', ')}
    end
  end

  private
  def bill_params
    params.require(:bill).permit(:actual, :bill_period, :prior, :utility)
  end
end

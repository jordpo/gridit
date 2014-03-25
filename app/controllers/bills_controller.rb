class BillsController < ApplicationController
  def index
    @bills = current_user.bills.order(bill_period: :desc)
    respond_to do |f|
      f.html
      f.json { render @bills }
    end
  end

  def create
    @bill = Bill.new(bill_params)
    @bill.user = current_user
    # Get the avg temp for the month
    @bill.get_temp(current_user.city, current_user.state)
    if @bill.save
      if @bill.prior? && current_user.ready?(@bill.utility)
        # create a new bill for the proceeding month as well
        @predicted = Bill.new(
          bill_period: @bill.bill_period + 1.months,
          utility: @bill.utility,
          user: current_user
          )
        @predicted.get_temp(current_user.city, current_user.state)
        # Model method to calculate and assigned predicted amount
        @predicted.predict!
        @predicted.save
        render json: {bill: @bill, predicted: @predicted}
      else
        # or just return the newly saved bill
        render json: {bill: @bill}
      end
    else
      render json: {error: @bill.errors.full_messages.join(', ')}
    end
  end

  private
  def bill_params
    params.require(:bill).permit(:amount, :bill_period, :utility)
  end
end

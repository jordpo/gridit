class DashboardController < ApplicationController
  def index
    if user_signed_in?
      bills = current_user.bills.order(bill_period: :desc)
      @electric = bills.select { |x| x.utility == 'electric' }
      @gas = bills.select { |x| x.utility == 'gas' }
    end
  end
end

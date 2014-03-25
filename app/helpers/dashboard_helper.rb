module DashboardHelper
  def to_predict?(bills)
    bills.each do |bill|
      if bill.bill_period.month == Date.today.month &&
        bill.prediction
        return false
      end
    end
    return true
  end
end

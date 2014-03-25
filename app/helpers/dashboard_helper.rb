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

  def no_current_actual?(bills)
    bills.each do |bill|
      if bill.bill_period.month == Date.today.month - 1 &&
        !bill.prediction
        return false
      end
    end
    return true
  end
end

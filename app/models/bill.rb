# == Schema Information
#
# Table name: bills
#
#  id          :integer          not null, primary key
#  utility     :string(255)
#  amount      :float            default(0.0)
#  bill_period :datetime
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#  temperature :integer
#  prediction  :boolean          default(FALSE)
#

class Bill < ActiveRecord::Base
  belongs_to :user
  validates :amount, presence: true
  validates :bill_period, presence: true
  validates :temperature, presence: true

  def get_temp(city, state)
    response = HTTParty.get("http://api.wunderground.com/api/#{ENV['WUNDERGROUND_API_KEY']}/planner_#{dateRange}/q/#{state}/#{city}.json")
    high_temp = response["trip"]["temp_high"]["avg"]["F"].to_i
    low_temp = response["trip"]["temp_low"]["avg"]["F"].to_i
    self.temperature = (high_temp + low_temp) / 2
  end

  def dateRange
    month = bill_period.month
    if month < 10
      "0#{month}010#{month}30"
    else
      "#{month}01#{month}30"
    end
  end

  def predict!
    bills = Bill.where(user: user, utility: utility, prediction: false)
    y_array = bills.map(&:amount)
    x_array = bills.map(&:temperature)
    trend_line = LinearRegression.new(x_array, y_array)
    # Y intercept and slope
    b = trend_line.y_intercept
    m = trend_line.slope
    # Use the prior amount to calculate future one
    self.amount = temperature * m + b
    self.bill_period = Date.today
    self.prediction = true
  end

  def prior?
    month = Time.now.month
    year = Time.now.year
    bill_period.month == (month - 1) && bill_period.year == year
  end
end

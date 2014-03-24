# == Schema Information
#
# Table name: bills
#
#  id          :integer          not null, primary key
#  utility     :string(255)
#  actual      :integer
#  predicted   :integer
#  bill_period :datetime
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#  prior       :boolean
#  city        :string(255)
#  state       :string(255)
#

class Bill < ActiveRecord::Base
  belongs_to :user

  def get_temp(city, state)
    response = HTTParty.get("http://api.wunderground.com/api/#{ENV['WUNDERGROUND_API_KEY']}/planner_#{dateRange}/q/#{state}/#{city}.json")
    high_temp = response["trip"]["temp_high"]["avg"]["F"].to_i
    low_temp = response["trip"]["temp_low"]["avg"]["F"].to_i
    avg_temp = (high_temp + low_temp) / 2
  end

  def dateRange
    month = bill_period.month
    if month < 10
      "0#{month}010#{month}30"
    else
      "#{month}01#{month}30"
    end
  end

end

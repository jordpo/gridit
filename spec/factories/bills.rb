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

FactoryGirl.define do
  factory :gas, class: Bill do
    utility 'gas'
    amount { Faker::Number::digit.to_i * 8.5 }
    bill_period Date.today
    temperature 30
    association :user
  end

  factory :electric, class: Bill do
    utility 'electric'
    amount { Faker::Number::digit.to_i * 8.5 }
    bill_period Date.today
    temperature 30
    association :user
  end
end

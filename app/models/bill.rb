# == Schema Information
#
# Table name: bills
#
#  id          :integer          not null, primary key
#  utility     :string(255)
#  actual      :integer
#  predicted   :integer
#  bill_period :datetime
#  heat        :boolean
#  a_c         :boolean
#  user_id     :integer
#  created_at  :datetime
#  updated_at  :datetime
#

class Bill < ActiveRecord::Base
  belongs_to :user
end

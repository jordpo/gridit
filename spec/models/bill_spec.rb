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
#  prior       :boolean
#  temperature :integer
#  prediction  :boolean          default(FALSE)
#

require 'spec_helper'

describe Bill do
  pending "add some examples to (or delete) #{__FILE__}"
end

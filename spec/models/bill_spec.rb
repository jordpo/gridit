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

require 'spec_helper'

describe Bill do
  pending "add some examples to (or delete) #{__FILE__}"
end

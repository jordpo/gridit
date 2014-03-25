# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string(255)      default(""), not null
#  encrypted_password     :string(255)      default(""), not null
#  reset_password_token   :string(255)
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string(255)
#  last_sign_in_ip        :string(255)
#  confirmation_token     :string(255)
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string(255)
#  created_at             :datetime
#  updated_at             :datetime
#  city                   :string(255)
#  state                  :string(255)
#

require 'spec_helper'
require 'pry'
describe User do
  before :each do
    @jord = FactoryGirl.create(:user)
    3.times { FactoryGirl.create(:gas, user: @jord) }
    2.times { FactoryGirl.create(:electric, user: @jord) }
  end
  describe '#ready?' do
    it 'returns true if the user has 3 or more of bills' do
      expect(@jord.ready?('gas')).to eq true
      expect(@jord.ready?('electric')).to eq false
    end
  end
end

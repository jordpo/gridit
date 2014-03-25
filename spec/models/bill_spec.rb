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

require 'spec_helper'
require 'pry'

describe Bill do
  before :each do
    @jord = FactoryGirl.create(:user)
    @gas1 = FactoryGirl.create(:gas, amount: 12.04, bill_period: Date.new(2013, 8, 01), user: @jord, temperature: 72)
    @gas2 = FactoryGirl.create(:gas, amount: 70.42, bill_period: Date.new(2013, 11, 01), user: @jord, temperature: 43)
    @gas3 = FactoryGirl.create(:gas, amount: 104.09, bill_period: Date.new(2013, 12, 01), user: @jord, temperature: 34)
    @gas4 = FactoryGirl.create(:gas, amount: 124.25, bill_period: Date.new(2014, 01, 01), user: @jord, temperature: 28)
    @gas5 = FactoryGirl.create(:gas, amount: 118.46, bill_period: Date.new(2014, 02, 01), user: @jord, temperature: 29)
    @predict = FactoryGirl.build(:gas, user: @jord, temperature: 38)
    @predict.predict!
    @predict.save
  end
  describe '#dateRange' do
    it 'returns a string of mm01mm30 where mm is the month of bill_period' do
      expect(@gas1.dateRange).to eq '08010830'
      expect(@gas5.dateRange).to eq '02010230'
    end
  end
  describe '#predict!' do
    it 'assign_attributes on a bill object, both prediction:boolean and predicted amount' do
      expect(@predict.prediction).to eq true
      expect(@predict.bill_period).to eq Date.today
      expect(@predict.amount).to be_within(5).of(90)
    end
  end

  describe '#get_temp' do
    it 'returns the avg monthly temperature for a given month' do
      stub_request(:get, /.*api.wunderground.com.*/).to_return(body: JSON.parse(File.read("#{Rails.root}/spec/weather.json")))
      response = HTTParty.get("http://api.wunderground.com/api/#{ENV['WUNDERGROUND_API_KEY']}/planner_#{@predict.dateRange}/q/#{@jord.state}/#{@jord.city}.json")
      high_temp = response.body["trip"]["temp_high"]["avg"]["F"].to_i
      low_temp = response.body["trip"]["temp_low"]["avg"]["F"].to_i
      avg = (high_temp + low_temp) / 2
      expect(avg).to eq 38
    end
  end

  describe '#prior' do
    it 'returns true or false depending on whether bill is from prior month to today' do
      expect(@gas1.prior?).to eq false
      expect(@gas5.prior?).to eq true
    end
  end
end

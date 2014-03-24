require 'spec_helper'

feature 'Bill Predict' do
  background do
    @user = FactoryGirl.create(:user)
  end

  scenario 'visitor enters electric and gas bills', :js do
    visit root_path
    sign_in_as(@user)
    expect(page).to have_content "Electric Bill"
    expect(page).to have_content "Gas Bill"
    # fill_in "Last Month's Electric Bill", with: 40
    # fill_in "Electric Bill Period", with: '03/01/2014'
    # fill_in "Last Month's Gas Bill", with: 140
    # fill_in "Gas Bill Period", with: '03/01/2014'
  end

end

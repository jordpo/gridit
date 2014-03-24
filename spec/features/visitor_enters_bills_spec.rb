require 'spec_helper'

feature 'Bill Predict' do
  background do
    @user = FactoryGirl.create(:user)
  end

  scenario 'visitor enters electric and gas bills', :js do
    visit root_path
    fill_in 'Previous Electric Bill', with: 40
    fill_in 'Previous Gas Bill', with: 110
    click_button 'Predict'
    expect(page).to have_content "You're next month's bills are"
  end

end

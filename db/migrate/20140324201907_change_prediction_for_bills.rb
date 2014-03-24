class ChangePredictionForBills < ActiveRecord::Migration
  def change
    change_column :bills, :prediction, :boolean, default: false
  end
end

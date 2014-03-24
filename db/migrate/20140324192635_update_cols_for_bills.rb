class UpdateColsForBills < ActiveRecord::Migration
  def change
    rename_column :bills, :actual, :amount
    remove_column :bills, :predicted
    add_column :bills, :prediction, :boolean
  end
end

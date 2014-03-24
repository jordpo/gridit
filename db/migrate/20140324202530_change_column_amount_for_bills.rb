class ChangeColumnAmountForBills < ActiveRecord::Migration
  def change
    change_column :bills, :amount, :float, default: 0
  end
end

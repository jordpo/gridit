class RemovePriorFromBills < ActiveRecord::Migration
  def change
    remove_column :bills, :prior, :boolean
  end
end

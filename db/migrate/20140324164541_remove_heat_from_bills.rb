class RemoveHeatFromBills < ActiveRecord::Migration
  def change
    remove_column :bills, :heat, :boolean
    remove_column :bills, :a_c, :boolean
  end
end

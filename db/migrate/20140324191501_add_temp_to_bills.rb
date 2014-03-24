class AddTempToBills < ActiveRecord::Migration
  def change
    add_column :bills, :temperature, :integer
  end
end

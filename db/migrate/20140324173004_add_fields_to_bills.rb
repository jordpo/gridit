class AddFieldsToBills < ActiveRecord::Migration
  def change
    add_column :bills, :prior, :boolean
    add_column :users, :city, :string
    add_column :users, :state, :string
  end
end

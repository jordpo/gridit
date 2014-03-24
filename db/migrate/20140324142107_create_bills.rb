class CreateBills < ActiveRecord::Migration
  def change
    create_table :bills do |t|
      t.string :utility
      t.integer :actual
      t.integer :predicted
      t.datetime :bill_period
      t.boolean :heat
      t.boolean :a_c
      t.references :user, index: true

      t.timestamps
    end
  end
end

class CreateAssigments < ActiveRecord::Migration[7.0]
  def change
    create_table :assigments do |t|
      t.references :project, null: false, foreign_key: true
      t.references :developer, null: false, foreign_key: true

      t.timestamps
    end
  end
end

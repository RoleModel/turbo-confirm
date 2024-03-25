class CreateTodos < ActiveRecord::Migration[7.1]
  def change
    create_table :todos do |t|
      t.string :title
      t.text :body
      t.boolean :done

      t.timestamps
    end
  end
end

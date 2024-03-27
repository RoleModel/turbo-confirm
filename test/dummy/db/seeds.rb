# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

Todo.create(title: "Buy milk", done: true, body: "Need to buy milk from the store")
Todo.create(title: "Release v2.0.0", done: false, body: "And don't forget to Tweet about it!")
Todo.create(title: "Another Todo", done: true, body: "blah blah blah")
Todo.create(title: "one more", done: false, body: "blah blah blah blah")

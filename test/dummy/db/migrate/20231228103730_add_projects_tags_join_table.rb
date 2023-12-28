class AddProjectsTagsJoinTable < ActiveRecord::Migration[7.0]
  def change
    create_join_table :projects, :tags
  end
end

class Project < ApplicationRecord
    has_and_belongs_to_many :tags
    accepts_nested_attributes_for :tags
    
    has_many :assigments
    has_many :developers, through: :assigments
    accepts_nested_attributes_for :developers
end

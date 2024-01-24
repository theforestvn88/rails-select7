class Developer < ApplicationRecord
    has_many :assigments
    has_many :projects, through: :assigments
end

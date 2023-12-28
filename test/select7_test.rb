require "test_helper"

class Select7Test < ApplicationSystemTestCase
    test "visiting the index" do
        visit("/")
        expect(page).to have_content 'Select7'
    end
end
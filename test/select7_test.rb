require "test_helper"

class Select7Test < ApplicationSystemTestCase
    test "search local from options_for_select" do
        visit("/projects")

        fill_in placeholder: "search by tags", with: "Rails"

        assert_text "Ruby on Rails"
        assert_no_text "Javscript"
    end
end
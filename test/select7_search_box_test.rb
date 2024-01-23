require "test_helper"

class Select7SearchBoxTest < ApplicationSystemTestCase
    setup do
        
    end

    test "search projects by select7 tags" do
        projects(:one).tags.clear
        projects(:one).tags << tags(:one)
        projects(:two).tags.clear
        projects(:two).tags << tags(:two)
        projects(:three).tags.clear
        projects(:three).tags << tags(:three)

        visit("/projects")

        assert_text "Project1"
        assert_text "Project2"
        assert_text "Project3"

        find("input[data-select7-target='input']").set "Ruby"
        find("div[class='select7-option-item']", exact_text: "Ruby").click
        find("input[data-select7-target='input']").set "Ruby"
        find("div[class='select7-option-item']", exact_text: "Ruby on Rails").click

        find("input[type='submit']").click

        assert_text "Project1"
        assert_text "Project2"
        assert_no_text "Project3"

        find("span[data-action='click->select7#removeTag']", match: :first).click
        find("input[type='submit']").click

        assert_no_text "Project1"
        assert_text "Project2"
        assert_no_text "Project3"
    end
end
require "test_helper"

class Select7InFormTest < ApplicationSystemTestCase
    test "create project with select7 tags" do
        visit("/projects")
        click_link "New project"
        
        find("input[data-select7-target='input']").set "Ruby"
        find("div[class='select7-option-item']", exact_text: "Ruby").click

        find("input[data-select7-target='input']").set "Ruby"
        find("div[class='select7-option-item']", exact_text: "Ruby on Rails").click

        find("input[data-select7-target='input']").set "Javascript"
        find("div[class='select7-option-item']", exact_text: "Javascript").click
        all("span[data-action='click->select7#removeTag']").last.click

        find("input[type='submit']").click

        assert_text "Ruby on Rails"
        assert_text "Ruby"
        assert_no_text "Javascript"

        assert_equal ["Ruby", "Ruby on Rails"], Project.last.tags.map(&:name)
    end

    test "update Project with selct7 tags" do
        project = projects(:one)
        project.tags.clear

        visit("/projects")
        click_link("#{project.title}", match: :first)
        click_link("Edit this project")
        
        # all("span[data-action='click->select7#removeTag']").map(&:click)

        find("input[data-select7-target='input']").set "Javascript"
        find("div[class='select7-option-item']", exact_text: "Javascript").click

        find("input[data-select7-target='input']").set "Ruby"
        find("div[class='select7-option-item']", exact_text: "Ruby").click

        find("input[type='submit']").click

        assert_equal ["Javascript", "Ruby"], project.reload.tags.map(&:name)

        # remove tag
        click_link("Edit this project")
        find("span[data-action='click->select7#removeTag']", match: :first).click
        find("input[type='submit']").click

        assert_equal ["Ruby"], project.reload.tags.map(&:name)
    end

    test "should not allow duplicate tags" do
        visit("/projects")
        click_link "New project"
        
        find("input[data-select7-target='input']").set "Ruby"
        find("div[class='select7-option-item']", exact_text: "Ruby").click

        find("input[data-select7-target='input']").set "Ruby"
        find("div[class='select7-option-item']", exact_text: "Ruby").click

        find("input[type='submit']").click
        assert_equal ["Ruby"], Project.last.tags.map(&:name)
    end
end
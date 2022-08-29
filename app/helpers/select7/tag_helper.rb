module Select7::TagHelper
    def select7_tag(name, option_tags = [], selected_tags = [], suggest_path = nil, **attributes)
        attributes.reverse_merge!(multiple: true)
        render partial: "select7/tag", locals: { name: name, option_tags: option_tags, suggest_path: suggest_path, selected_tags: selected_tags, **attributes }
    end

    def select7_item_tag(id, content = nil)
        render partial: "select7/item", locals: {id: id, content: content || yield.html_safe }
    end
end

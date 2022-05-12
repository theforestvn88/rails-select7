module Select7::TagHelper
    def select7_tag(name, option_tags = [], selected_tags = [], suggest_path = nil, **attributes)
        render partial: "select7/list", locals: { name: name, option_tags: option_tags, suggest_path: suggest_path, selected_tags: selected_tags, **attributes }
    end
end

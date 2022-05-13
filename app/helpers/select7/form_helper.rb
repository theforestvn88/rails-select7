module Select7::FormHelper
    class ActionView::Helpers::FormBuilder
        def select7(name, option_tags = [], selected_tags = [], suggest_path = nil, **attributes)
            @template.select7_tag("#{@object_name}[#{name}]", option_tags, selected_tags, suggest_path, **attributes)
        end
    end
end

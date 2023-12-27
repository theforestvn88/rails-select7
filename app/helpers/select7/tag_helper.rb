module Select7::TagHelper
    def select7_tag(name, option_items = [], selected_items: [], suggest: {}, **attributes)
        option_items.map! {|(value, text)| [value, text, text.downcase] }
        attributes.reverse_merge!(css: {}, multiple: true, nested_attributes: nil)
        attributes[:input_name] ||= "#{name}" + (attributes[:multiple] ? "[]" : "")

        @template.render partial: "select7/field", 
            locals: { 
                field: name,
                selected_items: selected_items, 
                option_items: option_items, 
                suggest: suggest || {}, 
                **attributes 
            }
    end

    def select7_item_tag(id, content = nil)
        render partial: "select7/item", locals: {id: id, content: content || yield.html_safe }
    end


    # TODO: ADD SEARCH BOX
    # form_with(search_url)
    #    f.select7(...)


    # TODO: ADD FILTER BOX
    # div stimulus-controller action=select7-changed->call filter submit
    #  form_with(filter_url)
    #    f.select7(...)
    # /div
end

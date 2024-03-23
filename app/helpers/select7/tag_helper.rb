module Select7::TagHelper
    def select7_tag(options: [], selecteds: [], suggest: {}, **attributes)
        field, (value_attr, text_attr) = attributes.first
        options_for_select = options.map { |item| 
            [item.send(value_attr), item.send(text_attr), item.send(text_attr).downcase] 
        }
        attributes.reverse_merge!(css: {}, multiple: true, nested_attributes: nil)
        attributes[:input_name] ||= "#{field.to_s.singularize}_#{value_attr}"

        (@template || self).render partial: "select7/field", 
            locals: { 
                field: field,
                value_attr: value_attr,
                text_attr: text_attr,
                selected_items: selecteds, 
                option_items: options_for_select, 
                suggest: suggest || {}, 
                **attributes 
            }
    end

    def select7_item_tag(id, content = nil)
        render partial: "select7/item", locals: {id: id, content: content || yield.html_safe }
    end
end

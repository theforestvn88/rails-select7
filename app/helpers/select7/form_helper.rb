module Select7::FormHelper
    class ActionView::Helpers::FormBuilder
        def select7(field, option_items = [], selected_items: [], suggest: {}, **attributes)
            option_items.map! {|(value, text)| [value, text, text.downcase] }
            attributes.reverse_merge!(css: {}, multiple: true)

            @template.render partial: "select7/form_field", 
                locals: { scope: @object_name, field: field,  selected_items: selected_items, option_items: option_items, suggest: suggest || {}, **attributes }
        end

        def select7_fields_for(record_name, field, option_items = [], selected_items: [], suggest: {}, **attributes)
            option_items.map! {|(value, text)| [value, text, text.downcase] }

            nested_attributes = nested_attributes_association?(record_name)
            association =  nested_attributes ? "#{record_name}_attributes" : record_name
            scope = "#{@object_name}[#{association}]"

            attributes.reverse_merge!(css: {}, multiple: true)

            @template.render partial: "select7/form_field", 
                locals: { 
                    scope: scope,
                    field: field,
                    nested_attributes: nested_attributes,
                    selected_items: selected_items,
                    option_items: option_items,
                    suggest: suggest || {},
                    **attributes 
                }
        end
    end
end

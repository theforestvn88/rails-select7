module Select7::FormHelper
    class ActionView::Helpers::FormBuilder
        def select7(name, option_items = [], selected_items = [], suggest_path = nil, **attributes)
            option_items.map! {|(id, name)| [id, name, name.downcase] }
            attributes.reverse_merge!(css: {}, multiple: true)
            
            @template.render partial: "select7/form_field", 
                locals: { scope: @object_name, field: name,  selected_items: selected_items, option_items: option_items, suggest_path: suggest_path, **attributes }
        end

        def select7_fields_for(record_name, field, option_items: [], selected_items: [], suggest_path: nil, **attributes)
            option_items.map! {|(id, name)| [id, name, name.downcase] }

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
                    suggest_path: suggest_path,
                    **attributes 
                }
        end
    end
end

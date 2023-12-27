module Select7::FormHelper
    class ActionView::Helpers::FormBuilder
        include Select7::TagHelper

        def select7(field_hash, options_for_select: [], selected_items: [], suggest: {}, multiple: true, **attributes)
            field, (value_attr, text_attr) = field_hash.first

            if scope = @object_name
                input_name = "#{scope}[#{field.to_s.singularize}_#{value_attr}#{multiple ? 's' : ''}]" + (multiple ? "[]" : "")
            else
                input_name = "#{field.to_s.singularize}_#{value_attr}" + (multiple ? "s[]" : "")
            end
            
            if @object
                selected_items = @object.send(field).map {|item| [item.send(value_attr), item.send(text_attr), item.send(text_attr).downcase] }
            end

            select7_tag(
                field, 
                options_for_select, 
                selected_items: selected_items, 
                suggest: suggest, 
                scope: @object_name, 
                input_name: input_name,
                **attributes
            )
        end

        # TODO: REMOVE IF NO USECASE
        # def select7_fields_for(record_name, field = "id", option_items: [], selected_items: [], suggest: {}, **attributes)
        #     nested_attributes = nested_attributes_association?(record_name)
        #     association = nested_attributes ? "#{record_name}_attributes" : record_name
        #     scope = "#{@object_name}[#{association}]"
        #     input_name = "#{scope}[?][#{field}]"

        #     select7_tag(
        #         field, 
        #         option_items, 
        #         selected_items: selected_items, 
        #         suggest: suggest, 
        #         scope: scope, 
        #         input_name: input_name,
        #         nested_attributes: nested_attributes,
        #         **attributes
        #     )
        # end
    end
end

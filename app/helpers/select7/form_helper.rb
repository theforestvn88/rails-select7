module Select7::FormHelper
    class ActionView::Helpers::FormBuilder
        include Select7::TagHelper

        def select7(options: [], selecteds: [], suggest: {}, multiple: true, params: @template.params, **attributes)
            field, (value_attr, text_attr) = attributes.first

            input_name = if scope = @object_name then
                "#{scope}[#{field.to_s.singularize}_#{value_attr}#{multiple ? 's' : ''}]" + (multiple ? "[]" : "")
            else
                "#{field.to_s.singularize}_#{value_attr}" + (multiple ? "s[]" : "")
            end
           
            selecteds = (if @object then
                @object.send(field)
            else
                clazz = field.to_s.classify.constantize
                Array(clazz.where(value_attr.to_sym => params["#{field.to_s.singularize}_#{value_attr}s"]).all)
            end).map { |item| 
                [item.send(value_attr), item.send(text_attr)]
            }

            options_for_select = attributes[:options_for_select] || options.map { |item| [item.send(value_attr), item.send(text_attr)] }

            select7_tag(
                **attributes,
                options_for_select: options_for_select, 
                selecteds: selecteds, 
                suggest: suggest, 
                scope: @object_name, 
                input_name: input_name,
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

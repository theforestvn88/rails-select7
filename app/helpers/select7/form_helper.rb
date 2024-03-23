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

            select7_tag(
                **attributes,
                options: options, 
                selecteds: selecteds, 
                suggest: suggest, 
                scope: @object_name, 
                input_name: input_name,
            )
        end
    end
end

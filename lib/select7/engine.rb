module Select7
  class Engine < ::Rails::Engine
    isolate_namespace Select7

    config.eager_load_namespaces << Select7
    config.autoload_once_paths = %W(
      #{root}/app/helpers
    )

    # initializer "select7.assets" do
    #   if Rails.application.config.respond_to?(:assets)
    #     Rails.application.config.assets.precompile += %w( select7.css )
    #   end
    # end

    initializer "select7.helpers", before: :load_config_initializers do
      ActiveSupport.on_load(:action_controller_base) do
        helper Select7::Engine.helpers
      end
    end
  end
end

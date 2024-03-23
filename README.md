# Select7
Multiple choices selector (similar to select2, but with rails hotwire)
![search with multiple tag](/search.PNG)

## Installation

```ruby
# Gemfile
gem "rails", ">=7.0.0" # require Rails 7+
gem "stimulus-rails"   # require stimulus
gem "select7"

# install
$ bundle install
$ rails select7:install
```

## Usage

### Searching with multiple choices

```ruby
<%= form_with(url: search_projects_path) do |f| %>
  <%= f.select7(:tags => [:id, :name], options: Tag.all) %>
  <%= f.submit %>
<% end %>

# ==> This form will submit with `params[:tag_ids]` contains all ids of the selected tags
```

### In form: one/many-to-many relationship

```ruby
<%= form_with(model: project) do |form| %>
    # ...
    <%= form.select7(:tags => [:id, :name], options: Tag.all) %>
    # ...
<% end %>

# ==> This form will submit with `params[:project][:tag_ids]`
def project_params
    params.require(:project).permit(tag_ids: [], )
end
```

### Suggestion for multiple choices selector

In case there're a very large number of choices, instead of query all choices as options for select, you could use a `suggestion`:

```ruby
<%= form_with(model: project) do |form| %>
    # ...
    # assigned devs
    <%= form.select7(:developers => [:id, :name], suggest: { url: search_developers_url(page_size: 10), format: :json }) %>
    # ...
<% end %>

# this require an implementation of the suggestion
resources :developers do
    get :search, on: :collection
end

class DevelopersController < ApplicationController
    # ...
    # suggest developers
    def search
        @developers = Developer.where("name like ?", "%#{params[:name]}%").first(params[:page_size].to_i)
        respond_to do |format|
            format.json { render json: @developers, layout: false }
        end
    end
    # ...
end
```

### Listening select7 changed events
In case you want to do something with selected options from select7 whenever they're changed, you could listen event `select7-changed@window` from your js file.
For example:
```ruby
<div data-controller="filter" data-action="select7-changed@window->filter#update">
    <%= select7_tag(:tags => [:id, :name], options: Tag.all) %>
</div>

# filter_controller.js
import { Controller } from "@hotwired/stimulus"
export default class extends Controller {
    update(e) {
        console.log(e.detail)
        // field: "tags"
        // action: "add"
        // changedValue: "3"
        // selectedValues: ["1", "3"]
    }
}
```
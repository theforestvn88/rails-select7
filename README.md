# Select7
Multiple choices selector (similar to select2, but with rails hotwire)
![search with multiple tag](/search.PNG)

## Installation

```ruby
# Gemfile
gem "rails", ">=7.0.0" # require Rails 7+
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
    <%= form.select7(:developers => [:id, :name], suggest: { url: search_developers_path, format: :json}) %>
    # ...
<% end %>

# this require an implementation of the suggestion
class DevelopersController < ApplicationController
    # ...
    # search_developers_path
    def search
        render json: Developer.where("name like ?", "%#{params[:name]}%")
    end
    # ...
end
```

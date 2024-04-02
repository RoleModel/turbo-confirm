module IconHelper
  def icon(name, class_name: nil, color: nil, title: name)
    options = {
      class: [class_name, 'material-symbols-outlined'].compact_blank.join(" "),
      title: title
    }
    options[:style] = "color: var(--op-color-#{color}-base)" if color

    tag.span(name, **options)
  end
end

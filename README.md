# Eleventy

Eleventy is a static site generator. Here are the [docs](https://www.11ty.dev/).

## Quick Start

Create your project folder.

Run `npm init` to create a `package.json` file.

Run `npm install -g @11ty/eleventy` to install the eleventy dependency.

## Commands

Whenever you change the config you need to run `eleventy` in the root to compile.
To run browser-sync use `eleventy --serve`.

## Config

The config file is `.eleventy.js` and should be created in the root of the project folder:

A basic config file:

```js
module.exports = (config) => {
 
   // add assets
   config.addPassthroughCopy("assets");
 
   return {
 
       // tell 11ty that it's OK to copy the files
       passthroughFileCopy: true,
 
       // tell it what template engine and formats to use/accept
       markdownTemplateEngine: "njk",
       templateFormats: [ "html", "njk", "md" ],
 
       // change directory structure
       dir: {
           input: "src",
           output: "_site"
       }
   }
}

```

The defaults for the directory structure are:

output: `_site` <br>
data: `_data` <br>
include: `_includes`

## Templating

By default eleventy will look for template files inside an `_includes` folder. There is some flexibility as to which templating engine you use but [Nunjucks](https://mozilla.github.io/nunjucks/) is a good option. The file extension for Nunjucks files is `.njk`.

Your content can be separated from these templates using either regular `.html` files or (perhaps preferably) `.md` files.

These content files can hold specific data as front matter, or be passed data from a `json` or `js` file in the immediate directory or globally. More on that [here](#handling-data).

### Creating templates and linking to content

Let's say you want to create a global template to be used on all pages. We'll call it `base.njk` and it contains our `<head>` tag as well as headers and footers etc ...

```js
<!DOCTYPE html>
<html lang="en">
   <head>
       <!-- Required meta tags -->
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
       <title>{{ title }}</title>

           <!-- Required CSS files -->
       <link href="https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i" rel="stylesheet">
       <link rel="stylesheet" href="/assets/css/main.css">
   </head> ...

```

In your `base.njk` file you'll also have to create a space to yield content. To do this simply, the `base.njk` file should contain the following:

```js
{{ content | safe }}
```

The `safe` filter escapes HTML. Any content coming through will then be injected into `base.njk` at this point.

To link your content files to your `base.njk` template, you need to declare it as a `layout` in the front matter of your content file (eg. `about.md`) like so:

```md
---
layout: "_layouts/base.njk"
title: "About Us"
description: "This is our about page."
bannerBackgroundImage: "/assets/img/page-title.jpg"
---

-content goes here-

```

Note that the `title` variable in `about.md` can be called in the `base.njk` template to use in the `<title>` tag.

### Extending templates

You can extend parent templates in child template files using the following syntax at the top of the file:

```js
{% extends "base.njk" %}
```

### Creating blocks

You can also declare a **named block** in your parent template, give it some default content and have the ability to override that content in your individual child templates:

eg. in `base.njk`:

```js
{% block content %}
    <p>Some default content</p>
{% endblock content %}
```

Blocks can also be declared without content:

```js
{% block content %}{% endblock content %}
```

In a child template (eg. `simple.njk`), you can then override the content in this block:

```js
// first extend the parent template

{% extends "base.njk" %}

// we want the content in the base.njk file to be overridden by the html in this file. So to do that we redeclare the content block and add some new content inside it
{% block content %}
<div class="container sp">
   <div class="row justify-content-md-center">
       <div class="col-10">
           {{ content | safe }}
       </div>
   </div>
</div>
{% endblock content %}
```

Your markdown content file should then declare this child template as it's layout. It will inherit the extended `base.njk` template too.

```md
---
layout: "_layouts/simple.njk"
title: "Some content"
description: "This is a page."
---
```

You can remove unwanted blocks from a child template using the same logic: if there is content in the parent that you don't want in a specific child page, redeclare an empty block in the child template to override it.

### Including partials

You can use the Nunjucks `include` directive to include reusable partials in other Nunjucks files.

Let's say you want to create a reusable socials bar.

Create a partial in eg. `/_includes/_partials/socials.njk`:

```js
{% for social in settings.socials %}
    <a href="{{ social.socialUrl }}" class="fa fa-{{ social.socialName }}"></a>
{% endfor %}
```

Include the partial with the following syntax wherever you want to inject it:

```js
<div class="header-social">
       {% include "socials.njk" %}
</div>
```

**Important note:** you can only use `include` inside `.njk` files.<br>
**Another important note:** any front matter in the included file will not be included using this approach, so you want your partials to use global (or directory level?) data files.


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

output: `_site`
data: `_data`
include: `_includes`

## Templating

By default eleventy will look for template files inside an `_includes` folder. There is some flexibility as to which templating engine you use but [Nunjucks](https://mozilla.github.io/nunjucks/) is a good option. The file extension for Nunjucks files is `.njk`.

Your content can be separated from these templates using either regular `.html` files or (perhaps preferably) `.md` files.

These content files can hold specific data as front matter, or be passed data from a `json` or `js` file in the immediate directory or globally. More on that [here](#handling-data).

### Creating and extending templates

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

Just like with Blade, this then needs to be extended in your child template files using the following syntax at the top of the file:

```js
{% extends "base.njk" %}
```

In your `base.njk` file you'll have to create a space to yield any content from the child templates. To do this simply, the `base.njk` file should contain the following:

```js
{{ content | safe }}
```

The `safe` filter escapes HTML. Any content in your child template will then be injected into `base.njk` here.

Alternatively you can declare a **named block** in your `base.njk` file, give it some default content and have the ability to override that content in your individual child templates:

```js
{% block content %}
    {{ content | safe }}
{% endblock content %}
```
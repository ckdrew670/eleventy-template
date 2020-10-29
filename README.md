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

Your markdown file should then declare this child template as its layout. It will inherit the extended `base.njk` template too.

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

## Collections

You can create collections for things like posts, testimonials etc. - basically anything where you might want an archive or multiple instances of the same type of content.

Inside your `/src` folder create a new directory called eg. `/services`. This is where all the files for your different services will live.

Eleventy uses the concept of `tags` to create collections. Each individual service item has a `tags` property in its front matter to show it is part of a collection called `services`:

```
---
layout: "_layouts/simple.njk"
title: "Video Making"
description: "Lorem ipsum dolor amet sum"
tags: "services"
---
```

In your `/services` directory, you are likely to have lots of markdown files that share the same `layout` and `tags` variable in their front matter. This data can therefore be moved out into a directory level data file (either `json` or `js`) that serves all of the files in that folder. The data file must have the same name as the folder it lives in eg. `services.json`

```json
{
   "layout": "_layouts/simple.njk",
   "tags": "services"
}
```

### Outputting items in a collection

I want to create a **Services** page that outputs my services in a list. It will use the base template too. So, starting in the `base.njk` file, create a new empty block:

```js
{% block services %}{% endblock services %}
```

Create a new template for your services list, eg. `services.njk` and extend the base template.

Add in the new content for the block. Use a `for` loop as shown below to output your collection.

```js
{% extends "_layouts/base.njk" %}

{% block services %}
   <div class="service-area sp">
       <div class="container">
           <div class="row">

           {% for service in collections.services %}
               <div class="col-lg-4 col-md-6 single-service-2">
                   <div class="inner">
                       <div class="title">
                           <div class="icon">
                               <i class="fa fa-{{ service.data.faIcon }}"></i>
                           </div>
                           <h4>{{ service.data.title }}</h4>
                       </div>
                       <div class="content">
                           <p>{{ service.data.description }}</p>
                           <a href="{{ service.url }}">Read More</a>
                       </div>
                   </div>
               </div>
           {% endfor %}

           </div>
       </div>
   </div>
{% endblock services %}
```

Make sure that your `services.md` file uses this layout. You can put the `services.md` file into your services folder to keep things together, but you want to stop it from being read as part of the collection using the `eleventyExcludeFromCollections` property in the front matter and setting to `true`:

```js
---
layout: _layouts/services.njk
title: "Our Services"
description: "Find out more about what we can offer."
eleventyExcludeFromCollections: true
---

## Look at all the services we offer

```

## Handling Data

In Eleventy, data is merged from multiple different sources before the template is rendered. The data is merged in what Eleventy calls the Data Cascade. There is a hierarchy to this. Data redeclared closer to the content (eg. in the front matter) will override data from other sources. 

### Front matter

Data can be stored in a number of different ways. Eleventy uses the 

The simplest is in the front matter of each individual template (as below). This data can be written as `yaml`, `json` or `js`.

The variables you declare in the front matter can be used anywhere in the template. They can also be used in wrapper templates (as demo-ed [here](#creating-templates-and-linking-to-content))

```
---
layout: "_layouts/simple.njk"
title: "About Us"
description: "This is our about page."
bannerBackgroundImage: "/assets/img/jelly.jpg"
---
```

### Directory level data files

You can also store data inside certain directories. Let's say you have a folder that contains testimonials. Each testimonial shares certain data (as well as having it's own specific data). 

That shared data can be pulled out of the front matter and into a `json` or `js` file that sits alongside all testimonial files in the directory.

eg. `testimonials.json`

```json
{
   "layout": "_layouts/testimonials.njk",
   "tags": "testimonials"
}
```

### Global data

Global data can be stored in a `_data` folder. In here you can create `json` or `js` files that all templates can access.

The below file is a `settings.json` file inside `/_data`:

```json
{
   "siteName": "My site",
   "email": "info@my.site",
   "phone": "07768574657",
   "socials": [
       {
           "socialName": "facebook",
           "socialUrl": "https://myfacebookprofile.com"
       },
       {
           "socialName": "twitter",
           "socialUrl": "https://mytwitterprofile.com"
       }
   ]
}
```

You can access this data from any template using the following syntax:

```js
{% for social in settings.socials %}
    <a href="{{ social.socialUrl }}" class="fa fa-{{ social.socialName }}"></a>
{% endfor %}
```

TBC

For more on this see the [docs](https://www.11ty.dev/docs/data/).

## API Requests

You can make remote API requests in your data files using eg. **axios**. The following code returns a random image url from [this dog API](https://dog.ceo/dog-api/). It's in a directory level `.js` data file.

You'll obviously need to install **axios** (`npm install axios`) for this to work.

```js
const axios = require("axios");

module.exports = async () => {
   const result = await axios.get("https://dog.ceo/api/breed/retriever/golden/images/random");

   const dog = result.data.message;

   return {
       dogImage: dog
   };
}
```

Add the variable to your desired template, in this case I've added it to `simple.njk`:

```js
{% block content %}
<div class="container sp">
   <div class="row justify-content-md-center">
       <div class="col-10">
           {{ content | safe }}
       </div>

       {% if dogImage %}
       <div class="col-10">
           <h3>Look at this good boi</h3>
           <img src="{{ dogImage }}" alt="What a good boy"/>
       </div>
   {% endif %}
   </div>
</div>

{% endblock content %}
```

Any markdown file within this directory that extends `simple.njk` will output the random dog image.

If I didn't want the dog image to appear with the content in a specific `.md` file then just override the `dogImage` variable in the front matter for that file: `dogImage: false`.

It only fetches the API data at build time. Putting the above API request in a global data file would mean that you only get ONE random image back (rather than one per page) because you only make one API request. At directory level, you make one request per page in that directory.


For more info see these excellent tutorials to which much of this README is indebted:<br>
[Youtube tutorial by Bryan Robinson](https://www.youtube.com/watch?v=z-o1W9ijUhI&list=PLOSLUtJ_J3rrJ1R1qEf8CCEpV3GgbJGNr)<br>
[Introduction to 11ty - Learn with Jason](https://www.learnwithjason.dev/let-s-learn-eleventy)<br>
[Eleventy Walkthrough](https://rphunt.github.io/eleventy-walkthrough/intro.html)
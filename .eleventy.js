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
# metalsmith-frontmatter-file-loader

A [Metalsmith](http://www.metalsmith.io/) plugin to load files from paths added to frontmatter.

You could then use [metalsmith-frontmatter-renderer](https://github.com/djfwilkinson/metalsmith-frontmatter-renderer) to render the loaded data into html.

[![Build Status](https://travis-ci.org/djfwilkinson/metalsmith-frontmatter-file-loader.svg?branch=master)](https://travis-ci.org/djfwilkinson/metalsmith-frontmatter-file-loader)

## Installation

    $ npm install metalsmith-frontmatter-file-loader

## Config options

You can pass some basic options to customize the behaviour:

```json
{
  "key": "files",
  "out": "files",
  "suppressNoFilesError": false,
  "allowMissingFiles": false
}
```

- `key` is the key of the object to iterate over in the files frontmatter. Default `"files"`.
- `out` is the key of the object to update the values upon. Default the value of `key`.
- `suppressNoFilesError` is a boolean to determine the behaviour when there are no files to load. Set to `true` to prevent an error being thrown if there are no files to load. Default `false`.
- `allowMissingFiles` is a boolean to determine the behaviour when a file fails to load. Set to `true` to prevent an error being thrown if a file is missing or cannot be read as a utf-8 string. If a file fails to load then it will replace the value with an empty string. Default `false`.

## CLI Usage

  Install via npm and then add the `metalsmith-frontmatter-file-loader` key to your `metalsmith.json` plugin:

```json
{
  "plugins": {
    "metalsmith-frontmatter-file-loader": true
  }
}
```

or with configuration options:


```json
{
  "plugins": {
    "metalsmith-frontmatter-file-loader": {
      "key": "blocks",
      "suppressNoFilesError": true,
      "allowMissingFiles": true
    }
  }
}
```

## Javascript Usage

  Pass `options` to the plugin and pass it to Metalsmith with the `use` method:

```js
var fmfl = require('metalsmith-frontmatter-file-loader');

metalsmith.use(fmfl({
  key: "blocks",
  suppressNoFilesError: true,
  allowMissingFiles: true
}));
```

## Example frontmatter
*src/index.html*
<pre><code class="language-html">&mdash;&mdash;&mdash;
files:
    foo: &#39;./files/foo.txt&#39;
    bar: &#39;./files/bar.md&#39;
&mdash;&mdash;&mdash;
&lt;h1&gt;This is the &lt;code&gt;contents&lt;/code&gt; of the file.&lt;/h1&gt;</code></pre>

By default this would load the contents of `./files/foo.txt` (relative to the metalsmith root, not the file containing the frontmatter) and replace the path with the file contents. Then it would do the same for `./files/bar.md`. It doesn't do any conversion of the data but you can use [metalsmith-frontmatter-renderer](#) if you desire this behaviour.

e.g this is the equivalent of having written out the file contents into the frontmatter as so:

<pre><code class="language-html">&mdash;&mdash;&mdash;
files:
    foo: &#39;This is the text content of ./files/foo.txt!&#39;
    bar: &#39;This is the *markdown* content of `./files/bar.md` :)&#39;
&mdash;&mdash;&mdash;
&lt;h1&gt;This is the &lt;code&gt;contents&lt;/code&gt; of the file.&lt;/h1&gt;</code></pre>

*If you use a property other than `files` then you can pass the name as a configuration option. See the config documentation above.*

## License

MIT

# web-byline
Line-by-line Stream transformer for web

(A ported version of [jahewson/node-byline](https://github.com/jahewson/node-byline) for using with whatwg streams)
If you want to use byLine in node, then i recomend jahewson package

Currently only ReadableStream is implemented in Blink. TransformStream + WritableStream are on the way to be finilized. Until then you need [web-stream-polyfill](https://www.npmjs.com/package/web-streams-polyfill)

The `byline` module can be used as a function to quickly pipe throught a readable stream to a WritableStream:

```javascript
  rs = new ReadableStream({...})
  ws = new WritableStream({ write: console.log }
  
  rs.pipeThrough(byLine())
    .pipeTo(ws)
```

To read a large CSV from a file (or input) for example you can include [Screw-FileReader](https://www.npmjs.org/search?q=screw-filereader) to turn a blob into a stream 

Example here: https://jsfiddle.net/gp802r79/
And below:
```javascript
file = new File([content], 'large data.csv')
stdout = new WritableStream({ write: console.log }

file
  .stream()
  .pipeThrough(byLine())
  .pipeTo(stdout)
```

# Empty Lines

byline skips empty lines

Unlike other modules (of which there are many), `web-byline` contains no:

- monkeypatching
- dependencies (except for stream polyfill)
- CoffeeScript
- Unnecessary code
- minifed version
- es6-to-es5 transformation
 - I expect **you** to write decent code and use `const`, `let`, `classes` and all that and simply include this in your own build process since you are probably going to minify it anyway.
 - So a decient browser won't suffer cuz of other.<br>
 "The only way to truly force the web to embrace modern open standards is to invalidate old technology."

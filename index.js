const ByLineStream = (() => {
  class ByLineTransform {
    constructor() {
      this._buffer = []
      this._lastChunkEndedWithCR = false
    }

    transform(chunk, controller) {
      // see: http://www.unicode.org/reports/tr18/#Line_Boundaries
      const lines = chunk.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/g)
      const buffer = this._buffer
      
      // don't split CRLF which spans chunks
      if (this._lastChunkEndedWithCR && chunk[0] == '\n') {
        lines.shift()
      }
      
      if (buffer.length > 0) {
        buffer[buffer.length - 1] += lines[0]
        lines.shift()
      }
      
      this._lastChunkEndedWithCR = chunk[chunk.length - 1] == '\r'
      buffer.push(...lines)

      // always buffer the last (possibly partial) line
      while (buffer.length > 1) {
        const line = buffer.shift()
        // skip empty lines
        if (line.length) controller.enqueue(line)
      }
    }
    
    flush(controller) {
      const buffer = this._buffer

      while (buffer.length) {
        const line = buffer.shift()
        // skip empty lines
        if (line.length) controller.enqueue(line)
      }
    }
  }

  class ByLineStream extends TransformStream {
    constructor() {
      super(new ByLineTransform)
    }
  }

  ByLineStream.prototype[Symbol.toStringTag] = 'ByLineStream'

  return ByLineStream  
})()


if (typeof module !== 'undefined') module.exports = ByLineStream

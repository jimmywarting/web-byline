;((name, definition, global) => {
	'undefined' != typeof module ? module.exports = definition() :
	'function' == typeof define && 'object' == typeof define.amd ? define(definition) :
	global[name] = definition()
})('byLine', () => {

	return () => {
		var lineBuffer = []
		var lastChunkEndedWithCR
		var decoder = new TextDecoder
		var encoder = new TextEncoder

		if(!encode) {
			// identity
			encode = a => a
		}
		
		function pushBuffer(keep, done, enqueue){
			// always buffer the last (possibly partial) line
			while (lineBuffer.length > keep) {
				var line = lineBuffer.shift()
				// skip empty lines
				if (line.length > 0 )
					enqueue(encoder.encode(line))
			}
			done()
		}

		return new TransformStream({
			start(){},
			transform(chunk, done, enqueue) {
				chunk = decoder.decode(chunk, {stream:true})

				// see: http://www.unicode.org/reports/tr18/#Line_Boundaries
				var lines = chunk.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/g)

				// don't split CRLF which spans chunks
				if (lastChunkEndedWithCR && chunk[0] == '\n') {
					lines.shift()
				}

				if (lineBuffer.length > 0) {
					lineBuffer[lineBuffer.length - 1] += lines[0]
					lines.shift()
				}

				lastChunkEndedWithCR = chunk[chunk.length - 1] == '\r'
				lineBuffer = lineBuffer.concat(lines)
				pushBuffer(1, done, enqueue)
			},
			flush(enqueue, close) {
				// finish the stream
				lineBuffer[lineBuffer.length-1] += decoder.decode()
				pushBuffer(0, close, enqueue)
			}
		})
	}
}, this);

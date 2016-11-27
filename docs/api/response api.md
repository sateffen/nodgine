# Response #

The response class is a wrapper around the node internal response object. This wrapper should
simplify the interaction with the response object, by providing some simple functions that
set exactly what you need. If you miss something [let me know](https://github.com/sateffen/nodgine/issues)
about it.

**Important**: This response is NO stream, it's a Buffer. So you can **not** say `fileStream.pipe(response)`,
but you can say `response.pipe(fileStream)`, see the pipe method.

* Response
    * setStatusCode(statusCode) -> Response
    * getStatusCode() -> Number
    * write(data:buffer|string) -> Response
    * pipe(stream:ReadableStream) -> Response
    * setHeader(name:string, value:string) -> Response
    * getHeader(name:string) -> String | undefined
    * hasHeader(name:string) -> Boolean
    * removeHeader(name:string) -> Response
    * flush() -> Response
    * on(name:string, handler:function) -> undefined
    * off(name:string, handler:function) -> undefined
    * once(name:string, handler:function) -> undefined
* Events
    * close(Response)
    * finish(Response)

## setStatusCode(statusCode) -> Response ##

Sets given statuscode for this response.

This is chainable.

## getStatusCode() -> Number ##

Returns the currently active statuscode

## write(data:buffer|string) -> Response ##

Writes given buffer or string to the response buffer. The data gets added to the end of the
current buffer.

**WARNING**: If you already piped a stream, this throws an error

This is chainable.

## pipe(stream:ReadableStream) -> Response ##

Sets given stream to pipe to the user. The stream will be stored, but not activated (set in flow mode),
until the data get flushed. When flushed, the stream is passed to the original response stream.

**WARNING**: You can only pipe one stream. Every following stream will throw an error

**WARNING**: You can't set a stream to pipe if any data got written with the write method.

## setHeader(name:string, value:string) -> Response ##

Sets given header to given value.

This is chainable.

## getHeader(name:string) -> String | undefined ##

Returns the set value for given headername. If the header is not set, this will return
undefined.

## hasHeader(name:string) -> Boolean ##

Returns a boolean value, whether the given header is set or not.

## removeHeader(name:string) -> Response ##

Removes given header name from the response.

This is chainable.

## flush() -> Response ##

This method flushes the buffer and finishes the request. This can only be called one time.

**WARNING**: Usually you don't have to call this function. The nodgine execution queue will
call this. If you call it before, and do not finish the execution queue by yourself, an error
will occur.

## on(name:string, handler:function) -> undefined ##

Adds an event handler for given event name.

## off(name:string, handler:function) -> undefined ##

Removes an event handler for given event name.

## once(name:string, handler:function) -> undefined ##

Adds an event handler for given event name, that gets executed only once.

## Event: close ##

Rethrows the close event of the original response element. See
[HERE](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_event_close_1)

## Event: finish ##

Rethrows the finish event of the original response element. See
[HERE](https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_event_finish)
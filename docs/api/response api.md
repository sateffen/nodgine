# Response #

The response class is a wrapper around the node internal response object. This wrapper should
simplify the interaction with the response object, by providing some simple functions that
set exactly what you need. If you miss something [let me know](https://github.com/sateffen/nodgine/issues)
about it.

Important: This response is NO stream, it's a Buffer.

* Response
    * setStatusCode(statusCode) -> Response
    * getStatusCode() -> Number
    * write(data:buffer|string) -> Response
    * setHeader(name:string, value:string) -> Response
    * getHeader(name:string) -> String | undefined
    * hasHeader(name:string) -> Boolean
    * removeHeader(name:string) -> Response
    * flush() -> Response

## setStatusCode(statusCode) -> Response ##

Sets given statuscode for this response.

This is chainable.

## getStatusCode() -> Number ##

Returns the currently active statuscode

## write(data:buffer|string) -> Response ##

Writes given buffer or string to the reponse buffer. This gets added to the end of the
current buffer.

This is chainable.

## setHeader(name:string, value:string) -> Response ##

Sets given header to given value.

This is chainable.

## getHeader(name:string) -> String | undefined ##

Returns the set value for given headername. If the header is not set this will return
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
will occure.
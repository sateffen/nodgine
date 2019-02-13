# Request #

The request class is a wrapper around the node internal request object. This wrapper should
simplify the interaction with the request object, by providing some simple functions that
return exactly what you need. If you miss something [let me know](https://github.com/sateffen/nodgine/issues)
about it.

* Request
    * getMethod() -> String
    * getBodyStream() -> ReadableStream
    * getAllHeaders() -> Object
    * getHeader(headerName) -> String | undefined
    * getAuthentication() -> String | undefined
    * getProtocol() -> String
    * getRequestPath() -> String
    * getQueryStringObject() -> Object

## getMethod() -> String ##

Returns the method that was used for this request, for example *GET*, *POST*, *PUT*, ...

## getBodyStream() -> ReadableStream ##

Returns the body of this request as readable stream. You can use it with libs like [co-body](https://github.com/cojs/co-body)
like:

```js
const parse = require('co-body');
// ...
parse(request.getBodyStream()).then(...)
```

## getAllHeaders() -> Object ##

Returns an object containing all headers and their values, for example

```js
{
    "accept-encoding": "gzip, deflate",
    "accept-language": "de,en-US;q=0.8,en;q=0.6",
    "cache-control": "no-cache",
    // ...
}
```

## getHeader(headerName:string) -> String | undefined ##

This function returns the value of the given headername. The headername is not case-sensitive.

## getAuthentication() -> String | null ##

Returns the authentication string of the current request, if any. So if *http://user:pass@test.de*
was called, the result of this method would be *user:pass*.

## getProtocol() -> String ##

Returns the protocol of the current request, for example *http:* or *https:*

## getRequestPath() -> String ##

Returns the actual request path, that was called. So if *http://test.de/user/123/page* was called,
the result of this method would be */user/123/page*.

## getQueryStringObject() -> Object ##

This function returns an object containing all query string keys parsed to an object, if any.
# Request #

The request class is a wrapper around the node internal request object. This wrapper should
simplify the interaction with the request object, by providing some simple functions that
return exactly what you need. If you miss something [let me know](https://github.com/sateffen/nodgine/issues)
about it.

* Request
    * getMethod() -> String
    * getBody() -> Buffer
    * getAllHeaders() -> Object
    * getHeader(headerName) -> String | undefined
    * getAuthentication() -> String | undefined
    * getProtocol() -> String
    * getRequestPath() -> String
    * getQueryStringObject() -> Object

## getMethod() -> String ##

Returns the method that was used for this request, for example *get*, *post*, *put*, ...

## getBody() -> Buffer ##

Returns the body of this request as buffer. If you need the body as string you can call
`getBody().toString()`.

By default, this is not a string, because the client sends a buffer, and not every upload
body has a meaningful string representation.

## getAllHeaders() -> Object ##

Returns an object containing all headers and their values, for example

    {
        "accept-encoding": "gzip, deflate",
        "accept-language": "de,en-US;q=0.8,en;q=0.6",
        "cache-control": "no-cache",
        ...
    }

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
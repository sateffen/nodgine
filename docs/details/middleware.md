# Middleware

Middleware is basically the same as in express and restify, so middleware is actually a
"pass through" for each request. Think about it just like a proxy. Every request will
get passed through every middleware, that you've configured, and afterwards passed
to the controller.

Because a middleware gets called by every request, it should be just a small piece of logic.
Some examples for middleware are body-parsers, cookie-parsers, authentication filters, and
so on.

## Middleware structure

Basically middleware is a function, nothing more, but nothing less. So this is how basically
every middleware looks like:

```js
function (request, response) {
    // middleware code
}
```

If you register the middleware to a specific route with variables, you'll receive these variables
as third parameter, just like a controller:

```js
nodgineInstance.addMiddleware('/api/users/:id', function (request, response, params) {
    // work with params.id
});
```

All middeware has to look like this. There is no option of using servelets as middelware currently.
This is an idea for the future, but not now.

## Async middleware

If your middleware is async, you have to tell the nodgine to stop executing the chain. To do so,
you simply return a promise:

```js
function (request, response) {
    return new Promise((resolve, reject) => {
        global.setTimeout(resolve, 1000);
    });
}
```
    
if you resolve the promise, the chain will go on, if you reject the promise, the chain will stop.

## Stopping the execution chain

There are multiple ways of stopping the execution chain.

The first way is rejecting the returned promise. This is the best way to stop the execution. You
should prefer this way.

The second way is to return `false` from your middleware. This will automatically create a rejected
promise. This way helps to write simple, synchronous abort functions.

The third, but not the best way is to throw an error. By throwing an error the chain will stop as well,
and start the cleanup. The error will be rethrown, so you can catch this with
`process.on('unhandledRejection', () => {})`.

**WARNING**: There is one thing you have to know. If you stop the execution chain, the cleanup handler
will be executed. The cleanup handler will check if the request was fully handled already, and the
response was finished. If the response is not yet finished, the response will get finished with statuscode
500. So, you have to finish the request by yourself BEFORE you stop the execution. To do so, simply reject
the promise after you've called `response.flush()`.
# Basic Concept

The nodgine is based around one sole idea: Promises.

## What is a Promise

To get the basic idea of a promise, you should read the documentation provided
[HERE](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## What does the nodgine do with promises?

Everything you plug in the nodgine will return a promise, or get promisified by
the nodgine itself, so the engine knows for each part of processing a request,
when it's done. The nodgine will build a promise chain, consisting of all steps
needed to answer the incoming request. You simply register some *middleware* and
*controllers*, and the nodgine keeps track of what's needed to call to answer
a specific request.

So basically, the nodgine creates a promise chain for each incoming request, which
handles everything needed in an async, ordered way.

## Using promise replacements

The nodgine itself is tidly coupled with promises, so it suffers the same weaknesses
as the promises itself. That said, the nodgine might not perform as good as it could,
because we're limited by the promises performance.

To raise the performance of your server, you might want to replace the native promises
with *bluebird* or *when*, and that is totally fine. As long as your replacement is
compatible with the native ones, the nodgine doesn't care. If you encounter any problem
with a promise replacement, that implements the same API as the native ones, please open
an [issue](https://github.com/sateffen/nodgine/issues).
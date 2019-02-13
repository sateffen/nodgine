# Description #

The nodgine is a small library used for routing in nodejs server applications.

Basically this library solves two problems:

* Routing through middleware
* Routing to controllers

Additionally, request and response objects are wrapped, so the handling is much simpler.

All in all this is just another version of tools like restify or express.

## Dependencies ##

To use the nodgine you **have to** use nodejs 4.0 or higher! This library uses ES6 syntax
like Classes and Promises, so any older version is not supported, nor tested. To see the
tested versions see the faq.

## Why does it exist? ##

At first I wanted to help out restify, but restify has a messy code (just **MY** opinion).
Express has a big company and great developers itself, but it's a little.. too much. I don't
need all that stuff.

So I wrote the nodgine, a little, very basic router system, that solves the ONE problem
I wanted to solve. Nothing else.

## I need xyz ##

You're missing something? [Let me know](https://github.com/sateffen/nodgine/issues)!

## Documentation ##

For documentation please refer to the [docs](https://github.com/sateffen/nodgine/tree/master/docs)
folder in the repository. If you miss something, please [let me know](https://github.com/sateffen/nodgine/issues).

## Changelog ##

See [here](https://github.com/sateffen/nodgine/blob/master/docs/changelog.md)

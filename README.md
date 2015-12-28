# Description ![Codeship Status for sateffen/nodgine](https://codeship.com/projects/c11967a0-ea7e-0131-c845-220fc9a0138f/status?branch=master)#

The nodgine is a small library used for routing in nodejs server applications.

Basically the this library solves two problems:

* Routing through middleware
* Routing to controllers

Addidionally request and response objects are wrapped, so the handling is much simpler.

All in all this is just another version of tools like restify or express.

**WARNING**: This is a dev version, not yet available on NPM. The documentation is missing,
and I want to do an additional code review to check, whether it's alright.

## Dependencies ##

An important note to the dependencies: To use the nodgine you have to use nodejs 4.0 or
newer! This library uses ES6 syntax like classes and Promises, so any older version is
not supported, nor tested.

## Why does it exist? ##

At first I wanted to join coding for restify, but restify has a messy code (just MY opinion).
Express has a big company and great developers itself, but it's a little.. too much. I don't
need all that stuff.

So I wrote the nodgine, a little, very basic router system, that solves the ONE problem
I wanted to solve. Nothing else.

## I need xyz ##

You're missing something? [Let me know](https://github.com/sateffen/nodgine/issues)!

## Documentation ##

For documentation please refer to the [docs](https://github.com/sateffen/nodgine/tree/master/docs)
folder in the repository. If you miss something, please [let me know](https://github.com/sateffen/nodgine/issues).

**WARNING**: The documentation is not yet complete. If you want to know something specific
before the documentation is ready, just open an [issue](https://github.com/sateffen/nodgine/issues)
and ask.
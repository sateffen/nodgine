# Description #

The nodgine is a small library used for routing in nodejs server applications.

Basically the this library solves two problems:

* Routing through middleware
* Routing to controllers

Addidionally request and response objects are wrapped, so the handling is much simpler.

All in all this is just another version of tools like restify or express.

**WARNING**: This is a dev version, not yet available on NPM. The test coverage is not
yet 100%, and some end to end tests need to be written. Additionally I want to finalize
the API, and write some documentation, but it's on the road.

## Why does it exist? ##

At first I wanted to join coding for restify, but restify has a messy code setup (just
MY opinion). Express has a big company and great developers itself, but it's a little..
too much. I don't need all that stuff.

So I wrote the nodgine, a little, very basic router system, that solves the ONE problem
I wanted to solve. Nothing else.

## What's about pre version 1.0 ##

Pre version 1.0 I've tried to create a application server thing, that was so... How should
I say... The ideas were great, but the combination sucked as hell. Together with my lack of
tests and so on, no way.

Nodgine 1.0 and every following release follows the unix way of solving problems: Solve one
problem, but do it well.

## Documentation ##

Currently there is no documentation, yet. In future I'll write some documentation in the */docs*
folder.
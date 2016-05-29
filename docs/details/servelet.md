# Servelet #

There is one thing of the old nodgine, that I realy liked a lot, so I've decided to
take it over.

A servelet is basicly an object that acts as controller with a method for each request
method. Each method works as an independed controller function. So a servelet looks
like this:

    {
        doGet: (request, response) => {
            // handle get
        },
        doPost: (request, response) => {
            // handle post
        }
    }

You can simply match any request method, by putting a `do` before it, starting the
method with a capital letter.

When a request appears, that doesn't match any method, the missingRouteController of
the nodgine gets invoked.


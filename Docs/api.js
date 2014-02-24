YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "$APPLICATION",
        "$LOGGER",
        "$ROUTER",
        "$SERVICE"
    ],
    "modules": [
        "$APPLICATION",
        "$LOGGER",
        "$ROUTER",
        "$SERVICE",
        "nodgine"
    ],
    "allModules": [
        {
            "displayName": "$APPLICATION",
            "name": "$APPLICATION",
            "description": "This is the Application API for the nodgine module"
        },
        {
            "displayName": "$LOGGER",
            "name": "$LOGGER",
            "description": "This is the Logger API for the nodgine module"
        },
        {
            "displayName": "$ROUTER",
            "name": "$ROUTER",
            "description": "This is the Router API for the nodgine module"
        },
        {
            "displayName": "$SERVICE",
            "name": "$SERVICE",
            "description": "This is the Service API for the nodgine module"
        },
        {
            "displayName": "nodgine",
            "name": "nodgine",
            "description": "This is the bootstrap for the nodgine module"
        }
    ]
} };
});
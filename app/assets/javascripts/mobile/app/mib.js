$(document).ready(function () {
    Backbone.emulateJSON = true;
    // Initialize Backbone views.
    var appRouter = new IdeaBoardz.AppRouter();
    // Initialize the Backbone router.
    Backbone.history.start();
});
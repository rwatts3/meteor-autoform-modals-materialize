Package.describe({
    name: 'rwatts:autoform-modals-materialize',
    summary: "CRUD with Material Modals",
    version: "0.1.0",
    git: "https://github.com/rwatts3/meteor-autoform-modals-materialize",
});

Package.on_use(function(api) {
    api.versionsFrom('METEOR@1.2.0.2');

    api.use([
        'jquery',
        'templating',
        'less',
        'session',
        'coffeescript',
        'ui',
        'aldeed:autoform@5.3.0',
        'gildaspk:autoform-materialize@0.0.20',
        'raix:handlebar-helpers@0.2.4',
        'mpowaga:string-template@0.1.0',
    ], 'client');

    api.imply([
        'aldeed:autoform@5.3.0',
        'gildaspk:autoform-materialize@0.0.20',
    ]);

    api.add_files('lib/client/modals.html', 'client');
    api.add_files('lib/client/modals.js', 'client');
    api.add_files('lib/client/modals.less', 'client');
});
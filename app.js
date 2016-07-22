'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var G = new Module('g');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
G.register(function(app, auth, database, circles, users) {

  //We enable routing. By default the Package Object is passed to the routes
  G.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  G.menus.add({
    title: 'Topics',
    link: 'topics',
    roles: ['authenticated'],
    menu: 'main'
  });

G.menus.add({
	title: 'Facebook',
	link: 'fb',
	roles: ['authenticated'],
    menu: 'main'
  });


 G.menus.add({
    title: 'Google Maps',
    link: 'map',
    roles: ['authenticated'],
    menu: 'main'
  });

G.menus.add({
    title: 'Yelp',
    link: 'yelp',
    roles: ['authenticated'],
    menu: 'main'
  });
G.menus.add({
    title: 'Members',
    link: 'members',
    roles: ['authenticated'],
    menu: 'main'
  });

 G.menus.add({
    title: 'My Profile',
    link: 'me',
    roles: ['authenticated'],
    menu: 'main'
  });

  
  G.aggregateAsset('css', 'common.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    G.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    G.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    G.settings(function(err, settings) {
        //you now have the settings object
    }); **/
  return G;
});

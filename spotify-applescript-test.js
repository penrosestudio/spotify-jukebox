// open at startup
// https://stackoverflow.com/questions/2564394/add-a-start-up-item-via-command-line-mac
// https://github.com/rogerwang/node-webkit/issues/1000

// some scripts:
// https://github.com/dronir/SpotifyControl/blob/master/SpotifyControl.scpt

// ok, often the getState or getTrack calls are often returning null, why??
//   that's the child_process problem with node-webkit...

console.log('hi');
var spotify = require('spotify-node-applescript');

// Load native UI library
var gui = require('nw.gui');

// Create a tray icon
var tray = new gui.Tray({ icon: 'icon.png' });

// Give it a menu
var menu = new gui.Menu();
//menu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1', checked: true }));
tray.menu = menu;

// Remove the tray
/*
tray.remove();
tray = null;
*/

// Bind a callback to item
var item = new gui.MenuItem({
  label: "Click me",
  click: function() {
    console.log("I'm clicked");
    spotify.playPause();
    //getTrack();
  }
});
menu.append(item);

function getTrack() {
    spotify.getTrack(function(err, track) {
        console.log(track);
        if(track) {
            tray.title = track.name + ' - ' + track.artist;
        } else {
            //tray.title = '';
        }
    });
}

function getState() {
    spotify.getState(function(err, state) {
        console.log(state);
    });
}

//window.setInterval(getState, 5000);
window.setTimeout(function() {
    window.setInterval(getTrack, 5000);
}, 2500);
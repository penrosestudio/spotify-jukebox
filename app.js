// something for testing - http://ntk.me/2012/09/07/os-x-on-os-x/ ??

// also the possibility of using Facebook feed directly instead of applescript - https://developers.facebook.com/tools/explorer/145634995501895/?method=GET&path=me%2Fmusic.listens&version=v2.0

//require('nw.gui').Window.get().showDevTools();

var spotify = require('spotify-node-applescript');
var config = {"token":"FXjuca2d-oMKIH7dzSZqKRq5dvY","project_id":"53c6f239bf42cb00070000a3"};
var ironio = require('node-ironio')(config.token),
    project = ironio.projects(config.project_id);

// IronCache
console.log(project);
var c = project.caches('jukebox');
var key = 'current-song',
    currentSong,
    currentState;

// Add the current song to the cache
function putCurrentSong() {
    console.log('putCurrentSong');
    c.put(key, currentSong, function(err) {
        console.log('saved to cache',key,currentSong,arguments);
    });
}

// only do the poll if the player is playing, so we don't start it playing when it's stopped
function pollForSong() {
    console.log('pollForSong',!!currentState);
    if(currentState==='playing') {
        c.get(key, function(err, song) {
            console.log('retrieved from cache',key,song,arguments);
            if(song && song!==currentSong) {
                playSong(song);
            }
        });    
    }
}

// every 5 seconds, check what the current song is
setInterval(pollForSong, 5000);

function getState() {
    console.log('getState');
    spotify.getState(function(err, state) {
        console.log('spotify state',state);
        if(state) {
            if(state.state==='playing') {
                currentState = 'playing';
                getTrack();
            } else {
                currentState = null;
            }
        }
    });
}

setInterval(getState, 3000);

var getTrackTimeout;

function getTrack() {
    console.log('getTrack');
    // check if getTrack is already pending so this is only run once
    if(getTrackTimeout > -1) {
        clearTimeout(getTrackTimeout);
    }
    spotify.getTrack(function(err, track) {
        // sometimes track doesn't get returned, so try again in 1 second
        console.log('spotify track', track);
        if(!track) {
            return getTrackTimeout = setTimeout(getTrack, 1000);
        }
        song = track.spotify_url;
        if(currentSong!==song) {
            currentSong = song;
            putCurrentSong();
        }        
    });
}

function playSong(song) {
    console.log('playSong',song);
    spotify.playTrack(song);
}

//var iron_mq = require('iron_mq');
//var imq = new iron_mq.Client({"token":"FXjuca2d-oMKIH7dzSZqKRq5dvY","project_id":"53c6f239bf42cb00070000a3"});
/*
imq.queues({}, function() {
    console.log('queues', arguments);
    var queue = imq.queue("default");
    queue.info(function() {
        console.log('queue.info',arguments);
        queue.post({body: JSON.stringify({'hey':"hello IronMQ",'there':'yo'})}, function() {
            console.log('queue.post',arguments);
            queue.get({}, function() {
                console.log('queue.get',arguments);
                queue.clear(function() {
                    console.log('queue.clear',arguments);
                });        
            });            
        });
    });        
});
*/

/*
 * This bit shows that you can start Spotify up from an iframe in a hidden app
 *
 * the other bits to show:
 *   - that you can listen to play events
 *       - embedding playlists means you can at least keep synced (handlePlayerStatus override)
 *   - that you can broadcast that to a central server and get the updates
 *
 * things:
 *  - can the status.json be used to grab more than just the playlist info?
 *  - can I load and intercept all the user's playlists by loading their user profile given that the status.json requests are authenticated? (login example at http://jsfiddle.net/FyBLV/3/)
 *  - show who is in charge (i.e. whoever has pressed play in Spotify!)
 *  - use iron.io to communicate between instances
 */
/*
var iframe,
    iframeDoc,
    iframeWindow,
    playBtn;

(function($) {
    $(document).ready(function() {
        iframe = $('<iframe src="https'+'://embed.spotify.com/?uri=spotify:user:danielmorris:playlist:1ejF91ErLLuk6OmPs6ad8d" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>').appendTo('body').get(0);
        $(iframe).on('load', function() {
            iframeDoc = iframe.contentDocument.documentElement;
            playBtn = $('.play-pause-btn', iframeDoc);
            console.log('load');
            iframeWindow = iframe.contentWindow;
            iframeWindow._handlePlayerStatus = iframeWindow.handlePlayerStatus;
            iframeWindow.handlePlayerStatus = function(trackID, playStatus, secondsToSeek) {
                // if handlePlayerStatus is called, that's Spotify communicating with the app, so send out a message
                sendMessage(arguments);
                console.log(arguments);
                iframeWindow._handlePlayerStatus.apply(this,arguments);
            };
        });
    });
}(jQuery));

// if a message is received, call _handlePlayerStatus directly with it
// get the message
// delete the message
$(iframeWindow).on('message', function() {
   iframeWindow._handlePlayerStatus.apply(iframeWindow,arguments); 
});
*/
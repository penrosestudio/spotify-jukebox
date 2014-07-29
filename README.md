spotify-jukebox
===============

Keeps your Spotify in sync with anyone else using Spotify Jukebox. Step up and play your favourite tune...

Requirements: `npm install`

Usage: `node app.js`

Notes:
* we found that someone can accidentally hijack the flow when a song ends and they move on to the next one
* when you are not playing, the app doesn't do anything; but when you start playing, that hijacks the flow - that seems weird
* sometimes the track jumps back to the previous one until everyone is in sync
* adverts come up as track not found for premium subscribers (JRL thinks)
* would be helpful to sync play position

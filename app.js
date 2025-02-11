require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

//set view template engine
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//tell express about the body-parser
app.use(express.urlencoded({ extended: true }))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

//create homepage
app.get("/", (req, res) => {
  res.render("home");
});

//query to artist search
app.get("/artist-search", (req, res) => {
  const artistName = req.query.searchInput; //--> get the artist from the spotifyAPI

  spotifyApi
    .searchArtists(artistName) //--> query the artist
    .then((artistName) => {
      let artistList = artistName.body.artists.items; //get the data from the API on artist and what info they have
      //console.log('The received data from the API: ', data.body);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      console.log(artistList)
      res.render("artist-search-results", { artistList }); //artistList is in the artist-search-results.hbs file, where we display the results
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

// Get albums by a certain artist
app.get("/albums/:artistId", (req, res, next) => {
  const artistAlbums = req.params.artistId;
  // .getArtistAlbums() code goes here
  spotifyApi
  .getArtistAlbums(artistAlbums)
  .then(
    function (data) {
      console.log("Artist albums", data.body);
    },
    function (err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

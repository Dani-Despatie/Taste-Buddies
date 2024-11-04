# Taste-Buddies

Taste Buddies is a recipe sharing platform for people who want simplicity and ease of reading.

*This is mainly a project to practice and highlight my skills as a developer, but is also hosted online at https://taste-buddies.vercel.app/ 

Please keep in mind that no profanity filters have been implemented and there are no moderators. If you see something inappropriate has been posted to the site I can be reached at dani.despatie@gmail.com, however I cannot guarantee that I will be able to act immediately.

## Current Usability (Hosted Site)

Taste Buddies is currently hosted on a free hosting service. This leads to the server being very slow to respond at first. If you notice that Recommended Recipes, Browse Recipes, or the auto login feature are not working on first opening the website please be patient; the server should respond within about one minute.

## Setup

If downloading this code to view or use on your own, a few steps will need to be followed for the website to function properly.

### Dependencies
- Open a console and navigate to Taste-Buddies\server
- type ``yarn install``
- type ``yarn start``
- Open a second console and navigate to Taste-Buddies\client
- type ``yarn install``
- type ``yarn start``

### .env

Since Taste Buddies is coded to depend on a MongoDB database for its user and recipe data, a .env file will need to be made containing the variable ``MongoURI``.

Taste Buddies will also use Cloudinary to save images of recipes, therefore the .env file will also need to contain the variable ``CLOUDINARY_URL``. In the live version of this website user uploaded images are not implemented, so the variable can be set to ``cloudinary://869869547725888:eYUrDoEFOUwY-HdhxO4oWpT7uzA@dfszibmt6`` temporarily.
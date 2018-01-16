# Sheet
A cloud based character sheet for the Pathfinder Roleplaying Game.

## Development Requirements
The instructions assume hosting on [Heroku](https://www.heroku.com/). Adjust as necessary for different hosting platforms.

1. NodeJS
2. Grunt
3. Heroku CLI

## Setup

1. Install Node, Grunt, and the Heroku Toolbelt
2. Clone the repository
3. Create a `.env` file in the root of the project and fill it the required configuration, as per the example below.
4. Run `npm install && bower install` to get all dependencies
4. Run a development server with `heroku local`

## .env File

    HOST=http://localhost:5000
    APP_FOLDER=/pathfinder
    GOOGLE_CLIENT_ID=<id>.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=<secret>
    GITHUB_CLIENT_ID=<id>
    GITHUB_CLIENT_SECRET=<secret>
    MONGOLAB_PAID=mongodb://<username>:<password>@<db_host>:<port>/<db>

## Routes

The Node webserver is in `server/web.js`. It will read and use the environment variables from your `.env` file. It mounts several routes, of which these are of note:

    /                 The marketing site
    /pathfinder_dev   The development version of the app (from /app)
    /pathfinder       The production version of the app (from /dist)

The authentication process uses preconfigured URLs. When development, take care of the URl, as after logging in, you're probably redirect to `/pathfinder`, even you come from `/pathfinder_dev` before.

## Grunt Tasks & Production

Here are some important and useful grunt tasks.

    grunt build   Builds the production version into /dist
    grunt gss_pull  Grabs the latest spell spreadsheet from d20pfsrd.com and writes it to `/app/data/spells_raw.json`
    grunt prepare_spells  Takes `spells_raw.json` and writes `spells.json` and `spell_names.json` for use by the app

## Contributions

Are welcome! Please send pull requests against the master branch.

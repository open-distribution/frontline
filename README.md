# frontline

Frontline Live Homepage


## Build step

Install less

    npm i -g less

Run compile step from within `docs` folder

    lessc style.less style.css

Initially - commit `style.css` and push to deploy.

TODO - consider taking a step down to use plain old CSS for simplicity, maintainability,
transferability.


## Dotnet core app

The `Frontline.sln` and `Frontline` config and C# code aim to provide a live-reload dev
environment.

Similar setup on MacOSX/Linux without dotnet install - change directory into the `docs` folder
then run:

    python -m http.server

to serve the static files on http://localhost:8000 and

    watch lessc style.less style.css

to continually rebuild the stylesheets while developing.



## Ushahidi API

Core open data platform is an Ushahidi instance: https://frontlinehelp.ushahidi.io

API docs are at https://docs.ushahidi.com/platform-developer-documentation/tech-stack/api-documentation

Main call to get geolocated data:
https://frontlinehelp.api.ushahidi.io/api/v3/posts/geojson

Each item from Main Url provides id to put in:
https://frontlinehelp.api.ushahidi.io/api/v3/posts/[id]

e.g.
https://frontlinehelp.api.ushahidi.io/api/v3/posts/68
https://frontlinehelp.api.ushahidi.io/api/v3/posts/65

The forms (surveys) correspond to different submission types (PPE request, supplied...)
https://frontlinehelp.api.ushahidi.io/api/v3/forms/[id]

Then images data needs a subsequent API call:
https://frontlinehelp.api.ushahidi.io/api/v3/media/[id]

Giving us data to form url to get actual image:
https://74ddb495e3f187ded630-0b4c691ea14dad11384ab079da46af4f.ssl.cf2.rackcdn.com/frontlinehelp.api.ushahidi.io/5/e/5e7de59df239a-screenshot%202020-03-27%20at%2011.37.24.png

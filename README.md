# frontline

Frontline Live Homepage

## Build step

Install less and typescript

    npm i -g less
    npm i -g typescript

Run compile step from within `docs` folder

    lessc style.less style.css
    tsc *.ts

Initially - commit `style.css` and built `*.js` files and push to deploy. (TODO Travis integration)


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

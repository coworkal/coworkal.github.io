# To build

```
git clone https://github.com/coworkal/coworkal.github.io
cd coworkal.github.io
npm install
bower install
```

To serve locally:
```
grunt serve
```

To build and serve:
```
grunt serve:dist
```

To update github pages
```
grunt gh-pages
```

Be sure to add corresponding Facebook API keys in `app/scripts/app.js` and in the Gruntfile for dev/production.  You can create API keys here: https://developers.facebook.com/

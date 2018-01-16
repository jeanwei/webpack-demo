### Webpack Configuration Steps
```sh
$ npm init -y
$ npm i -D webpack
$ npm i -D webpack-dev-server
$ npm i -D clean-webpack-plugin
$ npm i -D babel-loader babel-core
$ npm i -D babel-preset-env
$ npm i -D html-loader html-webpack-plugin
$ npm i -D sass-loader node-sass css-loader style-loader extract-text-webpack-plugin
$ npm i -D file-loader
```

Configure Bootstrap
```sh
$ npm view bootstrap dist-tags
$ npm install bootstrap@next --save
```

### Bundle command

Development
```sh
$ npm run build
$ npm run watch
$ npm run dev
```
Production
```sh
$ npm run build:prod
```

References
[https://medium.com/@nirjhor123/webpack-3-quickstarter-configure-webpack-from-scratch-30a6c394038a]

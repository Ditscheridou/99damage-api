# 99Damage API
## A NodeJS API for [99damage.de](http://99damage.de)

[![npm](https://img.shields.io/node/v/99damage-api.svg?maxAge=604800)](https://www.npmjs.com/package/99damage-api)
[![npm](https://img.shields.io/npm/dt/99damage-api.svg?maxAge=604800)](https://www.npmjs.com/package/99damage-api)
[![npm](https://img.shields.io/npm/dm/99damage-api.svg?maxAge=604800)](https://www.npmjs.com/package/99damage-api)

### How to install
```npm install --save 99damage-api```  

### How to use 
```
var damage = require('99damage-api');

damage.getMatches(function(matches) {
    console.log(matches);
});

damage.getMatch(matchId, function(match) {
    console.log(match);
});
```

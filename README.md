# 99Damage API
## A NodeJS API for [99damage.de](http://99damage.de)

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

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

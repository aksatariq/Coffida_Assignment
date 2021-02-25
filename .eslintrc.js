module.exports = {
  "extends": 'airbnb',
  "parser": "babel-eslint",
  "env":{
  "browser": true
  },
  "ecmaFeatures": {
    "classes":true
  },
  "rules": {
      "react/jsx-filename-extension": ["error", {"extensions" : [".js", ".jxs"]}], 
      "no-shadow": [2, {"builtinGlobals": false, "hoist": "functions", "allow": []}]
  }
};

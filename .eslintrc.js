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
  }
};

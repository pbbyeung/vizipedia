var Sequelize = require('sequelize');
var db = require('../config/postgres.js');

var schema = {
  userId: {
    type: Sequelize.INTEGER
  },
  articleId: {
    type: Sequelize.INTEGER
  },
  recommended: {
    type: Sequelize.BOOLEAN
  }
};

var classMethods = {};

classMethods.visitIfUnvisited = function(userId, articleId) {
  return visitedArticle.findOrCreate({
    where: {
      userId: userId,
      articleId: articleId
    },
    defaults: {
      recommended: false
    }
  });
};

classMethods.toggleRec = function(userId, articleId) {
  return visitedArticle.findOne({
     where: {
      userId: userId,
      articleId: articleId
    }
  })
  .then(function(visited) {
    visited.update({recommended: !visited.recommended});
  });
};

classMethods.checkIfRec = function(userId, articleId) {
  return visitedArticle.findOne({
     where: {
      userId: userId,
      articleId: articleId
    }
  })
  .then(function(visited) {
    return visited.recommended;
  });
};

classMethods.numRec = function(articleId) {
  return visitedArticle.findAndCountAll({
     where: {
      articleId: articleId,
      recommended: true
    }
  })
  .then(function(result) {
    return result.count;
  });
};

// Return the most recent articles visited by user; "limit" will determine the number returned.
// Returns an array of visitedArticle instances with userId, articleId, recommended, createdAt, updatedAt
classMethods.getHistory = function(userId, limit) {
  return visitedArticle.findAll({
    where: {
      userId: userId
    },
    limit: limit,
    order: [['createdAt','DESC']]
  })
  .then(function(articles) {
    return articles;
  });
};

var visitedArticle = db.define('visitedArticles', schema, {classMethods: classMethods});

db.sync();
module.exports = visitedArticle;

const userId = {
  id: 0,
  setId: function (data) {
    this.id = data;
  },
};

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    userId.setId(parseInt(req.user.id));
    return next();
  }
  res.redirect("/Login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated, userId };

module.exports = {
    ensureAuthenticated: function(req: any, res: any, next: any) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Odmowa dostępu.');
      res.redirect('/logowanie');
    },
    forwardAuthenticated: function(req: any, res: any, next: any) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/');      
    }
}
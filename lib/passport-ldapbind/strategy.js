var passport = require('passport');
var ldap = require('ldapjs');
var util = require('util');

function Strategy(options, verify) {

    if (!options || typeof options === 'function') {
        throw new Error('LDAP authentication strategy requires options');
    }

    passport.Strategy.call(this);
    
    this.name = 'ldapBind';
    this.options = options;
    this.verify = verify;
}

util.inherits(Strategy, passport.Strategy);

var verify = function() {
  return function(err, user, info) {
    if (err)   return this.error(err);
    if (!user) return this.fail(info);
    return this.success(user, info);
  }.bind(this);
};


Strategy.prototype.authenticate = function(req) {
    var self = this;

    if (!req.body.username || !req.body.password) {
        return self.fail(401);
    }

    var username = req.body.username;
    if (!username) {
        return retry('username required');
    }
    
    var password = req.body.password;
    if (!password) {
        return retry('password required');
    }

    var client = ldap.createClient(this.options.server);

    client.bind(username, password, function (err, user) {
        client.unbind();
        if (err) {
            if (err.name === 'InvalidCredentialsError' || err.name === 'NoSuchObjectError' || (typeof err === 'string' && err.match(/no such user/i))) {
                return self.fail('Invalid username/password');
            }
            return self.error(err);
        }
        else {
            if (self.verify) {
                if (self.options.passReqToCallback) {
                    return self.verify(req, username, verify.call(self));
                } else {
                    return self.verify(username, verify.call(self));
                }
            } else {
                return self.success(username);
            }       
        }
    });
};

module.exports = Strategy;

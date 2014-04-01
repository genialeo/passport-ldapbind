Passport-ldapbind
=================

LDAP simple authentication strategy (binding) for Passport.

This module performs a simple LDAP bind operation against an LDAP server in Node.js application.
If you're looking for a more complete strategy check out https://github.com/mintbridge/passport-ldap

## Install

    $ npm install passport-ldapbind

## Usage

#### Configure

According to [passport.js](http://http://passportjs.org/) a configuration for the strategy is needed.

    var passport = require('passport'),
    var LdapSimpleStrategy = require('passport-ldapbind').Strategy;

    var ldapServer = "ldap://myldapserver:389";

    passport.use(new LdapSimpleStrategy({
        server: {
            url: ldapServer
        }
        },
        function(user, done) {
            // If verify is needed
        }
    ));

#### Authenticate 

    app.post('/login', 
        passport.authenticate('ldapBind', { 
                            successRedirect: '/',
                            failureRedirect: '/login', 
                               failureFlash: true })
    );



## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 [Leonardo Fenu](http://blog.genialeo.it)

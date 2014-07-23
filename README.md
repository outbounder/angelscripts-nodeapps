# angelscripts nodeapps v0.0.5

Daemonize applications with suppot for retrieving their status and to persist their output.

    $ angel app :action(start|stop|status|restart) :target

* `:target` - path to node.js main script
* `:action` - one of `start, stop, status, restart` actions

    $ angel app cleanOuput :target

* `:target` - path to node.js main script
Removes `:target.out` and `:target.err` files

### Behaviours

* always redirects process' stdout and stderr to `:target.out` and respectively `:target.err`
* always creates `:target.pid` file containg process' pid
* status work on *nix operating systems only


# Thanks to

## organic-angel
https://github.com/outbounder/organic-angel

## async
https://github.com/caolan/async

## jasmine-node
https://github.com/mhevery/jasmine-node
var fs = require('fs')
var path = require("path")
var child_process = require("child_process");
var async = require('async')

var CustomNodeSpawner = {
  resolveCWD: function(c) {
    if(c.target && !c.cwd) { 
      // no current working directory provided
      if(c.target.indexOf("/") !== 0 && c.target.indexOf(":") !== 1) {
        // target is not full path, so use process.cwd()
        c.cwd = process.cwd()
      } else{
        // target is full path, use its dir as cwd
        c.cwd = path.dirname(c.target)
        c.target = c.target.replace(path.dirname(c.target)+path.sep, "")
      }
    }
  },
  start: function(c, next){
    this.resolveCWD(c)
    
    var err = out = path.join(c.cwd, path.basename(c.target));
    out = fs.openSync(out+".out", 'a');
    err = fs.openSync(err+".err", 'a');

    var argv = c.argv || [];
    var stdio = ['ignore', out, err];

    var options = {
      detached: true,
      cwd: c.cwd,
      env: c.env || process.env,
      silent: true,
      stdio: stdio
    }

    var childCell = child_process.spawn(process.argv[0], [c.target].concat(argv), options);
    childCell.unref();

    fs.writeFile(path.join(c.cwd, c.target+".pid"), childCell.pid, function(err){
      if(err) return next(err)
      next(null, childCell)
    })
  },
  stop: function(c, next){
    this.resolveCWD(c)

    var pidFile = path.join(c.cwd, c.target+".pid")
    fs.readFile(pidFile, function(err, pid){
      if(err) return next(err)
      pid = parseInt(pid.toString())
      try {
        process.kill(pid)
        fs.unlink(pidFile, function(err){
          if(err) return next(err)
          next(null, pid)
        })
      } catch(err){
        next(err)
      }
    })
  },
  restart: function(c, next){
    this.resolveCWD(c)

    var self = this
    this.stop(c, function(r){
      if(r instanceof Error) return next(r)
      self.start(c, next)
    })
  },
  status: function(c, next){
    this.resolveCWD(c)

    var pidFile = path.join(c.cwd, c.target+".pid")
    fs.readFile(pidFile, function(err, pid){
      if(err) return next(null, "not found")
      pid = parseInt(pid.toString())
      child_process.exec("ps -p "+pid, function(err, stdout, stderr){
        next(null, stdout.toString().indexOf(pid) !== -1?"running":"not found");
      })
    })
  },
  cleanOutput: function(c, next){
    this.resolveCWD(c)

    async.each([
      path.join(c.cwd, c.target+".out"),
      path.join(c.cwd, c.target+".err")
    ], fs.unlink, next)
  }
}

module.exports = function(angel) {
  angel.on("app :action :target", function(options, next){
    CustomNodeSpawner[options.action](options, next)
  })
}
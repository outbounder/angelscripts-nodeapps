var fs = require('fs')

describe("angelscripts nodeapps", function(){
  var Angel = require("organic-angel")
  var instance
  var appPID

  beforeEach(function(next){
    instance = new Angel({scripts: [__dirname+"/../index"]})
    instance.plasma.on("ready", function(){next()})
  })

  it("start app.js", function(next){
    instance.do("app start "+__dirname+"/data/app.js", function(err, result){
      expect(err).toBeFalsy()
      expect(result).toBeDefined()
      expect(fs.existsSync(__dirname+"/data/app.js.pid")).toBe(true)
      expect(fs.existsSync(__dirname+"/data/app.js.out")).toBe(true)
      expect(fs.existsSync(__dirname+"/data/app.js.err")).toBe(true)
      expect(result.pid).toBeDefined()
      appPID = result.pid
      next()
    })
  })
  it("status app.js", function(next){
    instance.do("app status "+__dirname+"/data/app.js", function(err, result){
      expect(err).toBeFalsy()
      expect(result).toBe("running")
      next()
    })
  })
  it("restart app.js", function(next){
    instance.do("app restart "+__dirname+"/data/app.js", function(err, result){
      expect(err).toBeFalsy()
      expect(result).toBeDefined()
      expect(fs.existsSync(__dirname+"/data/app.js.pid")).toBe(true)
      expect(result.pid).not.toBe(appPID)
      next()
    })
  })
  it("stop app.js", function(next){
    instance.do("app stop "+__dirname+"/data/app.js", function(err, result){
      expect(err).toBeFalsy()
      expect(result).toBeDefined()
      expect(fs.existsSync(__dirname+"/data/app.js.pid")).toBe(false)
      next()
    })
  })
  it("status app.js as not found", function(next){
    instance.do("app status "+__dirname+"/data/app.js", function(err, result){
      expect(err).toBeFalsy()
      expect(result).toBe("not found")
      next()
    })
  })
  it("cleanOutput app.js", function(next){
    instance.do("app cleanOutput "+__dirname+"/data/app.js", function(err, result){
      expect(err).toBeFalsy()
      expect(fs.existsSync(__dirname+"/data/app.js.out")).toBe(false)
      expect(fs.existsSync(__dirname+"/data/app.js.err")).toBe(false)
      next()
    })
  })
})
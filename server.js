require.paths.unshift(__dirname + "/vendor");

process.addListener('uncaughtExceptionn', function(err,stack){
 console.log('----------------');
 console.log('Exception: '+ err);
 console.log(err.stack);
 console.log('-----------------');
});
var LiveStats = require('./lib/livestats');

new LiveStats({
 port: 8000,
 quakeServer: {
    hostname: 'localhost'
  , port: 4567 
  }
})


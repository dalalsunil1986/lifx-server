var express = require('express')
var app = express()
var Lifx = require('node-lifx/lib/lifx').Client
var client = new Lifx()
var _ = require('lodash')

// variables
var bulbs = [];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/lights', (req, res) => {
  res.send(bulbs)
})


app.get('/light/off/:label', (req, res) => {
  var light = req.params.label
  client.light(light).off()
  updateBulbsArr(light, 0)
  res.send({success: 'success'})
})

app.get('/light/on/:label', (req, res) => {
  var light = req.params.label
  client.light(light).on()
  updateBulbsArr(light, 1)
  res.send({success: 'success'})
})

var server = app.listen(3000, () => {
  console.log(`server running at port http://localhost/${server.address().port}`)
})

client.on('light-new', (light) => {
  // console.log('bulbs:', bulbs);
  light.getState((error, data) => {
    bulbs.push(data)
    console.log('the array: ', bulbs)
  })
});

client.on('light-online', function(light) {
  console.log('Light back online. ID:' + light.id + ', IP:' + light.address + ':' + light.port);
});

client.on('light-offline', function(light) {
  console.log('Light offline. ID:' + light.id + ', IP:' + light.address + ':' + light.port);
});

// init starts the discovery of lights and emit 
// a light-new when a bulb is discovered
client.init();

var updateBulbsArr = (light, newPower) => {
  var lightIndex = _.findIndex(bulbs, { label: light })
  bulbs[lightIndex].power = newPower
}
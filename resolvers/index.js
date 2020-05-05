const datetime = require('./datetime');
const user = require('./user');
const channel = require('./channel');
const thread = require('./thread');
const reply = require('./reply');
const favorite = require('./favorite');

module.exports = [
  datetime,
  user,
  channel,
  thread,
  reply,
  favorite,
];

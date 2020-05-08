const DataLoader = require('dataloader');

const models = require('../models');

const loader = new DataLoader(ids => batchUsers(ids, models));

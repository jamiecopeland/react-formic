import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import async from 'async';
import ip from 'ip';
import bodyParser from 'body-parser';

import { BUILD_FOLDER_PATH, SRC_FOLDER_PATH } from '../../config/projectPathConfig';
import { APP_HOST, APP_PORT, WEBPACK_HOST, WEBPACK_PORT } from '../../config/serverAddressConfig';
import { JS_FOLDER_PATH, CSS_FOLDER_PATH, MAIN_JS_FILE_NAME, MAIN_CSS_FILE_NAME } from '../../config/publicFolderConfig';

function initializeExpress(indexFileString) {
  const app = express();
  const indexWithDocType = `<!DOCTYPE html>${indexFileString}`;

  app.use(express.static(BUILD_FOLDER_PATH));
  app.use(bodyParser.json());
  app.use(cors());

  app.get('/api/message', (req, res) => {
    res.json({message: 'hello'});
  });

  app.get('/api/user-name-exists', (req, res) => {
    const existingNames = ['atilla', 'genghis'];
    res.json({
      userNameExists: existingNames.filter((item) => item === req.query.userName).length >= 1
    });
  });

  app.get('/api/things', (req, res) => {
    res.json([
      {
        id: '1',
        name: 'Thing One'
      },
      {
        id: '2',
        name: 'Thing Two'
      }
    ]);
  });

  app.get('*', (req, res) => {
    res.send(indexWithDocType);
  });

  app.listen(APP_PORT, () => {
    // console.log(`**********`);
    // console.log(`App server started at: http://${APP_HOST}:${APP_PORT}`);
    // console.log(`**********`);
    doThings();
  });

  return app;
}

// --------------------------------------------------
// Initialization

import createIndexFile from './utils/createIndexFile';
createIndexFile((err, indexFileString) => {
  if(err) {
    throw(new Error(`Couldn't create index file: ${err}`));
  } else {
    initializeExpress(indexFileString);
  }
});


function doThings() {
  console.log('--------------------------------------------------');
  console.log('\n');

  // require('./experiments/1_simple-take.js');
  // require('./experiments/2_promises.js');
  // require('./experiments/3_loading-data.js');
  // require('./experiments/4_simple-callbacks.js');
  require('./experiments/5_subject.js');


  console.log('\n');
  console.log('--------------------------------------------------');

}

var express = require('express');
var router = express.Router();

/*
 * If this node process is running in production, we want to serve up static files
 * from the client/build folder (the SP-frontend repo was renamed to client),
 * specifically the index.html file that is needed to render react files.
 */
if(process.env.NODE_ENV === 'production') {
  /*
   * if they are trying to get a specific file in prod mode, then serve up that file form build.
   */
  router.get('/:file', function (req, res) {
    var fileName = req.params.file;
    res.sendFile(path.join(__dirname, '/../../SP-frontend/frontend/build/', fileName));
  });
  /*
   * for all other requests, serve up the index.html file from the build folder
   */
  router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/../../SP-frontend/frontend/build/', 'index.html'));
  });
}
/*
 * If the node process is not running in production, then serve up static files from
 * public instead of build, for development mode.
 */
else {
  /*
   * if they are trying to get a specific file in dev mode, then serve up that file from public.
   */
  router.get('/:file', function (req, res) {
    var fileName = req.params.file;
    res.sendFile(path.join(__dirname, '/../../SP-frontend/frontend/public/', fileName));
  });
  /*
   * for all other requests serve up the index.html file from the public folder.
   */
  router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/../../SP-frontend/frontend/public/', 'index.html'));
  });
}

module.exports = router;

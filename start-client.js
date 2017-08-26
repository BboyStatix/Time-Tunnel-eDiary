//From https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/
//However, the && operator is not cross-platform (doesn't work on Windows). As
//such, we've included a start-client.js script with the project.
//This script will boot the client from the top-level directory in a manner that is cross-platform.
const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };
require('child_process').spawn('npm', args, opts);

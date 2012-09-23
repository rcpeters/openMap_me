OpenMap.me
=======

OpenMap.me uses GPS enabled browsers to allow people to see where they 
are. By simply going to oMap.me and sharing a unique url oMap.me will broadcast the location
of any browser viewing the url. Simply show up copy the url and text or email to a friend
see each others location in real time. 

Environment Requirments
----------
OpenMap.me is a [Node.js](http://nodejs.org/) application written with the [expressjs](http://expressjs.com)
framework backed by [mongoDB](http://www.mongodb.org/) for object persistence.

Running
---------
The default configuration assumes mongoDB is accesable on the local host. To run OpenMaps on localhost:3000 
cd to the project root to the project and pass app.js to node.

    node app.js
(note: I really like using [nodemon](nodemon) for development instead of node)

 


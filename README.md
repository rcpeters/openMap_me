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
cd to the project root and pass app.js to node.

    node app.js
(note: I really like using [nodemon](https://github.com/remy/nodemon) for development instead of node)


Environment Variables
---------
Environment variables can be set to override the web apps defaults

<table>
    <tr>
        <th>Variable</th>
        <th>Description</th>
        <th>Default</th>
    </tr>
    <tr>
        <td>PORT</td>
        <td>Port the web application will run on</td>
        <td>3000</td>
    </tr>
    <tr>
        <td>MAP_PROVIDER_HOST</td>
        <td>Host of database that provides maps</td>
        <td>127.0.0.1</td>
    </tr>
    <tr>
        <td>MAP_PROVIDER_PORT</td>
        <td>PORT number of database that provides maps</td>
        <td>27017</td>
    </tr>
    <tr>
        <td>SEQUENCE_PROVIDER_HOST</td>
        <td>Host of database that provides sequences</td>
        <td>127.0.0.1</td>
    </tr>
    <tr>
        <td>SEQUENCE_PROVIDER_PORT</td>
        <td>PORT number of database that provides sequences</td>
        <td>27017</td>
    </tr>    
</table>
 


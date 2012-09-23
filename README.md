OpenMap.me
=======

OpenMap.me uses GPS enabled browsers to allow people to see where they 
are. By simply going to OpenMap.me and sharing a unique url oMap.me will broadcast the location
of any browser viewing the url. Simply show up copy the url and text or email to a friend
see each others location in real time. 

Environment Requirements
----------
OpenMap.me is a [Node.js](http://nodejs.org/) application written with the [expressjs](http://expressjs.com)
framework backed by [mongoDB](http://www.mongodb.org/) for object persistence.

Running
---------
The default configuration assumes mongoDB is accessible on the local host. To run OpenMaps on localhost:3000 
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
 
License
---------

The MIT License (MIT)
Copyright © 2012 Robert Peters, http://rcpeters.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


# MentorMap
Website development project for MentorMap

## Running the App
To clone to your local machine:
```
$ git clone
$ cd MentorMap
```
Install dependencies:
```
$ brew install node
```
on windows: download and install node from their website

After you install node, in bash:
```
$ npm install -g gulp nodemon browserify express bower
$ npm install 
```
To run the startup script
```
$ gulp serve
```
Navigate to ```localhost:3000```

##File Structure
```
.
|-app.js		    //express server entry point
|-gulpfile.js	  //gulp task automation processes
|-package.json	//lists npm dependencies
|-bower.json	  //lists bower dependencies
|-public		    //static assets
|--css
|--fonts
|--js
|-routes		    //route handlers used by express
|-views			    //ejs template files
|-react			    //react files
|--components	  //react components go here
|--routes		    //react router route handlers
|--data			    //static data used by components
|--main.jsx		  //mount point
```

## Development Notes:
Please commit your changes to branch ```dev```

Or create your own development ```branch```

Make sure we do code review together before merging to ```master```

To install npm modules remember to do 
```$ npm install --save packagename```
or
```$ npm install --save-dev packagename```

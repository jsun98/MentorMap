# MentorMap
This is the code powering [MentorMap](www.mentormap.ca), the official website of the consulting service that connects high schoolers with university mentors
This full stack web application is built using NodeJS, MongoDB, HTML, CSS and hosted on Heroku
Visit the live site: [https://www.mentormap.ca](https://www.mentormap.ca)
Follow us on [Facebook](https://www.facebook.com/MentorMap-165742407332701/)
# Screenshots
![img1](http://res.cloudinary.com/rube0414/image/upload/v1504828410/Screen_Shot_2017-09-07_at_7.53.13_PM_erhxww.png)
![img1](http://res.cloudinary.com/rube0414/image/upload/v1504827873/Screen_Shot_2017-09-07_at_7.25.04_PM_bb917d.png)
![img1](http://res.cloudinary.com/rube0414/image/upload/v1504827873/Screen_Shot_2017-09-07_at_7.25.18_PM_xqjz3l.png)
![img1](http://res.cloudinary.com/rube0414/image/upload/v1504827873/Screen_Shot_2017-09-07_at_7.25.12_PM_brneqy.png)
![img1](http://res.cloudinary.com/rube0414/image/upload/v1504827872/Screen_Shot_2017-09-07_at_7.42.10_PM_umqskp.png)
![img1](http://res.cloudinary.com/rube0414/image/upload/v1504827872/Screen_Shot_2017-09-07_at_7.42.38_PM_atrvup.png)
![img1](http://res.cloudinary.com/rube0414/image/upload/v1504827873/Screen_Shot_2017-09-07_at_7.42.44_PM_rkoevj.png)
![img1](http://res.cloudinary.com/rube0414/image/upload/v1504827872/Screen_Shot_2017-09-07_at_7.42.31_PM_waga3q.png)
![img1](http://res.cloudinary.com/rube0414/image/upload/v1504827872/Screen_Shot_2017-09-07_at_7.42.17_PM_l1nm7h.png)

## Running the App
Make sure you have NodeJS, NPM and MongoDB, Yarn installed
Make sure your mongodb is running
Install dependencies:
```
$ yarn
```

Start server with Gulp
```
$ gulp
```
Navigate to ```localhost:3001```

## File Structure
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

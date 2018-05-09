
# Guide to the Quiz App
This app aims to provide a location based quiz based on user inputted questions, that can be answered on a mobile app.
All code for the app must be cloned from this git repository, as well as the questions and quiz repository, onto a BitVise server for use. This can be done with the following commands:
```
clone https://github.com/rpGIS/server.git
clone https://github.com/rpGIS/questions.git
clone https://github.com/rpGIS/quiz.git
```
# Loading the app
In order to load up the app go to the server folder provided in the server repository and node it. This must be done from a UCL network or UCL VPN connection. 
```
cd server
node httpServer.js &
```
Once you have done this, go to the questions folder and use the phonegap serve command to serve the app to the server. You can use this code to serve up the input form:
```
cd questions
phonegap serve
```
And this code to serve the quiz mobile app:
```
cd quiz
phonegap serve
```
# Viewing the app
go to http://developer.cege.ucl.ac.uk:31286/ to view the app on a browser. To view it on the phone, use the phonegap app and put the same url into the in app browser area.

You can also download the app by scanning the following QR code and downloading the apk file 

![alt text](https://github.com/rpGIS/server/blob/master/chart.png)

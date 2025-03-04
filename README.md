# WTWR (What to Wear?): Back End
The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.
## Running the Project
`npm run start` — to launch the server 

`npm run dev` — to launch the server with the hot reload feature

### Testing
Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12


# Project Name: 
WTWR (What to Wear?): Back End

# Description
This is the back end of the WTWR site created in the last project (11). Creates a server to run the api, connects to database for storing data. (User information, clothing items (name, weather type, likes, ...)). This utilizes MongoDB database, and a linter, to flag programmign errors, bugs and styling errors. We had to make an exception for the linter to allow for the underscore at the beginning of variables '_id' <= which is being used by MongoDB. Had tests run through Postman, and then github ran tests on it. Had more difficulty with githubs tests. 

# Updated Version
Added authroization and authentication to the server. 
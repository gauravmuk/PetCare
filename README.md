# PetCare
PetCare is an online service where individuals who are looking for someone to take care of their pets can connect with pet sitters in their community who are experienced in taking care of pets. Users can register on the system and look for a pet sitter or offer their pet sitting services, or both.

### Setup
1. Install nodejs
2. Install npm
3. Install mongoDB 3.2 Community Edition   
    OS X: 		https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/   
    Windows:	https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/
4. On OS X/Linux, copy the credentials file into ~/.aws/credentials                  
    on Windows, copy the credentials file into C:\Users\USERNAME\.aws\credentials   
    This file contains the Amazon AWS credentials used for uploading images to Amazon S3 storage.
5. Execute `npm install` to install the dependencies listed in the package.json file.

### How To Run
1. Open two terminals.
2. In one terminal, run `mongod --dbpath ./mongodb_data` to start the mongoDB daemo
3. In the second terminal, run `node data/default-data.js` to import the data    
    And then run `npm start` to start the nodeJS serve
4. Go to http://localhost:3000/ for the interface.


### Admin and other user credentials

Admin Credentials
	email: 		admin@gmail.com
	password:	admin123

Default user 1 credentials
	email:		jennifer@gmail.com
	password:	12345678

Default user 2 credentials
	email:		bale@gmail.com
	password:	12345678

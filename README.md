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
After running the default-data.js script as described above, use can sign in one of the following users by using these credentials

Admin Credentials
	email: 		admin@gmail.com
	password:	admin123

Default user 1 credentials
	email:		jennifer@gmail.com
	password:	12345678

Default user 2 credentials
	email:		bale@gmail.com
	password:	12345678


### List of URL

All the REST API end-point are listed in section 6 of the report.pdf document

URLS that does not require sign in 
	/
	/forum
	/petsitter_posts
	/pet_posts         
	/pet_posts/:id
	/petsitter_posts/:id
	/users/:id
	NOTE: Default search results may take time to load depending on the network

URLS that does require sign in 
	/new_pet_posts
	/new_petsitter_posts
	/users/:id/applications
	/users/:id/messages
	NOTE: You have to sign in to make a Review or to Apply for a post

URL that only Admin can access
	/admin 
	NOTE: Admin can access the Admin Console by clicking on their name on the upper left corner and clicking ‘Admin Console’

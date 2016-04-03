SETUP
	1. Install nodejs
	2. Install npm
	3. Install mongoDB 3.2 Community Edition
		os-x: 		https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
		Windoes:	https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/
	5. Copy the credentials file into ~/.aws/credentials on Mac/Linux or C:\Users\USERNAME\.aws\credentials on Windows. This contains the Amazon AWS credentials used for uploading images to Amazon S3 storage.
	4. cd into the 'PetCare' directory.
	5. Run 'npm install' to install the dependencies listed in the package.json file.

HOW TO RUN
	1. Open two terminals.
	2. cd into the 'PetCare' directory.
	3. In one terminal, start the mongoDB daemon by running 'mongod --dbpath ./mongodb_data'
	4. In the second terminal, import the data by running 'node default-data.js'
	5. In the second terminal, start the nodeJS server by running 'npm start'
	6. Type http://localhost:3000/ in a browser to view the application.
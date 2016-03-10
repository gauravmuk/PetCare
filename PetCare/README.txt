SETUP
	Install nodejs
	Install npm
	Install mongoDB 3.2 Community Edition
		os-x: 		https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
		Windoes:	https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/
	cd in to 'PetCare' directory
	do 'npm install' to install the dependencies listed in the package.json file

HOW TO RUN
	open two terminals
	cd in to 'PetCare' directory
	in one terminal start the mongoDB daemon by typing 'mongod --dbpath ./mongodb_data'
	in the second termianl start the nodeJS server by typing 'npm start'
	Then, load http://localhost:3000/ in a browser to see the application


LIST OF ROUTES
	http://localhost:3000/
	http://localhost:3000/search_petsitter
	http://localhost:3000/search_pet
	http://localhost:3000/signup
	http://localhost:3000/signin
	http://localhost:3000/admin
	http://localhost:3000/new_post_pet
	http://localhost:3000/user_profile
	http://localhost:3000/post_petsitter
	http://localhost:3000/post_pet
	http://localhost:3000/new_post_petsitter

TEST ROUTES
	http://localhost:3000/dogs

	http://localhost:3000/dogs/1
	http://localhost:3000/dogs/2
	http://localhost:3000/dogs/33

	http://localhost:3000/dogs/new/Timmy
	http://localhost:3000/dogs/new/Max

	http://localhost:3000/dogs/find/Timmy
	http://localhost:3000/dogs/find/Rocky

	http://localhost:3000/AnyOtherRoute	
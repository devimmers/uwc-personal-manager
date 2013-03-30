To init test DB data you need uncomment method in model/models.js file: //testUserInit();(60 row).

Api information:
User can login, logout and register;
User Actions: 
	Login: 
		Post with 2 parameters: 
			username, password
		Example:
			http://localhost:3000/login
		Post parameters:
			username: Bob4
			password: 123
		Responce:
			...
			redirect to main page(GET /main) - (onSucces action)
			
	Registration:
		Post with 3(first iteration 3, will be increase) parameters:
			username, password, email
		Example:
			http://localhost:3000/registration
		Post parameters:
			username: NewUser
			password: 123
			email: test@gmail.com
		Responce:
			...
			redirect to login page(GET /login) - (onSucces action)

	Logout:
		Get without parameters
		Example:
			http://localhost:3000/login
		Responce:
			...
			redirect to login page(GET /login) - (onSucces action)
			
All notes actions can done only when user in authenticated.
User Can see, add, remove, edit, delete, (in future - removeAll) Notes;
Notes Actions:
	Show all notes:
		Get without parameters
		Example:
			http://localhost:3000/notes
		Responce:
			JSON with array of items:
			    {
					"_user": "5156d457cb25e29c35000005",
					"title": "Test title",
					"description": "Test description",
					"_id": "5156d459cb25e29c35000006",
					"__v": 0
				}
	
	Show one note by id:
		Get with 1 parameter:
			/notes/:id - id of Note
		Example:
			http://localhost:3000/notes/5156be0c57a63d8c0b000002
		Responce:
			JSON Document with Note:
			    {
					"_user": "5156d457cb25e29c35000005",
					"title": "Test title",
					"description": "Test description",
					"_id": "5156d459cb25e29c35000006",
					"__v": 0
				}

	Add note:
		Post with parameters:
			title, description, creationDate
		Example:
			http://localhost:3000/addNote
		Responce:
			... will be soon, now only status	
				
	Edit note:
		Put with parameters:
			/notes/:id - id of Note
			and put parameters are note field:
				title, description, creationDate
		Example:
			http://localhost:3000/notes/5156be0c57a63d8c0b000002
		Responce:
			... will be soon, now only status			
				
	Delete note:
		Put with 1 parameter:
			/notes/:id - id of Note
		Example:
			http://localhost:3000/notes/5156be0c57a63d8c0b000002
		Responce:
			... will be soon, now only status
			


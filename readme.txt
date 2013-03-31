To init test DB data you need uncomment method in model/models.js file: //testUserInit();(60 row).

Api information:
User can login, logout and register;
User Actions: 
	
	Login: 
		Post with 2 parameters: 
			email, password
		Example:
			http://localhost:3000/login
		Post parameters:
			email: Bob4
			password: 123
		Response:
			return accessToken with format: {token:token}

	Get token:
	    Get without parameters:
	        Get request to /login
    	Example:
	        http://localhost:3000/login
        Response:
            token in format {token:token}, or empty document - if user not authenticated

	Registration:
		Post with 3(first iteration 3, will be increase) parameters:
			email, password, email
		Example:
			http://localhost:3000/registration
		Post parameters:
			username: NewUser
			password: 123
			email: test@gmail.com
		Response:
			...
			redirect to login page(GET /login) - (onSucces action)

	Logout:
		Get without parameters
		Example:
			http://localhost:3000/login
		Response:
			...
			redirect to login page(GET /login) - (onSucces action)
		
-----------------------NOTES---------------------------------------------		
All notes actions can done only when user in authenticated.
User can see, add, remove, edit, delete, (in future - removeAll) Notes;
Notes Actions:
	
	Show all notes:
		Get without parameters
		Example:
			http://localhost:3000/notes
		Response:
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
		Response:
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
			title, description
		Example:
			http://localhost:3000/patch
		Response:
			return _id of added note in format: {"_id":_id}

				
	Edit note:
		Patch with parameters:
			/notes/:id - id of Note
			and parameters are note field:
				title, description
		Example:
			http://localhost:3000/notes/5156be0c57a63d8c0b000002
		Response:
            status Success if all okey, Fail - if error

	Delete note:
		Delete with 1 parameter:
			/notes/:id - id of Note
		Example:
			http://localhost:3000/notes/5156be0c57a63d8c0b000002
		Response:
			... will be soon, now only status
	
	Get notes count:
		Get without parameters:
			/notesCount
		Example:
			http://localhost:3000/notesCount
		Response:
			JSON document, with structure:
				{ count: '5'}
		
		
-----------------------Tasks-------------------------------------------
All tasks actions can done only when user in authenticated.
User can see, add, remove, edit, delete, (in future - removeAll) Tasks;
Tasks Actions:
	
	Show all tasks:
		Get without parameters
		Example:
			http://localhost:3000/tasks
		Response:
			JSON with array of items:
			     {
					"_user": "51571332c455026c5f000005",
					"title": "Test task5",
					"description": "Task description here",
					"priority": 5,
					"state": true,
					"_id": "51571333c455026c5f000007",
					"__v": 0,
					"taskDate": "2013-03-30T16:30:43.314Z",
					"creationDate": "2013-03-30T16:30:43.314Z"
				}
	
	Show one task by id:
		Get with 1 parameter:
			/tasks/:id - id of Task
		Example:
			http://localhost:3000/tasks/5156be0c57a63d8c0b000002
		Response:
			JSON Document with Task:
			  {
				"_user": "51571332c455026c5f000005",
				"title": "Test task5",
				"description": "Task description here",
				"priority": 5,
				"state": true,
				"_id": "51571333c455026c5f000007",
				"__v": 0,
				"taskDate": "2013-03-30T16:30:43.314Z",
				"creationDate": "2013-03-30T16:30:43.314Z"
			}

	Add task:
		Post with parameters:
			title, description, priority, state, taskDate
		Example:
			http://localhost:3000/tasks
		Response:
		    return _id of added task in format: {"_id":_id}

	Edit task:
		Patch with parameters:
			/tasks/:id - id of Task
			and parameters are task field:
				title, description, priority, state, taskDate
		Example:
			http://localhost:3000/tasks/5156be0c57a63d8c0b000002
		Response:
	        status Success if all okey, Fail - if error

	Delete task:
		Delete with 1 parameter:
			/tasks/:id - id of Task
		Example:
			http://localhost:3000/tasks/5156be0c57a63d8c0b000002
		Response:
			... will be soon, now only status
			
	Get tasks count:
		Get without parameters:
			/tasksCount
		Example:
			http://localhost:3000/tasksCount
		Response:
			JSON document, with structure:
				{ count: '5'}
			
			
-----------------------Events-------------------------------------------
All events actions can done only when user in authenticated.
User can see, add, remove, edit, delete, (in future - removeAll) Events;
Events Actions:
	
	Show all events:
		Get without parameters
		Example:
			http://localhost:3000/events
		Response:
		    {
				"_user": "51571332c455026c5f000005",
				"title": "Test Event5",
				"description": "Event description here",
				"priority": 5,
				"state": true,
				"_id": "51571333c455026c5f000014",
				"__v": 0,
				"eventDate": "2013-03-30T16:30:43.322Z",
				"creationDate": "2013-03-30T16:30:43.322Z"
			}
	
	Show one event by id:
		Get with 1 parameter:
			/events/:id - id of Event
		Example:
			http://localhost:3000/events/5156be0c57a63d8c0b000002
		Response:
			JSON Document with Event:
		    {
				"_user": "51571332c455026c5f000005",
				"title": "Test Event5",
				"description": "Event description here",
				"priority": 5,
				"state": true,
				"_id": "51571333c455026c5f000014",
				"__v": 0,
				"eventDate": "2013-03-30T16:30:43.322Z",
				"creationDate": "2013-03-30T16:30:43.322Z"
			}
			
	Add event:
		Post with parameters:
			title, description, priority, state, eventDate
		Example:
			http://localhost:3000/addEvent
		Response:
		    return _id of added event in format: {"_id":_id}
				
	Edit event:
		Put with parameters:
			/events/:id - id of Event
			and parameters are event field:
				title, description, priority, state, eventDate
		Example:
			http://localhost:3000/events/5156be0c57a63d8c0b000002
		Response:
	        status Success if all okey, Fail - if error
				
	Delete event:
		Delete with 1 parameter:
			/events/:id - id of Event
		Example:
			http://localhost:3000/events/5156be0c57a63d8c0b000002
		Response:
			... will be soon, now only status
			
	Get events count:
		Get without parameters:
			/eventsCount
		Example:
			http://localhost:3000/eventsCount
		Response:
			JSON document, with structure:
				{ count: '5'}
			

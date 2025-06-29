register
http://localhost:3000/api/auth/register

login
/api/auth/login


user GET 
http://localhost:3000/api/users?email=test2@example.com&&name=name 2 (query parameter)

http://localhost:3000/api/users?_page=1&_limit=3&name=name 1    (pagination with exact match filter)


http://localhost:3000/api/users (without query parameter)

http://localhost:3000/api/users?search=name 1  ( global search )

role ADD
http://localhost:3000/api/roles/add

role GET
http://localhost:3000/api/roles

role assign 
http://localhost:3000/api/roles/assign

role assigned user
http://localhost:3000/api/roles/users/1

todo ADD
http://localhost:3000/api/todos/add

todo GET
http://localhost:3000/api/todos?_page=1&_limit=3&title=todo 7  (pagination with exact match filter)

http://localhost:3000/api/todos?search=todo 2  ( global search )

swagger api link
http://localhost:3000/api-docs/
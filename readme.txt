register
http://localhost:3000/api/auth/register

login
/api/auth/login


user GET 
http://localhost:3000/api/users?email=test2@example.com&&name=name 2 (query parameter)

http://localhost:3000/api/users?_page=1&_limit=3&name=name 1    (pagination with exact match filter)

'http://localhost:3000/api/users?_search=name%207&_search_fields=name%2Cemail  ( global search with dynamic search field )

http://localhost:3000/api/users?_show_fields=name%2Cemail     ( dynamic fetch fields )


http://localhost:3000/api/users (without query parameter)

http://localhost:3000/api/users?search=name 1  ( global search )

role ADD
http://localhost:3000/api/roles/add

role GET
http://localhost:3000/api/roles
http://localhost:3000/api/roles?_search=staff&_search_fields=name%20%2C%20description ( global search with dynamic search field)

role assign 
http://localhost:3000/api/roles/assign

role assigned user
http://localhost:3000/api/roles/users/1

todo ADD
http://localhost:3000/api/todos/add

todo GET
http://localhost:3000/api/todos?_page=1&_limit=3&title=todo 7  (pagination with exact match filter)

http://localhost:3000/api/todos?search=todo 2  ( global search )
http://localhost:3000/api/todos?_search=re&_search_fields=title%20%2C%20description ( global search with dynamic search field)

http://localhost:3000/api/todos?_show_fields=name%2Cdescription     ( dynamic fetch fields )


swagger api link
http://localhost:3000/api-docs/
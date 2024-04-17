#!/bin/bash
# curl examples for manual testing


echo "\n\n========" Getting the initial list of users
curl -v "http://localhost:8000/users" | json_pp 2>&1

echo "\n\n========" Making a valid POST request -- should respond 201 Created
curl -v -X POST "http://localhost:8000/users" -H "Content-Type: application/json" -d '{\"name\":\"Erik ten Hag\",\"job\":\"Soccer coach\"}' 2>&1

echo "\n\n========" Making an invalid POST request -- should respond 400 Bad Request
curl -v -X POST "http://localhost:8000/users" -H "Content-Type: application/json" -d '{"name":"Curly","job":Broken}' 2>&1 

echo "\n\n========" Getting the new list of users
curl "http://localhost:8000/users" | python3 -mjson.tool

echo "\n\n========" Making an invalid DELETE request 
curl -v -X DELETE "http://localhost:8000/users/0xdeadbeef" 2>&1

echo "\n\n========" Making a valid DELETE request 
id=`curl "http://localhost:8000/users" | grep -oh '"id":"[^"]*"' | head -1 | cut -d \" -f 4`
curl -v -X DELETE "http://localhost:8000/users/"${id} 2>&1

echo "\n\n========" Attempting to DELETE already deleted item
curl -v -X DELETE "http://localhost:8000/users/"${id} 2>&1

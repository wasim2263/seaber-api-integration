# Process to run the project:
 - rename .env.example to .env and change the keys accordingly
 - run: 
 ```docker-compose up```
 - then run: ```npm run start:dev```
 - api collection:  {base api}/api/api-docs/ (default: http://localhost:3001/api/api-docs/)
 
 - docker db access:
   ```docker-compose exec db psql -U test -W seaber_order```
 - run tests: ```npm run test:e2e```
# Discussions:
- How stable is this solution?
 > It should work perfectly. Need load testing to check further. 
- What if the Seaber API goes down?
 > Need to make a scheduler to resend pending tasks.  
- What if the External System generates lots of messages with unknown types?
 > Added a api validator to prevent different types.
- How scalable is this solution?
 > Can use multiple core to run different queues. So, it's pretty much scalable in both horizontal and vertical way. 
- What if messages from the External System came in a different order?
 > It doesn't matter, when all data(columns) are filled then we are sending it to the seaber.
- What if messages from the External System are duplicated?
 > I didn't configure it yet properly. Currently, it can accept duplicate requests. Can handle using the status, if delivered once then ignore the rest. 
- What if messages from the External System are interleaved with different extOrderId?
 > It will count as a new order. And previous order will send request when its cycle is completed.
- What if messages from the External System for the same order came in 1 day between
  each other?
 > Depending on the requirements it will be handled. For current solution it doesn't matter. 
- What if a message of any type never comes so the Integration Layer is not able to
  construct Seaber order?
 > Current solution can't handle it. Maybe we can make a scheduler to recheck incomplete order and get data from the external server.
- How easy will it be to update the code if the External System decides to change JSON to
  XML?
 > Need to change the api request format in controller then parsing it in service layer. 
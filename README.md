# TumpukanTumpah API Docs
A stackoverflow-like website Api Docs


## Routes for /

|  url  | method      |  header | body |query| response
|----------|:-------------:|------:|------|-----| ----|
| /register |  POST  |  | name, password, email| | 201 / 400|
| /login |  POST |  | password, email || 200 with token / 400 with error

## Routes for /threads

|  url  | method      |  header | body |query| response | description |
|----------|:-------------:|------:|------|-----| ----|----|
| /threads |  POST | token | title, content, tags || 201 / 400 / 403 with error| create new thread |
| /threads |  GET |  |  || 200 with all threads / 400 | get all threads
| /threads/me |  GET  | token | | | 200 with thread by user/ 400 / 403|get thread by user who is logged in |
| /threads/:threadId |  GET |  | || 200 / 400 | get one thread with all comment and users
| /threads/:threadId |  PATCH | token | title,content, tags || 200 / 400 | update thread by own user
| /threads/:threadId |  DELETE | token | || 200 / 400 | delete the specified thread
| /threads/:threadsId/upvote |  POST | token |  || 200 / 400 | upvote
| /threads/:threadsId/downvote |  POST | token |  || 200 / 400 | downvote

## Routes for /comments

|  url  | method      |  header | body |query| response | description |
|----------|:-------------:|------:|------|-----| ----|----|
| /comments |  POST | token | content | threadId| 201 / 400 / 403 with error| create new comment within the requested thread id in query |
| /comments/me |  GET  | token | | | 200 with comment by user/ 400 / 403| get comments by user logged in|
| /comments/:commentId |  GET |  | || 200 / 400 | get one comment with the specified id
| /comments/:commentId |  PATCH | token | content || 200 / 400 | update comment by own user
| /comments/:commentId/upvote |  POST | token |  || 200 / 400 | upvote
| /comments/:commentId/downvote |  POST | token |  || 200 / 400 | downvote



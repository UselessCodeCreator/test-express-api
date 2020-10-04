### Start server

```
npm ci

npm run db:create

npm run migrate:dev

npm run dev

to run tests - npm run test
```

### Routes

*POST* /signup - register new user

*POST* /signin - authorize user, get accesToken/refreshToken

*POST* /signin/new_token - update access/refresh token pair

*GET* /info - getting info about user

*GET* /logout - logout user

*POST* /file/upload - upload new file

*PUT* /file/update/:id - edit file in database and storage

*GET* /file/:id - getting file info

*GET* /file/list - getting file list with query (list_size & page)

DELETE /file/delete/:id - deleting file from dd and storage

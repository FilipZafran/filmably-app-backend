# Filmably App Backend

## <a href="https://filmably.netlify.app/" target="_blank">Live Demo</a>

The Backend for our Filmably App

## technologies used

- Node JS with Express JS
- MongoDB with Mongoose
- Passport Js for authentication
- nodemon for development

## Setup

```shell
$ git clone https://github.com/FilipZafran/filmably-app-backend.git
$ cd filmably-app-backend
$ npm install
$ npm run dev
```

## npm run dev

Runs the app in the development mode \
Use http://localhost:5000 to make api calls to our backend

# Endpoints

## Authenticate

```shell
method: 'POST', url: `${serverURL}/authenticate/login`, data: {"username": "<username>", "password": "<password>"}
```

- username not found response {message: "No User Exists"}
- password does not match username response null
- success response {"message": "Successfully Athenticated", "user": {"username": "<username>"}}

```shell
method: 'POST', url: `${serverURL}/authenticate/register`, data: {"username": "<username>", "password": "<password>"}
```

- username already exists response "User Already Exists"
- success response "User Created"

```shell
method: 'GET', url: `${serverURL}/authenticate/user`, withCredentials: true
```

- no user logged /in response null
- user currently logged /in response {"username": "<username>", "id": "<id>"}

```shell
method: 'GET', url: `${serverURL}/authenticate/logout`, withCredentials: true
```

- no user logged /in response null
- user successfully logged /out response "<username> Logged Out"

## Like Tracker

```shell
method: 'PUT', url: `${serverURL}/likeTracker/like`, data: <film object>, withCredentials: true
```

- success returns "<film title> added to likes"

```shell
method: 'PUT', url: `${serverURL}/likeTracker/dislike`, data: <film object>, withCredentials: true
```

- success return "<film title> added to dislikes"

```shell
method: 'GET', url: `${serverURL}/likeTracker/likes`, withCredentials: true
```

- success returns {likes: [<array of film objects sorted by date liked>]}

```shell
method: 'GET', url: `${serverURL}/likeTracker/dislikes`, withCredentials: true
```

```shell
method: 'DELETE', url: `${serverURL}/likeTracker/likes`, data: {films: [<film object>, <film object>, ...]}, withCredentials: true
```

```shell
method: 'DELETE', url: `${serverURL}/likeTracker/dislikes`, data: {films: [<film object>, <film object>, ...]}, withCredentials: true
```

```shell
method: 'GET', url: `${serverURL}/likeTracker/filters`, withCredentials: true
```

```shell
method: 'POST', url: `${serverURL}/likeTracker/filters`, data: {filters: genreFilters: {filter: boolean, filter: boolean, ...}, timeFilters: {filter: boolean, filter: boolean, ...}} withCredentials: true
```

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

<br>

# Endpoints

<br>

## Authenticate

---

```shell
method: 'POST', url: `${serverURL}/authenticate/login`, data: {"username": "<username>", "password": "<password>"}
```

- username not found response {message: "No User Exists"}
- password does not match username response _null_
- success response {"message": "Successfully Athenticated", "user": {"username": "\<username>"} }

```shell
method: 'POST', url: `${serverURL}/authenticate/register`, data: {"username": "<username>", "password": "<password>"}
```

- username already exists response "User Already Exists"
- success response "User Created"

```shell
method: 'GET', url: `${serverURL}/authenticate/user`, withCredentials: true
```

- no user logged in response _null_
- user currently logged /in response {"username": "\<username>", "id": "\<id>"}

```shell
method: 'GET', url: `${serverURL}/authenticate/logout`, withCredentials: true
```

- no user logged in response _null_
- user successfully logged out response "\<username> Logged Out"

<br>

## Like Tracker

---

```shell
method: 'PUT', url: `${serverURL}/likeTracker/like`, data: {"film": <film object>}, withCredentials: true
```

- success returns "\<film title> added to likes"
- saves the film object and date stamps when the film was liked

```shell
method: 'PUT', url: `${serverURL}/likeTracker/dislike`, data: {"film": <film object>}, withCredentials: true
```

- success return "\<film title> added to dislikes"
- saves the film object and date stamps when the film was disliked

```shell
method: 'GET', url: `${serverURL}/likeTracker/likes`, withCredentials: true
```

- success returns {likes: [{date: \<datestamp>, film: \<film object>}, {date: \<datestamp when liked>, film: \<film object>}, ...]}
- array is sorted by datestamp from most recent to least recently liked

```shell
method: 'GET', url: `${serverURL}/likeTracker/dislikes`, withCredentials: true
```

- success returns {dislikes: [{date: \<datestamp>, film: \<film object>}, {date: \<datestamp when liked>, film: \<film object>}, ...]}
- array is sorted by datestamp from most recent to least recently disliked

```shell
method: 'DELETE', url: `${serverURL}/likeTracker/likes`, data: {films: [<film object>, <film object>, ...]}, withCredentials: true
```

- success returns "removed from likes"
- removes film from the likes array and adds it to the dislikes array with a current datestamp

```shell
method: 'DELETE', url: `${serverURL}/likeTracker/dislikes`, data: {films: [<film object>, <film object>, ...]}, withCredentials: true
```

- success returns "removed from dislikes"
- removes film from the dislikes array and adds it to the likes array with a current datestamp

```shell
method: 'GET', url: `${serverURL}/likeTracker/filters`, withCredentials: true
```

- success returns {filters: {genreFilters: ["\<filter>", "\<filter>", ...], timeFilters: ["\<filter>", "\<filter>", ...]}}
- keys represent all filters availibe and boolean value represents whether the filter is active
- if no filters have been initialized by the user the response will be {filters: {}}

```shell
method: 'POST', url: `${serverURL}/likeTracker/filters`, data: {filters: {genreFilters: ["<filter>", "<filter>", ...], timeFilters: ["<filter>", "<filter>", ...]}} withCredentials: true
```

- success returns "filters updated"

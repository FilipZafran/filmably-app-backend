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
method: 'GET', url: `${serverURL}/authenticate/user`, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- no user logged in response _null_
- user currently logged /in response {"username": "\<username>", "id": "\<id>"}

<br>

## Like Tracker

---

```shell
method: 'PUT', url: `${serverURL}/likeTracker/like`, data: {"film": <film object>}, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- success returns "\<film title> added to likes"
- saves the film object and date stamps when the film was liked

```shell
method: 'PUT', url: `${serverURL}/likeTracker/dislike`, data: {"film": <film object>}, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- success return "\<film title> added to dislikes"
- saves the film object and date stamps when the film was disliked

```shell
method: 'GET', url: `${serverURL}/likeTracker/likes`, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- success returns {likes: [{date: \<datestamp>, film: \<film object>}, {date: \<datestamp when liked>, film: \<film object>}, ...]}
- array is sorted by datestamp from most recent to least recently liked

```shell
method: 'GET', url: `${serverURL}/likeTracker/dislikes`, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- success returns {dislikes: [{date: \<datestamp>, film: \<film object>}, {date: \<datestamp when liked>, film: \<film object>}, ...]}
- array is sorted by datestamp from most recent to least recently disliked

```shell
method: 'DELETE', url: `${serverURL}/likeTracker/likes`, data: {films: [<film object>, <film object>, ...]}, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- success returns "removed from likes"
- removes film from the likes array and adds it to the dislikes array with a current datestamp

```shell
method: 'DELETE', url: `${serverURL}/likeTracker/dislikes`, data: {films: [<film object>, <film object>, ...]}, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- success returns "removed from dislikes"
- removes film from the dislikes array and adds it to the likes array with a current datestamp

```shell
method: 'GET', url: `${serverURL}/likeTracker/filters`, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- success returns {filters: {genreFilters: ["\<filter>", "\<filter>", ...], timeFilters: ["\<filter>", "\<filter>", ...]}}
- keys represent all filters availibe and boolean value represents whether the filter is active
- if no filters have been initialized by the user the response will be {filters: {}}

```shell
method: 'POST', url: `${serverURL}/likeTracker/filters`, data: {filters: {genreFilters: ["<filter>", "<filter>", ...], timeFilters: ["<filter>", "<filter>", ...]}}, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- success returns "filters updated"

<br>

## Movies

---

```shell
method: 'POST', url: `${serverURL}/movies/newList`, data: {"name": <list name>, "url": <IMDB request url not including api key or list id>, "listId": <list id if applicable>, "filterName": <desired name of filter>, "fitlerType": <time, genre, or default>}
```

- success returns "\<list name> list created"
- if a list by that name already exists, "list already exists," will be returned

```shell
method: 'DELETE', url: `${serverURL}/movies/movieList/:listName`
```

- success returns "list deleted"
- if no list by that name is found, "list not found," will be returned

```shell
method: 'PATCH', url: `${serverURL}/movies/movieList/:listName', headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- if the list has not been updated in the past 24 hours, the list will be refreshed based on new information from the external API, the datestamp will be updated and 'list updated' will be returned
- if the list has been updated in the past 24 hours, "list updated on \<datestamp of update>" will be returned
- if no list by that name is found, "no list found," will be returned

```shell
method: 'GET', url: `${serverURL}/movies/filterNames`
```

- success returns an object {filters: {genreFilters: [\<filter name>, \<filter name>, ...], defaultFilters: [\<filter name>, \<filter name>, ...], timeFilters: [\<filter name>, \<filter name>, ...]}

<br>

## To Swipe

```shell
method: 'GET', url: `${serverURL}/toSwipe`, headers: { 'x-auth-token': localStorage.getItem('x-auth-token') }
```

- success returns an array of film objects [\<film>, \<film>, \<film>]
- failure returns an error message

## Password Reset

```shell
method: 'POST', url: ${serverURL}/resetPassword/reset, data: {'email': '<email>'}
```

- user gets an email with a token and a not working link !!!
- i need a FE route for reset pw, to send a link to the user with the token as parameter in the url

```shell
method: 'POST', url: ${serverURL}/resetPassword/newPassword, data: {'password': '<password>', 'token': '<token>'}
```

- password will be the new password
- the token is sent from the previous route via email

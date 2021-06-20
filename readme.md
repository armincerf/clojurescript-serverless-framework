# Helix • [TodoMVC](http://todomvc.com)

> Framework for building 'fullstack' applications using ClojureScript, Hasura, Auth0 and PostgreSQL. This is probably the quickest way to prototype new applications, especially if they have a realtime component, though it can also be used in production if you are mindful of the following points:
- You are happy with the pricing models of Auth0 and Hasura (Though Auth0 is relativly easy to swap out for something else, and Hasura is open source and can be self hosted).
- You are ok with using PostgreSQL or MySQL as a database. With Hasura you will not need to write much SQL if thats an issue, but some projects are better served by alternative databases such as Crux which offers fast graph queries with built in bitemporality.
- You are happy to give up some control. With a traditional web application, its easy to manually tweak database queries for performance, or use the REPL to inspect the backend code. With Hasura these things are basically impossible as you trade that flexibility for convinience. There are however, usually decent workarounds for these issues, you just might have to leave your comfort zone.

## Quick start

TODO add hasura+auth0 setup steps
https://www.notion.so/Docs-fb1367f45bb943ef9d44a257e419082b

You will need [Node.js](https://nodejs.org/en/) and [Clojure CLI tools](https://clojure.org/guides/getting_started) installed on your machine.

```
npm i

npm start
```

Navigate to http://localhost:8888


![](https://github.com/tastejs/todomvc-app-css/raw/master/screenshot.png)

## Resources + Support

- [Helix GitHub Repo](https://github.com/Lokeh/helix)
- [Slack](https://clojurians.net) channel: `#helix`

*Let [Todo MVC](https://github.com/tastejs/todomvc/issues) if you discover anything worth sharing.*


<!-- ## Implementation -->

<!-- How was the app created? Anything worth sharing about the process of creating the app? Any spec violations? -->


## Credit

Created by [Will Acton](https://lilac.town)

**PRIVATE AND CONFIDENTIAL: DO NOT FORK!**

**Status: DEV - Not yet ready for use!**

Lunchroom Mockup
================

This project will replace the existing lunchroom. See: [github.com/goodybag/lunchroom/issues/8](https://github.com/goodybag/lunchroom/issues/8)


Documentation
=============


Architecture
------------

The system sets up a component-based bi-directional connection as follows:

`PostgreSQL <-> Knex <-> Bookshelf <-> Endpoints <-> JSON API <-> Backbone <-> React`

Links to primary external projects:

  * http://www.postgresql.org/
  * http://knexjs.org/
  * http://bookshelfjs.org/
  * http://endpointsjs.com/
  * http://jsonapi.org/
  * http://backbonejs.org/
  * https://facebook.github.io/react/

Components have sub-components and the system is built out of nested components that have frontend and backend aspects to them.


Components
----------

Components are stored in `./components` and automatically bundled for the client using [webpack](http://webpack.github.io/).

Component structure:

  * `routes.js` - (server) - Route incoming requests to controller actions.
  * `controller.js` - (server) - Handle incoming actions.
  * `model.js` - (server) - Encapsulated data model to perform actions on schema.
  * `schema.js` - (server) - PostgreSQL data schema.
  * `index.jsx` - (client) - Backbone and React business logic.


Roadmap
=======

  1. Implement components using minimal abstraction to deliver functional prototype.
  2. (future) Abstract component commonalities and share model and controller between server and client.
  3. (future) Ensure components comply with [Web Components](http://webcomponents.org/) specifications.


Notes
=====

  * This system was originally put in place by [christoph@christophdorn.com](mailto:christoph@christophdorn.com). For questions at any time, please send email.

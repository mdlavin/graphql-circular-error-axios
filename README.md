### A demonostration of Apollo Server issue #1433

To demonstrate the "Converting circular structure to JSON" failure described
in [Apollo Server issue #1433](https://github.com/apollographql/apollo-server/issues/1433)
use execute this project with `npm start`

The output you should see is:

```
Apollo Server on http://localhost:54750/graphql
A network error occurred while executing the query
The error was:
{
  "message": "Converting circular structure to JSON",
  "extensions": {
    "code": "INTERNAL_SERVER_ERROR",
    "exception": {
      "stacktrace": [
        "TypeError: Converting circular structure to JSON",
        "    at JSON.stringify (<anonymous>)",
        "    at prettyJSONStringify (/Users/mattlavin/Projects/graphql-circular-error-axios/node_modules/apollo-server-core/src/runHttpQuery.ts:434:15)",
        "    at /Users/mattlavin/Projects/graphql-circular-error-axios/node_modules/apollo-server-core/src/runHttpQuery.ts:307:16",
        "    at Generator.next (<anonymous>)",
        "    at fulfilled (/Users/mattlavin/Projects/graphql-circular-error-axios/node_modules/apollo-server-core/dist/runHttpQuery.js:4:58)",
        "    at <anonymous>",
        "    at process._tickDomainCallback (internal/process/next_tick.js:229:7)"
      ]
    }
  }
}
```

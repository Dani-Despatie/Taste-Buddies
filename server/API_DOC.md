# Taste Buddies Backend

## Endpoints Overview

| URL | Method | Description |
| --- | ------ | ----------- |


## Endpoint Details

## Data Structures

### User

```js
{
    _id: String (from uuid),
    userName: String,
    email: String,
    password: String (encrypted),
    recipes: [Recipe IDs],
    favourites: [Recipe IDs]
}
```
 
### Recipe

```js
{
    _id: String (from uuid),
    name: String,
    authorName: String,
    date: Date.now(),
    type: String,
    description: String,
    amountMade: String,
    ingredients: [Strings],
    instructions: [Strings],
    tags: [Strings],
    ratings: [Numbers]
}
```
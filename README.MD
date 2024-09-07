# **React Cards - Assignment Instructions**

This exercise will give you practice writing your own custom hooks. We’ve provided you with an app, but the code could use some refactoring.

## **Step One: Read the Code**

- [x] Start by downloading the app, and getting it set up:

[react-cards-pokemon.zip](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f5fdeb39-70b3-4747-808b-f56447fabfdd/react-cards-pokemon.zip)

The app uses two APIs: the **Deck of Cards API** and the **Pokemon API**, to generate different types of cards on the page.

Play around with the app to get a sense for how it works. Draw out the component hierarchy in your pair and make sure you understand how all of the pieces fit together.

## **Step Two: `useFlip`**

- [x] COMPLETE

Both the `PokemonCard` and the `PlayingCard` components can be flipped over when clicked on. You may have noticed that there is some duplicate code in these components. Create a `hooks.js` file in `src/`, and in that file write a custom hook called `useFlip` which will hold the business logic for flipping any type of card.

`useFlip` doesn’t need to take an argument, and similar to `useState`, it should return an array with two elements. The first element is the current flip state of the card, and the second element is a function that will toggle the flip state.

Once you’ve written this hook, refactor `PokemonCard` and `PlayingCard` to use this custom hook.

### `PlayingCard` - original:

```javascript
import React, { useState } from "react";
import backOfCard from "./back.png";
import "./PlayingCard.css"

/* Renders a single playing card. */
function PlayingCard({ front, back = backOfCard }) {
  const [isFacingUp, setIsFacingUp] = useState(true);
  const flipCard = () => {
    setIsFacingUp(isUp => !isUp);
  };
  return (
    <img
      src={isFacingUp ? front : back}
      alt="playing card"
      onClick={flipCard}
      className="PlayingCard Card"
    />
  );
}

export default PlayingCard;
```

### `PokemonCard` - original:

```javascript
import React, { useState } from "react";
import "./PokemonCard.css";

/* Renders a single pokemon card. */
function PokemonCard({ front, back, name, stats }) {
  const [isFacingUp, setIsFacingUp] = useState(true);
  const flipCard = () => {
    setIsFacingUp(isUp => !isUp);
  };
  return (
    <div onClick={flipCard} className="PokemonCard Card">
      {isFacingUp ? (
        <div className="PokemonCard-front">
          <img src={front} alt={`{name} front`} />
          <div>
            <p className="PokemonCard-name">{name}</p>
            <ul className="PokemonCard-stats">
              {stats.map(stat => (
                <li key={stat.name}>
                  <em>{stat.name}</em>: {stat.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="PokemonCard-back">
          <img src={back} alt={`{name} back`} />
        </div>
      )}
    </div>
  );
}

export default PokemonCard;
```

### `useFlip` custom hook:

```javascript
import { useState } from "react";

export function useFlip() {
  const [isFacingUp, setIsFacingUp] = useState(true);
  const flip = () => {
    setIsFacingUp(isUp => !isUp);
  };
  return [isFacingUp, flip];
}
```

## **Step Three: `useAxios` in `PlayingCardList`**

- [x] COMPLETE

In the `PlayingCardList` component, we initialize an empty array in state, and add to it via an AJAX request we make with `axios`. Since we use `axios` in a few components, let’s move this logic into a function called `useAxios`.

`useAxios` should take in a URL, and similar to `useState`, it should return an array with two elements. The first element is an array of data obtained from previous AJAX requests (since we will add to this array, it’s a piece of state). The second element is a function that will add a new object of data to our array.

Once you’ve written this hook, refactor `PlayingCardList` to use this custom hook. (Don’t worry about `PokeDex` for now - that’s coming in the next part!

### original `PlayingCardList`:

```javascript
import React, { useState } from "react";
import {v1 as uuid} from "uuid";
import axios from "axios";
import PlayingCard from "./PlayingCard";
import "./PlayingCardList.css";

/* Renders a list of playing cards.
 * Can also add a new card at random. */
function CardTable() {
  const [cards, setCards] = useState([]);
  const addCard = async () => {
    const response = await axios.get(
      "https://deckofcardsapi.com/api/deck/new/draw/"
    );
    setCards(cards => [...cards, { ...response.data, id: uuid() }]);
  };
  return (
    <div className="PlayingCardList">
      <h3>Pick a card, any card!</h3>
      <div>
        <button onClick={addCard}>Add a playing card!</button>
      </div>
      <div className="PlayingCardList-card-area">
        {cards.map(cardData => (
          <PlayingCard key={cardData.id} front={cardData.cards[0].image} />
        ))}
      </div>
    </div>
  );
}

CardTable.defaultProps = {};

export default CardTable;
```

### `useAxios` hook:

```javascript
import { useState } from "react";
import axios from "axios";

export function useAxios(url) {
  const [data, setData] = useState([]);

  const addData = async () => {
    const response = await axios.get(url);
    setData(data => [...data, response.data]);
  };

  return [data, addData];
}
```

## **Step Four: `useAxios` in `PokeDex`**

`PokeDex` also make AJAX requests, but this one’s a bit trickier. `PlayingCardList` makes a request to the same endpoint every time, but the endpoint in `PokeDex` depends on the name of the pokemon.

Figure out a way to modify your `useAxios` hook so that when you call `useAxios` you can just provide a base url, and when you want to add to your array of response data in state, you can provide the rest of the url.

Once you’ve done this, refactor `PokeDex` to use `useAxios`. Make sure `PlayingCardList` still works too!

**NB --> Please let us see your code at this point!**

### original `useAxios`: 

```javascript
import { useState } from "react";
import axios from "axios";

export function useAxios(url) {
    const [data, setData] = useState([]);
  
    const addData = async () => {
      const response = await axios.get(url);
      setData(data => [...data, response.data]);
    };
  
    return [data, addData];
  }
```

### refactored `useAxios` 2.0: 

```javascript
export function useAxios(baseUrl) {
  const [data, setData] = useState([]);

  const addData = async (endpoint = "") => {
    const response = await axios.get(`${baseUrl}${endpoint}`);
    setData(data => [...data, response.data]);
  };

  return [data, addData];
}
```

### refactored `PlayingCardList`:

```javascript
import React from "react";
import { v1 as uuid } from "uuid";
import { useAxios } from "./hooks";
import PlayingCard from "./PlayingCard";
import "./PlayingCardList.css";

/* Renders a list of playing cards.
 * Can also add a new card at random. */
function PlayingCardList() {
  const [cards, addCard] = useAxios("https://deckofcardsapi.com/api/deck/new/draw/");

  const handleAddCard = async () => {
    await addCard();
  };

  return (
    <div className="PlayingCardList">
      <h3>Pick a card, any card!</h3>
      <div>
        <button onClick={handleAddCard}>Add a playing card!</button>
      </div>
      <div className="PlayingCardList-card-area">
        {cards.map(cardData => (
          <PlayingCard key={uuid()} front={cardData.cards[0].image} />
        ))}
      </div>
    </div>
  );
}

export default PlayingCardList;
```

### Original `Pokedex`:

```javascript
import React, { useState } from "react";
import {v1 as uuid} from "uuid";
import axios from "axios";
import PokemonSelect from "./PokemonSelect";
import PokemonCard from "./PokemonCard";
import "./PokeDex.css";

/* Renders a list of pokemon cards.
 * Can also add a new card at random,
 * or from a dropdown of available pokemon. */
function PokeDex() {
  const [pokemon, setPokemon] = useState([]);
  const addPokemon = async name => {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}/`
    );
    setPokemon(pokemon => [...pokemon, { ...response.data, id: uuid() }]);
  };
  return (
    <div className="PokeDex">
      <div className="PokeDex-buttons">
        <h3>Please select your pokemon:</h3>
        <PokemonSelect add={addPokemon} />
      </div>
      <div className="PokeDex-card-area">
        {pokemon.map(cardData => (
          <PokemonCard
            key={cardData.id}
            front={cardData.sprites.front_default}
            back={cardData.sprites.back_default}
            name={cardData.name}
            stats={cardData.stats.map(stat => ({
              value: stat.base_stat,
              name: stat.stat.name
            }))}
          />
        ))}
      </div>
    </div>
  );
}

export default PokeDex;
```


## **Further Study: Removing response data**

Add two buttons to the page: one that will erase all of the playing cards in state, and one that will erase all of the pokemon cards.

Since these arrays are controlled from within the *useAxios* hook, one way to approach this would be to have *useAxios* have a third element in its return array: a function that will remove everything from the array in state.

## **Further Study: Minimizing state**

The original application threw all of the response data into state, even though we didn’t use all of it. For example, we only need an image url from the Deck of Cards API, and the Pokemon API gives us a ton of data we don’t need.

One way to avoid throwing all of this information in state is to pass a formatting function to *useAxios*. This function should take the response data and extract only the information we need to render our component.

Write two formatting functions - one for our playing card and one for our Pokemon card - and then refactor *useAxios* to accept a formatting function.

At the end of this process, our array in state for *PlayingCardList* should look like

`[{ id, image }, ...]` ,

and our array in state for *PokeDex* should look like

`[{ id, front, back, name, stats: [{ name, value }, ...] }, ... ]`.

## **Further Study: *useLocalStorage* hook**

If we sync our arrays of state data to local storage, we could persist our cards even after a page refresh. Let’s build a custom hook called *useLocalStorage* which works like *useState*, except it also syncs to local storage after every state change, and tries to read from local storage when the component renders.

*useLocalStorage* should accept two arguments. The first should be a key, corresponding to the key in local storage. The second should be an initial value to put into local storage (assuming no value already exists).

Once you have written this hook, refactor *useAxios* to use *useLocalStorage* instead of *useState*.
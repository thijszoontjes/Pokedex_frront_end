#### App functionality

- [x] Working Expo Go project, should be able to scan the QR code and see the app running on any device.
- [x ] PokeAPI is used to fetch Pokemon data https://pokeapi.co/
  - [x ] List of Pokemon is loaded from the API.
  - [ x] Pokemon details (metadata, stats, evolution chain) are loaded from the API.
- [ x] List of Pokemon is displayed in a FlatList.
  - [x ] Must be able to filter the list by name using the search bar.
- [x ] Pokemon details are displayed in a ScrollView.
  - [x ] Must be able to navigate to the Pokemon details page from the list.
  - [ x] Must be able to favorite the Pokemon.
  - [ x] Must display type(s) for the Pokemon and use a unique color for each type.
  - [ x] Pokemon detail tabs should be swipeable left and right.
- [ x] Favorites list is displayed in a FlatList.
  - [x ] Must be able to navigate to the Pokemon details page from the favorites list.
  - [ x] Must be able to unfavorite the Pokemon.
  - [x ] Empty state must be displayed when there are no favorites.
- [x ] Pokemon actions must include:
    - [x ] Favorite.
    - [ x] Share.
    - [x ] Open in detail view.
- [x ] All async operations must include an loading and error state.
    - [ x] Fetching Pokemon list.
    - [ x] Fetching Pokemon details.
    - [x ] Fetching Pokemon evolution chain.

#### Project setup
- [ x] Tanstack Query for API calls.
- [x ] Expo Router for navigation.
- [x ] SQLite for local storage.
- [x ] Uses Typescript with no TS errors.
- [x ] Uses ESLint with no ESLint errors. (ideally use [React Compiler Linter](https://docs.expo.dev/guides/react-compiler/#enabling-the-linter))
- [x ] Uses Separation of Concerns (determine a project structure that follows this principle).
- [x ] Expo Font is used to implement [the font](./assets/fonts.zip).


### Optional items
Each optional item is worth 1 extra point.

- [x ] Use of animations (e.g. loading in UI elements).
- [x ] Dark mode support (making use of theming).
- [x ] Pokemon list is paginated and infinite scroll is used.
- [x ] Clean Typescript: no use of `any`, typecasting `as SomeType`, or TS ignore comments.
- [ ] Pixel Perfect Design on either iOS or Android.
- [x ] No bugs, console errors and use of console.log.
- [x ] Added [localizations](https://docs.expo.dev/guides/localization/) for the app.
- [x ] Adds Pokémon Battle Feature.

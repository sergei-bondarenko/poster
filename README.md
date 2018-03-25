# Poster

## Description

A simple blog platform for [ZeroNet](https://github.com/HelloZeroNet/ZeroNet) written from scratch using [Vue.js](https://vuejs.org/) and [Bulma](https://bulma.io/). This project available [online](http://127.0.0.1:43110/1J2ZJjs97wEcW36x5d9f1QnPVPVDv8wbJ/) (you need a ZeroNet client running to view the site).

## Key features

- Mobile friendly
- Endless newsfeed (no pages) with dynamic post appending when the page bottom has been reached
- Editable posts and comments
- Post editor supports uploading of images, videos and audio files
- Filtering by last comments and most liked posts by day, week, month, year or all the time
- Direct links to posts are available (click on the post date to get it)
- Vertical wrapping of long posts
- Easily clonable
- Site title and description configurable via `content.json` file (or via the sidebar)

## Utils

There are currently two utils in the `utils/` folder:

- `cleaner.py` - cleaner for the files in `uploads/` directory: Deletes files which are not included in the `data/data.json`. Also finds duplicates.
- `poster.py` - for creating multiple blog posts using files from a specified directory. One file per post. Reqires a [python-magic](https://github.com/ahupp/python-magic) installed.

## Screenshots

![](screenshots/0.png?raw=true)
![](screenshots/1.png?raw=true)
![](screenshots/2.png?raw=true)

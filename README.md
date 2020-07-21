# Resourceful

_(Duly note that this project is still heavily a WIP)_

**Resourceful** is an Electron app which intention is to make it easy to store
resources, or links to resources, in project form. When you work in projects,
especially as a software developer, you usually need to keep track of various
documents, links to project resources like online meeting groups,
specifications, time tracking services, code editor project files and so on.

It can be a cognitive load to keep all these things in order. And this is where
**Resourceful** is ment to give some relief.

Create a project in **Resourceful**, copy and past urls straight in the app,
drag and drop PDF, image, and pretty much any other file or directoy onto the
app and you will have easy access to all your project files.

_Dark mode (with system accent color)_
![Dark mode](ss-dark.png)

_Light mode (with system accent color)_
![Light mode](ss-light.png)

---

## Feature todo

- Better theming based on system preferences.
  At the moment there's no theming of any Material UI widgets ([Issue 1][i1])

- Ordering of project tabs ([Issue2][i2])

- ~~Save and reuse app window size and position ([Issue 3][i3])~~

- ~~Edit-forms for projects and resources ([Issue 4][i4])~~

- ~~Support for snippet resources ([Issue 5][i5])~~

- Support for command resources
  (e.g. start a Docker container and stuff like that) ([Issue 6][i6])

- Ordering/placement of resources ([Issue 7][i7])

- Project workspace zoom ([Issue 8][i8])

- App settings ([Issue 9][i9])

- Authentication of protected web resources ([Issue 10][i10])

- ...and the list will go on

---

## Running

At the moment there are no binary builds so the app needs to be run from source.

`cd` into `packages/resourceful-app` and run

```
# Installs all NPM packges
yarn

# Builds the app
yarn build

# Starts the app
yarn start
```

[i1]: https://github.com/poppa/resourceful/issues/1
[i2]: https://github.com/poppa/resourceful/issues/2
[i3]: https://github.com/poppa/resourceful/issues/3
[i4]: https://github.com/poppa/resourceful/issues/4
[i5]: https://github.com/poppa/resourceful/issues/5
[i6]: https://github.com/poppa/resourceful/issues/6
[i7]: https://github.com/poppa/resourceful/issues/7
[i8]: https://github.com/poppa/resourceful/issues/8
[i9]: https://github.com/poppa/resourceful/issues/9
[i10]: https://github.com/poppa/resourceful/issues/10

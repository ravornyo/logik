# Logik
Logik is a simple web editor for boolean algebra. It is a showcase of [Langium]([https://langium.org](https://github.com/langium/langium)/) DSL framework. The web editor is complimented by a logic diagram powered by [Sprotty](https://github.com/eclipse-sprotty/sprotty).

## Running Web Editor
![screenshot](https://user-images.githubusercontent.com/877171/235789552-70737b07-667d-4fbf-86e3-9068b6eedfe6.png)

To run logik in the web, you need to first install dependencies and then build the project. From the root folder run the following commands.

```
npm install
npm run build:web
```

The build command will setup the web asset files in the public folder. You can start a simple express app on localhost:3000 by running the following.

```
npm run serve
```


You can view a demo of the web editor at https://ravornyo.github.io/logik/.

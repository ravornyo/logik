# Logik
Logik is a simple web editor for boolean algebra. It is a showcase of [Langium](https://github.com/langium/langium) DSL framework. The web editor is complimented by a logic diagram powered by [Sprotty](https://github.com/eclipse-sprotty/sprotty).

## Running Web Editor
![screenshot](https://user-images.githubusercontent.com/877171/235789552-70737b07-667d-4fbf-86e3-9068b6eedfe6.png)

To run logik in the web, you need to first install dependencies and then build the project. From the root folder run the following commands.

```
npm install
npm run build:web
```

The build command will setup the web asset files in the public folder. You can start the express app by running the command below. The running web app should be available at localhost:3000.

```
npm run serve
```

You can view a demo of the web editor at https://ravornyo.github.io/logik/.

## Logik Grammar
Logik has a simple grammar that comprises of 3 operators. **+** for logic OR, **\*** or **X** for logic AND and **'** for a logic NOT. A logik program consists of several statements, with each statement on a separate line and terminated by the ";". The general syntax of a statement is as follows:
```
[LVALUE] = [EXPRESSION];
```

Single line comments are supported with **#** or **//**;

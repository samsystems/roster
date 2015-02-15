Inventory UI
=================

## Dependencies

- [AngularJS](https://github.com/angular/angular.js)
- [Restmod](https://github.com/platanus/angular-restmod)
- [Bootstrap](https://github.com/twbs/bootstrap)

## Guidelines

- Absolutely no DOM manipulation outside directives. And inside directives it should be kept to minium. There's an angular way for almost everything.
- Everything is a component. There should be a minimum amount of html code outside directives.
- Model based. There's a model for evertyhing.
- All API requests are done through [Restmod](https://github.com/platanus/angular-restmod).
- Absolutelty no "spanglish" in the system please.
- The coding style selected is [CameCase](http://en.wikipedia.org/wiki/CamelCase).

## UI Directives

### Structure

This is the general structure used in the UI. Every aspect of the page is converted into a component (directive). Every new page should follow this structure. Boostrap grid system may be used to create structure but only inside the page-content directive.

```
<!doctype html>
<html class="no-js">
<head></head>
<body>
<nav-bar></nav-bar>
<page>
    <left-sidebar></left-sidebar>
    <right-sidebar></right-sidebar>

    <page-content>
        <ui-view></ui-view>
    </page-content>
</page>
```

### UI View Structure
```
<page-content-title title="..." icon="..."></page-content-title>
<panel title="..." type="...">
    ...
</panel>
...
```

### Page Content Title

Page content title directives are used to declare an specific page title.

```
<page-content-title title="..." icon="...">
    ...
</page-content-title>
```

### Panel

Panels are the containers used in every page through the UI.

```
<panel title="..." type="...">
    ...
</panel>
```

[![codecov](https://codecov.io/gh/mfe-pro/highlighter/branch/main/graph/badge.svg?token=IBB6PC8S7C)](https://codecov.io/gh/mfe-pro/highlighter)

# MFE Pro Highlighter

![MFE Pro Highlighter](./logo.png)

**MFE Pro Highlighter** is a library to highlight micro frontend components with gradient borders and dynamic tooltips.

## How to Use

1. Import the script from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/mfe-pro-highlighter@latest/dist/highlighter.min.js"></script>
```

2. Call the function to start the highlight:

```html
  <div class="block" data-mfe-highlighter="true" data-mfe-name="my-package-name" data-mfe-owner="team-a"
           data-mfe-version="1.0.0">Test Element
  </div>
<script>
   MFEHighlighter.init({
      org: '@my-org',
      barColor: '#ff0000',
      fontColor: '#ff0000',
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00'
    });
</script>
```
# Basic Eye Tracking Example

Simple example showing basic eye tracking setup.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Basic Eye Tracking</title>
</head>
<body>
  <h1>Look around the screen</h1>
  <div id="gaze-dot"></div>

  <script type="module">
    import webgazer from 'https://cdn.jsdelivr.net/npm/@webgazer-ts/core@latest/dist/webgazer-ts.js'\;

    // Start tracking
    await webgazer.begin();

    // Show gaze position
    webgazer.setGazeListener((data) => {
      if (data) {
        const dot = document.getElementById('gaze-dot');
        dot.style.left = `${data.x}px`;
        dot.style.top = `${data.y}px`;
      }
    });
  </script>

  <style>
    #gaze-dot {
      position: fixed;
      width: 10px;
      height: 10px;
      background: red;
      border-radius: 50%;
      pointer-events: none;
    }
  </style>
</body>
</html>
```

## See Also

- [Getting Started](/guide/getting-started)
- [Basic Usage](/guide/core/basic-usage)
- [More Examples](https://github.com/jhndrncrz/webgazer-ts/tree/main/examples)

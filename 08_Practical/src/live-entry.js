if (import.meta.env?.MODE) {
  import('./main.jsx')
} else {
  const stylesheet = document.createElement('link')
  stylesheet.rel = 'stylesheet'
  stylesheet.href = new URL(/* @vite-ignore */ '../dist/assets/app.css', import.meta.url)
  document.head.append(stylesheet)
  import(new URL(/* @vite-ignore */ '../dist/assets/app.js', import.meta.url).href)
}

export function cssVar01() {
  import('./index.css')
  document.querySelector('#root')!.innerHTML = `
  <div class="content">
    <div class="item">
    </div>
  </div>
  `

  function action() {
    const container = document.querySelector<HTMLDivElement>('.content')!
    const w = container.clientWidth
    container.style.setProperty('--w', `${w}px`)
  }

  setTimeout(() => {
    action()
  }, 200)
}

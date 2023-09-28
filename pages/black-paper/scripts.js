
for (const label of document.querySelectorAll(".label")) {
  label.addEventListener("click", (event) => {
    event.preventDefault()
    event.stopPropagation()
    let lab = event.target
    for (const focused of document.querySelectorAll(".focused")) { focused.classList.remove('focused') }
    lab.classList.add('focused')
    openPaper(lab)
    if (lab.hasAttribute("for")) {
      let f = lab.getAttribute("for")
      for (const nested of lab.parentNode.querySelectorAll(".nested")) {
        if (nested.hasAttribute("for") && nested.getAttribute("for") === f) {
          //THIS IS THE NESTED LAYER FOR OUR LABEL THIS INSTANCE
          if (nested.classList.contains("open")) {
            nested.classList.remove("open")
            lab.classList.remove("open")
          } else {
            nested.classList.add("open")
            lab.classList.add("open")
          }
        }
      }
    }
  })
}

function openPaper(label){
  const forId = label.parentNode.hasAttribute("for") ? `${label.parentNode.getAttribute("for")}---` : ''
  const id = `${forId}${label.innerHTML.replace(/ /g, '--')}`
  // console.log(id, `[data-id="${id}"]`)
  for(const data of document.querySelectorAll(`[data-id]`)){data.classList.remove('open')}
  if (document.querySelector(`[data-id="${id}"]`)) { document.querySelector(`[data-id="${id}"]`).classList.add('open') }
  else {
    document.querySelector(`[data-id="not-found"] h1`).innerHTML = id.replace(/---/g, ' - ').replace(/--/g, ' ')
    document.querySelector(`[data-id="not-found"]`).classList.add('open')
  }
}

openPaper(document.querySelector(".label.focused"))
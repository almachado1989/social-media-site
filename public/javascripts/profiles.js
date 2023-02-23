fetch("http://localhost:5555/api/people")
  .then((response) => response.json())
  .then((result) => showProfiles(result))

function showProfiles(data) {
  const container = document.querySelector(".container")

  data.forEach((entry) => {
    const card = document.createElement("div")
    const name = document.createElement("h2")
    const status = document.createElement("p")
    const pfp = document.createElement("img")

    name.innerHTML = entry.name
    status.innerHTML = entry.status
    pfp.src = entry.image

    card.appendChild(pfp)
    card.appendChild(name)
    card.appendChild(status)

    container.appendChild(card)
  })
}

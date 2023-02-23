fetch("http://localhost:5555/people/al")
  .then((response) => response.json())
  .then((result) => showProfile(result))

console.log(window.location.pathname.split("/").pop())

function showProfile(person) {
  console.log(person)
  const container = document.querySelector(".container")

  const card = document.createElement("div")
  const name = document.createElement("h2")
  const status = document.createElement("p")
  const pfp = document.createElement("img")

  name.innerHTML = person[0].name
  status.innerHTML = person[0].status
  pfp.src = person[0].image

  card.appendChild(pfp)
  card.appendChild(name)
  card.appendChild(status)

  container.appendChild(card)
}

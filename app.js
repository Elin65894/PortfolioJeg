const state = {
    projects: [],
    query: ''
}

document.getElementById('year').textContent = new Date().getFullYear()

// Sätt din GitHub här (ändra om du vill)
//const githubUrl = 'https://github.com/Elin65894'
//document.getElementById('githubLink').href = githubUrl

const grid = document.getElementById('projectsGrid')
const emptyState = document.getElementById('emptyState')
const q = document.getElementById('q')

q.addEventListener('input', (e) => {
    state.query = e.target.value.trim().toLowerCase()
    render()
})

async function loadProjects() {
    const res = await fetch('projects.json')
    state.projects = await res.json()
    render()
}

function matches(project, query) {
    if (!query) return true
    const hay = [project.title, project.description, ...(project.tags || [])]
        .join(' ')
        .toLowerCase()
    return hay.includes(query)
}

function projectCard(p) {
    const tags = (p.tags || [])
        .map((t) => `<span class="tag">${t}</span>`)
        .join('')
    const repo = p.links?.repo
        ? `<a class="btn btn-ghost" href="${p.links.repo}" target="_blank" rel="noreferrer">Repo</a>`
        : ''
    const video = p.links?.video
        ? `<a class="btn btn-ghost" href="${p.links.video}" target="_blank" rel="noopener noreferrer">Video</a>`
        : ''
    const demo = p.links?.demo
        ? `<a class="btn" href="${p.links.demo}" target="_blank" rel="noreferrer">Demo</a>`
        : ''

    return `
    <article class="project">
      <div>
        <h3 style="margin:0 0 6px 0;">${p.title}</h3>
        <p class="muted" style="margin:0;">${p.description}</p>
      </div>
      <div class="tags">${tags}</div>
      <div class="cta-row">${demo}${video}${repo}</div>
    </article>
  `
}

function render() {
    const filtered = state.projects.filter((p) => matches(p, state.query))
    grid.innerHTML = filtered.map(projectCard).join('')
    emptyState.hidden = filtered.length !== 0
}

// PWA: registrera service worker
//if ('serviceWorker' in navigator) {
  //  window.addEventListener('load', () => {
    //    navigator.serviceWorker.register('service-worker.js')
 //   })
//}

loadProjects()

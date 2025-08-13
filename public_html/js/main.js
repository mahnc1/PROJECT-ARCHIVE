document.addEventListener("DOMContentLoaded", () => {
// Touch-only dropdown toggle (prevents conflicts on desktop hover)
const isTouch = window.matchMedia && window.matchMedia('(hover: none)').matches;
if (isTouch) {
    document.addEventListener('click', function(e){
        const toggler = e.target.closest('.dropdown > a');
        if (toggler) {
            e.preventDefault();
            const menu = toggler.parentElement.querySelector('.dropdown-menu');
            menu.classList.toggle('show');
            return;
        }
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
        }
    });
}
    fetch("data/projects.json")
        .then(res => res.json())
        .then(projects => {
            const projectList = document.getElementById("projectList");
            const homeGrid = document.getElementById("homeGrid");
            const projectDetail = document.getElementById("projectDetail");

            projects.forEach(p => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="project.html?id=${p.id}">${p.title}</a>`;
                projectList.appendChild(li);
            });

            if (homeGrid) {
                projects.forEach(p => {
                    const img = document.createElement("img");
                    img.src = p.coverImage;
                    img.alt = p.title;
                    img.addEventListener("click", () => {
                        window.location.href = `project.html?id=${p.id}`;
                    });
                    img.onload = () => img.classList.add("loaded");
                    homeGrid.appendChild(img);
                });
            }

            if (projectDetail) {
                const params = new URLSearchParams(window.location.search);
                const projectId = params.get("id");
                const project = projects.find(p => p.id === projectId);

                if (project) {
                    project.images.forEach(src => {
                        const img = document.createElement("img");
                        img.src = src;
                        img.onload = () => img.classList.add("loaded");
                        projectDetail.appendChild(img);
                    });

                    project.videos.forEach(src => {
                        const video = document.createElement("video");
                        video.src = src;
                        video.controls = true;
                        video.onloadeddata = () => video.classList.add("loaded");
                        projectDetail.appendChild(video);
                    });

                    const desc = document.createElement("div");
                    desc.className = "description";
                    desc.textContent = project.description;
                    projectDetail.appendChild(desc);
                }
            }
        })
        .catch(err => console.error("Error loading projects:", err));
});

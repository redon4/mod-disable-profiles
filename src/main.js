const { invoke } = window.__TAURI__.core;

function makeModListElement(mcMod) {
    return (
`<li class="mc_mod">
    <img class="mc_mod__icon"
        src="https://cdn.modrinth.com/data/EsAfCjCV/icon.png"
    >
    <div class="mc_mod__name">${mcMod.name}</div>
    <div class="mc_mod__toggle">toggle</div>
</li>`)
}

async function drawModList(path) {
    path = "/mnt/c/Users/danie/AppData/Roaming/ModrinthApp/profiles/Fabric 26.2/mods"
    let list = "";
    const modList = await invoke("get_folder_mods", {path: path });
    modList.forEach(mcMod => {
        list += makeModListElement(mcMod)
    });

    document.querySelector(".mod_list").innerHTML = list;
}


window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".sel_folder").addEventListener("click", drawModList)
    drawModList()
});

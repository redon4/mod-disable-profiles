const { invoke } = window.__TAURI__.core;
const { dirname } = window.__TAURI__.path.dirname;

function makeModListElement(mcMod) {
    return (
`<li class="mc_mod">
    <img class="mc_mod__icon"
        src="https://cdn.modrinth.com/data/EsAfCjCV/icon.png"
    >
    <div class="mc_mod__middle">
        <div class="mc_mod__middle__name">${mcMod.name}</div>
        <div class="mc_mod__middle__path">${mcMod.path}</div>
    </div>
    <div class="mc_mod__toggle">toggle</div>
</li>`)
}

async function drawModList(path) {
    path = "/mnt/c/Users/danie/AppData/Roaming/ModrinthApp/profiles/Fabric 26.2/mods";
    let list = "";
    const modList = await invoke("get_folder_mods", {path: path });
    modList.forEach(mcMod => {
        list += makeModListElement(mcMod)
    });

    document.querySelector(".mod_list").innerHTML = list;
    document.querySelectorAll(".mc_mod__toggle").forEach(toggleButton => {
        toggleButton.addEventListener("click", () => toggleButtonClick(toggleButton));
        toggleButton.classList.add("disabled");
    })
}

async function toggleButtonClick(button) {
    // spam proofing
    button.disabled = true;
    // gets red/green
    button.classList.toggle("disabled");

    // needed for the disable feature
    let path = button.parentElement.querySelector(".mc_mod__middle__path").innerHTML;

    try {
        await invoke("disable_mod", { path: path, disabled: button.classList.contains("disabled") });
    } catch (error) {
        console.log("Mod-Disable-Error: ", error);
        // reversed click when theres an error
        button.classList.toggle("disabled");
    // spam proofing
    } finally {
        button.disabled = false;
        drawModList( dirname(path) );
    }
}

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".sel_folder").addEventListener("click", drawModList)
    drawModList()

});

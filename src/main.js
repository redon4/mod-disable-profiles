const { invoke } = window.__TAURI__.core;
const { dirname } = window.__TAURI__.path;
const { open } = window.__TAURI__.dialog;

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
    // the list of mcMod Objects
    const modListElement = document.querySelector(".mod_list");
    let modList;

    // reset the list
    modListElement.innerHTML = "";

    try {
        console.log("Calling get_folder_mods with path:", path);
        modList = await invoke("get_folder_mods", {path: path });
        console.log("Received modList:", modList); 
    } catch (error) {
        console.log("Error: ", error);
        let errorElement = document.createElement("div");
        errorElement.innerHTML = "path error: " + error;
        modListElement.appendChild(errorElement);
        return
    } 

    if (!modList || modList.length === 0) {
        console.log("Modlist empty!")
        let errorElement = document.createElement("div");
        errorElement.innerHTML = "Thats an empty folder!";
        modListElement.appendChild(errorElement);
        return
    }

    // construcrt entry for every mod
    modList.forEach(mcMod => {
        const tempMod = document.createElement("div");
        tempMod.innerHTML = makeModListElement(mcMod);

        if ( mcMod.path.endsWith(".disabled") ) {
            tempMod
            .querySelector(".mc_mod__toggle")
            .classList.add("disabled");
        }

        modListElement.appendChild(tempMod)
    });

    document.querySelectorAll(".mc_mod__toggle").forEach(toggleButton => {
        toggleButton.addEventListener("click", () => toggleButtonClick(toggleButton));
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
        drawModList( await dirname(path) );
    }
}

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".sel_folder").addEventListener("click", async () => {
        const folder = await open({ multiple: false, directory: true, });
        drawModList(folder);
    });
});

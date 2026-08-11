const { invoke } = window.__TAURI__.core;

async function getFolderMods(path) {
    return await invoke("get_folder_mods", { path: path });
}

async function drawModList() {
    let list = "";
    const modList = await getFolderMods("/home/redon");
    modList.forEach(mcMod => {
        list += "<li>" + mcMod.name + "</li>"
    });

    document.querySelector("#list").innerHTML = list;
}

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".sel_folder").addEventListener("click", drawModList)
});

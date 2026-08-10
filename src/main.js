const { invoke } = window.__TAURI__.core;

let greetInputEl;
let greetMsgEl;

async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

async function get_folder_list() {
    let list = "";
    const nameList = await invoke("get_folder_list", { path: "/home/redon" })
    nameList.forEach(element => {
        list += "<li>" + element + "</li>"
    });

    document.querySelector("#list").innerHTML = list;
}

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".sel_folder").addEventListener("click", get_folder_list)
});

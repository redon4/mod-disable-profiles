// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// for js being able to read it
#[derive(serde::Serialize)]
// to store the info about the mod
struct FabricMod {
    name: String,
    path: String,
    // icon: String,
}

#[tauri::command]
fn get_folder_mods(path: &str) -> Vec<FabricMod> {
    // the vector that gets the Mods Info
    let mut name_vec: Vec<FabricMod> = Vec::new();

    let entries = std::fs::read_dir(path).unwrap();
    for entry in entries {
        let entry = match entry {
            Ok(value) => value,
            Err(_) => continue,
        };

        let name: String = match
            &entry
            .file_name()
            .into_string()
        {
            Ok(value) => String::from(value),
            Err(_e) => String::from("INVALID NAME"),
        };

        let path = match
            &entry
            .path()
            .to_str()
        {
            Some(value) => String::from(*value),
            None => String::from("INVALID PATH"),
        };

        name_vec.push(
            FabricMod {
                    name,
                    path,
            }
        );
    }

    name_vec
}

#[tauri::command]
fn disable_mod(_path: &str, _disabled: bool) {

}

/// # Panics
/// should NEVER happen
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_folder_mods, disable_mod])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

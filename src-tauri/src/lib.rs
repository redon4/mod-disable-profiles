use std::path::Path;
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
fn get_folder_mods(path: &str) -> Result<Vec<FabricMod>, String> {
    // the vector that gets the Mods Info
    let mut mod_vec: Vec<FabricMod> = Vec::new();

    let entries = std::fs::read_dir(path).map_err(|err| err.to_string())?;
    for entry in entries {
        // let entry = match entry {
        //     Ok(value) => value,
        //     Err(_) => continue,
        // };
        // Compiler said this is better:
        let Ok(entry) = entry else { continue };

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

        mod_vec.push(FabricMod { name, path });
    }

    mod_vec.sort_by(|a, b| a.name.cmp(&b.name));

    Ok(mod_vec)
}

#[tauri::command]
fn disable_mod(path: &str, disabled: bool) -> Result<(), String> {
    // disabled = if it got disabled
    let og_path = Path::new(path);

    let new_path = if disabled {
        // if it got disabled
        og_path.with_added_extension("disabled")
    } else if path.ends_with(".disabled") {
        og_path.with_extension("")
    } else {
        og_path.to_path_buf()
    };

    // println!("({}) => {} -> {}", disabled, og_path.display(), new_path.display());

    std::fs::rename(og_path, new_path).map_err(|err| err.to_string())
}

/// # Panics
/// should NEVER happen
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_folder_mods, disable_mod])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
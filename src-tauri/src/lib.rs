// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn get_folder_list(path: &str) -> Vec<String> {
    let entries = std::fs::read_dir(path).unwrap();
    let name_vec: Vec<String> = entries
        .filter_map(|entry| entry.ok()?.file_name().into_string().ok())
        .collect();

    name_vec
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_folder_list])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

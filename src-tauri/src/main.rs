// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn update_save_file(invoke_message: String) {
  println!("Do save with this: {}", invoke_message);
} 

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![update_save_file])
    .run(tauri::generate_context!())
    .expect("Error while running tauri application");
}

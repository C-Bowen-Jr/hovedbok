use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn update_save_file(invoke_message: String) {
  println!("Do save with this: {}", invoke_message);
} 

fn main() {
    let file_menu = Submenu::new("File", Menu::new()
      .add_item(CustomMenuItem::new("newproduct", "New Product").accelerator("cmdOrControl+N"))
      .add_item(CustomMenuItem::new("editproduct", "Edit Product"))
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Quit));
    let hovedbok_menu = Submenu::new("Hovedbok", Menu::new()
      .add_item(CustomMenuItem::new("help", "Help"))
      .add_item(CustomMenuItem::new("about", "About")));
    let menu = Menu::new()
      .add_submenu(file_menu)
      .add_submenu(hovedbok_menu);
    tauri::Builder::default()
    .menu(menu)
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "newproduct" => {
            let _ = event.window().emit("menu-event", "new-product-event").unwrap();
          }
        "quit" => {
          std::process::exit(0);
        }
        _ => {}
      }
    })
    .invoke_handler(tauri::generate_handler![update_save_file])
    .run(tauri::generate_context!())
    .expect("Error while running tauri application");
}

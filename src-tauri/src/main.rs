use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use rusty_money::{Money, iso};
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn update_save_file(invoke_message: String) {
  println!("Do save with this: {}", invoke_message);
} 

#[tauri::command]
fn calculate_fee(js_expense: String) -> String {
    let rs_expense = Money::from_str(js_expense.as_str(), iso::USD).expect("Invalid expense recieved");
    println!("{}", rs_expense * 65);
    return "result".to_string();
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
    .invoke_handler(tauri::generate_handler![update_save_file, calculate_fee])
    .run(tauri::generate_context!())
    .expect("Error while running tauri application");
}

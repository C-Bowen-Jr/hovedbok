use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use rusty_money::{Money, iso};
use rust_decimal::prelude::*;
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn update_save_file(invoke_message: String) {
  println!("Do save with this: {}", invoke_message);
} 

#[tauri::command]
fn calculate_etsy_fee(js_earnings: String, js_quantity: i32) -> String {
    let rs_earnings = Money::from_str(js_earnings.as_str(), iso::USD).expect("Invalid earnings recieved");
    let cost_from_per_item = Money::from_minor(20, iso::USD) * js_quantity;
    let cost_from_earnings_percentage = rs_earnings * Decimal::new(65,3); // 6.5%
    let fee = cost_from_earnings_percentage + cost_from_per_item;
    return format!("{}", &fee).to_string();
}

#[tauri::command]
fn calculate_paypal_fee(js_earnings: String) -> String {
    let rs_earnings = Money::from_str(js_earnings.as_str(), iso::USD).expect("Invalid earnings recieved");
    let cost_per_transaction = Money::from_minor(30, iso::USD);
    let cost_from_earnings_percentage = rs_earnings * Decimal::new(29,3); // 2.9%
    let fee = cost_from_earnings_percentage + cost_per_transaction;
    return format!("{}", &fee).to_string();
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
    .invoke_handler(tauri::generate_handler![update_save_file, calculate_etsy_fee, calculate_paypal_fee])
    .run(tauri::generate_context!())
    .expect("Error while running tauri application");
}

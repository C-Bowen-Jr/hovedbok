use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use rusty_money::{Money, iso};
use rust_decimal::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Result;
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
/* Example JSON object
   '{
        "order": {
            "date": "2023-10-26",
            "order_number": 1,
            "expense": "3.14",
            "fee": "1.23",
            "earnings": "10.26",
            "tags": "Etsy,Discount",
            "order_line": [
                {
                    "order_number": 1,
                    "sku": "DSCORPS",
                    "quantity": 1,
                }
            ]
        }
    }'
    */
#[derive(Serialize, Deserialize)]
struct Order {
    date: String,
    order_number: u16,
    expense: String,
    fee: String,
    earnings: String,
    tags: String,
    order_lines: Vec<OrderLine>,
}

#[derive(Serialize, Deserialize)]
struct OrderLine {
     order_number: u16,
     sku: String,
     quantity: u16,
}

#[derive(Serialize, Deserialize)]
struct Save {
    products: Vec<Product>,
    tag_presets: Vec<Tag>,
    buying_presets: Vec<Purchase>,
}

#[derive(Serialize, Deserialize)]
struct Product {
    img: String,
    title: String,
    sku: String,
}

#[derive(Serialize, Deserialize)]
struct Tag {
    key: String,
    label: String,
}

#[derive(Serialize, Deserialize)]
struct Purchase {
    quantity: String,
    name: String,
    cost: String,
    tags: String,
    includes: String,
}

#[tauri::command]
fn update_save_file(payload: String) -> bool {
    let read_save = serde_json::from_str(&payload);
    println!("Got json string: {}", &payload);
    let save_object: Save = match read_save {
        Ok(save) => save,
        Err(error) => { println!("{:?}",error); return false; },
      };
      println!("stuff {}", &save_object.tag_presets[0].label);
      return true;
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

#[tauri::command]
fn publish_sale(payload: String) -> bool {
    let read_order = serde_json::from_str(&payload);
    let order_object: Order = match read_order {
        Ok(order) => order,
        Err(error) => { println!("{:?}",error); return false; },
    };
    println!("Got data on order number {}", &order_object.order_number);
    return true;
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
    .invoke_handler(tauri::generate_handler![update_save_file, calculate_etsy_fee, calculate_paypal_fee, publish_sale])
    .run(tauri::generate_context!())
    .expect("Error while running tauri application");
}

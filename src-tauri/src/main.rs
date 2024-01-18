use std::fs::File;
use std::io::Write;
use std::path::Path;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, Manager};
use rusty_money::{Money, iso};
use rust_decimal::prelude::*;
use rusqlite::{Connection};
use serde::{Deserialize, Serialize};
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
struct Purchase {
    date: String,
    purchase_number: u16,
    purchase_lines: Vec<PurchaseLine>,
    total_expense: String,
}

#[derive(Serialize, Deserialize)]
struct PurchaseLine {
     purchase_number: u16,
     item: String,
     quantity: u16,
     expense: String,
     tags: String,
}

#[derive(Serialize, Deserialize)]
struct Save {
    company_info: CompanyInfo,
    products: Vec<Product>,
    tag_presets: Vec<Tag>,
    buying_presets: Vec<Buys>,
}

#[derive(Serialize, Deserialize)]
struct Product {
    img: String,
    title: String,
    sku: String,
    variant: String,
    quantity: u16,
    sold: u16,
    released: String,
    retired: bool,
}

#[derive(Serialize, Deserialize)]
struct CompanyInfo {
    name: String,
    address: String,
    unit: String,
    city: String,
    state: String,
    zip: String,
    logo: String,
    url: String,
}

#[derive(Serialize, Deserialize)]
struct Tag {
    key: String,
    label: String,
}

#[derive(Serialize, Deserialize)]
struct Buys {
    quantity: String,
    name: String,
    cost: String,
    tags: String,
    includes: String,
}

#[derive(Serialize, Deserialize)]
struct DbMetrics {
    success: bool,
    sales: SaleMetrics,
    purchases: PurchaseMetrics,
}

#[derive(Serialize, Deserialize)]
struct SaleMetrics {
    earnings: f64,
    fees: f64,
    expenses: f64,
    orders: i32,
    items: i32,
}

#[derive(Serialize, Deserialize)]
struct PurchaseMetrics {
    expenses: f64,
    orders: i32,
    items: i32,
}

#[tauri::command]
fn update_save_file(payload: String) -> bool {
    let read_save = serde_json::from_str(&payload);
    let save_object: Save = match read_save {
        Ok(save) => save,
        Err(error) => { println!("{:?}",error); return false; },
      };
      
      let mut save_file = File::create("resource/data.json").expect("Couldn't override data.json");
      let save_text = serde_json::to_string_pretty(&save_object).expect("Coudn't unwrap JSON save object");
      save_file.write(&save_text.as_bytes()).expect("Couldn't write data");
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
    let conn = open_ledger();

    let read_order = serde_json::from_str(&payload);
    let order_object: Order = match read_order {
        Ok(order) => order,
        Err(error) => { 
            println!("Publish Sale: Read Sale data:\n{:?}", error); 
            return false; 
        },
    };

    match conn.execute(
        "INSERT INTO sale (date, order_number, expense, fee, earnings, tags)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        (&order_object.date, &order_object.order_number, &order_object.expense, &order_object.fee, &order_object.earnings, &order_object.tags),
    ) {
        Ok(_) => println!(""),
        Err(error) => { 
            println!("Publish Sale: Insert Sale:\n{:?}", error); 
            return false; 
        },
    }

    for line in &order_object.order_lines {
        match conn.execute(
            "INSERT INTO saleline (order_number, sku, quantity)
             VALUES (?1, ?2, ?3)",
             (&order_object.order_number, &line.sku, &line.quantity),
        ) {
            Ok(_) => println!(""),
            Err(error) => {
                println!("Publish Sale: Insert Sale lines:\n{:?}", error);
                return false;
            },
        }
    }

    return true;
}

#[tauri::command]
fn publish_purchase(payload: String) -> bool {
    let conn = open_ledger();

    let read_purchase = serde_json::from_str(&payload);
    let purchase_object: Purchase = match read_purchase {
        Ok(purchase) => purchase,
        Err(error) => { 
            println!("Publish Purchase: Read Purchase data:\n{:?}", error); 
            return false; 
        },
    };

    match conn.execute(
        "INSERT INTO purchase (date, purchase_number, total_expense)
         VALUES (?1, ?2, ?3)",
        (&purchase_object.date, &purchase_object.purchase_number, &purchase_object.total_expense),
    ) {
        Ok(_) => println!(""),
        Err(error) => { 
            println!("Publish Purchase: Insert Purchase:\n{:?}", error); 
            return false; 
        },
    }

    for line in &purchase_object.purchase_lines {
        match conn.execute(
            "INSERT INTO purchaseline (purchase_number, item, quantity, expense, tags)
             VALUES (?1, ?2, ?3, ?4, ?5)",
             (&purchase_object.purchase_number, &line.item, &line.quantity, &line.expense, &line.tags),
        ) {
            Ok(_) => println!(""),
            Err(error) => {
                println!("Publish Purchase: Insert Purchase lines:\n{:?}", error);
                return false;
            },
        }
    }

    return true;
}

#[tauri::command]
fn query_with(payload: String) -> DbMetrics{
    let conn = open_ledger();
    let mut sale_earnings = 0.0;
    let mut sale_fees = 0.0;
    let mut sale_expenses = 0.0;
    let mut sale_orders = 0;
    let mut sale_items = 0;
    let mut purchase_expenses = 0.0;
    let mut purchase_orders = 0;
    let mut purchase_items = 0;
    let mut success = true;

    // Not accurately effective. Data gather should be by means of:
    // SELECT id FROM <sale|purchase> [WHERE <date range>] = array of ids
    // Then for each id, select sum or count as appropriate where id matches

    /*let mut sale_id_stmt = conn.prepare(format!("SELECT order_number FROM sale {0}", &payload).as_str())?;
    let mut sale_ids = sale_id_stmt.query(NO_PARAMS)?;
    let mut purchase_id_stmt = conn.prepare(format!("SELECT order_number FROM sale {0}", &payload).as_str())?;
    let mut purchase_ids = purchase_id_stmt.query(NO_PARAMS)?;*/

    match  conn.query_row(
        format!("SELECT SUM(earnings) FROM sale {0}", &payload).as_str(), [],
        |row| row.get(0),
    ) {
        Ok(value) => sale_earnings = value,
        Err(rusqlite::Error::InvalidColumnType(_,_,_)) => sale_earnings = 0.0,
        Err(error) => {println!("Query_With: Sale Earnings: {}", error); success = false;},
    };

    match  conn.query_row(
        format!("SELECT SUM(fee) FROM sale {0}", &payload).as_str(), [],
        |row| row.get(0),
    ) {
        Ok(value) => sale_fees = value,
        Err(rusqlite::Error::InvalidColumnType(_,_,_)) => sale_fees = 0.0,
        Err(error) => {println!("Query_With: Sale Fees: {}", error); success = false;},
    };

    match  conn.query_row(
        format!("SELECT SUM(expense) FROM sale {0}", &payload).as_str(), [],
        |row| row.get(0),
    ) {
        Ok(value) => sale_expenses = value,
        Err(rusqlite::Error::InvalidColumnType(_,_,_)) => sale_expenses = 0.0,
        Err(error) => {println!("Query_With: Sale Expenses: {}", error); success = false;},
    };

    match  conn.query_row(
        format!("SELECT COUNT(*) FROM sale {0}", &payload).as_str(), [],
        |row| row.get(0),
    ) {
        Ok(value) => sale_orders = value,
        Err(rusqlite::Error::InvalidColumnType(_,_,_)) => sale_orders = 0,
        Err(error) => {println!("Query_With: Sale Orders: {}", error); success = false;},
    };

    match  conn.query_row(
        format!("SELECT SUM(quantity) FROM saleline WHERE order_number IN (SELECT order_number FROM sale {0})", &payload).as_str(), [],
        |row| row.get(0),
    ) {
        Ok(value) => sale_items = value,
        Err(rusqlite::Error::InvalidColumnType(_,_,_)) => sale_items = 0,
        Err(error) => {println!("Query_With: Sale Items: {}", error); success = false;},
    };

    match  conn.query_row(
        format!("SELECT SUM(expense) FROM purchaseline WHERE purchase_number IN (SELECT purchase_number FROM purchase {0})", &payload).as_str(), [],
        |row| row.get(0),
    ) {
        Ok(value) => purchase_expenses = value,
        Err(rusqlite::Error::InvalidColumnType(_,_,_)) => purchase_expenses = 0.0,
        Err(error) => {println!("Query_With: Purchase Expenses: {}", error); success = false;},
    };

    match  conn.query_row(
        format!("SELECT COUNT(*) FROM purchaseline WHERE purchase_number IN (SELECT purchase_number FROM purchase {0})", &payload).as_str(), [],
        |row| row.get(0),
    ) {
        Ok(value) => purchase_orders = value,
        Err(rusqlite::Error::InvalidColumnType(_,_,_)) => purchase_orders = 0,
        Err(error) => {println!("Query_With: Purchase Orders: {}", error); success = false;},
    };

    match  conn.query_row(
        format!("SELECT SUM(quantity) FROM purchaseline WHERE purchase_number IN (SELECT purchase_number FROM purchase {0})", &payload).as_str(), [],
        |row| row.get(0),
    ) {
        Ok(value) => purchase_items = value,
        Err(rusqlite::Error::InvalidColumnType(_,_,_)) => purchase_items = 0,
        Err(error) => {println!("Query_With: Purchase Items: {}", error); success = false;},
    };

    let sales_object = SaleMetrics{
        earnings: sale_earnings,
        fees: sale_fees,
        expenses: sale_expenses,
        orders: sale_orders,
        items: sale_items,
    };
    let purchase_object = PurchaseMetrics{
        expenses: purchase_expenses,
        orders: purchase_orders,
        items: purchase_items,
    };
    let db_object = DbMetrics{
        success: success,
        sales: sales_object,
        purchases: purchase_object,
    };
    
    return db_object;
}

#[tauri::command]
fn get_last_order_number() -> i32 {
    let conn = open_ledger();
    match conn.query_row(
        "SELECT order_number FROM sale ORDER BY rowid DESC LIMIT 1", [],
        |row| row.get(0),
    ) {
        Ok(last_order) => return last_order,
        Err(_) => return 0,
    }
}

#[tauri::command]
fn get_last_purchase_number() -> i32 {
    let conn = open_ledger();
    match conn.query_row(
        "SELECT purchase_number FROM purchase ORDER BY rowid DESC LIMIT 1", [],
        |row| row.get(0),
    ) {
        Ok(last_order) => return last_order,
        Err(_) => return 0,
    }
}

fn open_ledger() -> Connection {
    let ledger_database = "ledger.db";
    Connection::open(&ledger_database).expect("Couldn't connect to database")
}

fn main() {
    let ledger_database = "ledger.db";
    let ledger_path = Path::new(&ledger_database);
    if !ledger_path.exists() {
        let conn = open_ledger();
        conn.execute(
            "CREATE TABLE sale (
                id              INTEGER PRIMARY KEY,
                date            VARCHAR(10) NOT NULL,
                order_number    INT NOT NULL,
                expense         DECIMAL(10,2) NOT NULL,
                fee             DECIMAL(8,2) NOT NULL,
                earnings        DECIMAL(12,2) NOT NULL,
                tags            VARCHAR(64)
            )",
            (),
        ).expect("Create table 'Sale' failed");

        conn.execute("
            CREATE TABLE saleline (
                id              INTEGER PRIMARY KEY,
                order_number    INT NOT NULL,
                sku             VARCHAR(32) NOT NULL,
                quantity        INT NOT NULL
            )", 
            ()
        ).expect("Create table 'Saleline' failed");

        conn.execute("
            CREATE TABLE purchase (
                id              INTEGER PRIMARY KEY,
                date            VARCHAR(10) NOT NULL,
                purchase_number INT NOT NULL,
                total_expense   DECIMAL(12,2) NOT NULL
            )", 
            ()
        ).expect("Create table 'Purchase' failed");

        conn.execute("
            CREATE TABLE purchaseline (
                id              INTEGER PRIMARY KEY,
                purchase_number INT NOT NULL,
                item            VARCHAR(64) NOT NULL,
                quantity        INT NOT NULL,
                expense         DECIMAL(10,2) NOT NULL,
                tags            VARCHAR(64)
            )", 
            ()
        ).expect("Create table 'Purchaseline' failed");
    }
    
    let file_menu = Submenu::new("File", Menu::new()
      .add_item(CustomMenuItem::new("newproduct", "New Product").accelerator("cmdOrControl+N"))
      .add_native_item(MenuItem::Separator)
      .add_item(CustomMenuItem::new("forcesave", "Force Save").accelerator("cmdOrControl+V"))
      .add_item(CustomMenuItem::new("reprint", "Reprint").accelerator("cmdOrControl+V"))
      .add_native_item(MenuItem::Separator)
      .add_item(CustomMenuItem::new("editproductmode", "Edit Product Mode").accelerator("cmdOrControl+E"))
      .add_item(CustomMenuItem::new("salemode", "Sale Mode").accelerator("cmdOrControl+S"))
      .add_item(CustomMenuItem::new("restockmode", "Restock Mode").accelerator("cmdOrControl+R"))
      .add_native_item(MenuItem::Separator)
      .add_item(CustomMenuItem::new("companyinfo", "Set Company Info").accelerator("cmdOrControl+C"))
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Quit));
    let hovedbok_menu = Submenu::new("Hovedbok", Menu::new()
      .add_item(CustomMenuItem::new("help", "Help"))
      .add_item(CustomMenuItem::new("bmc", "\u{2615} Buy Me a Coffee")));
    let menu = Menu::new()
      .add_submenu(file_menu)
      .add_submenu(hovedbok_menu);
    tauri::Builder::default()
    .menu(menu)
    .setup(|app| {
        let main_window = app.get_window("main").unwrap();
        let _ = main_window.menu_handle().get_item("salemode").set_enabled(false);
        Ok(())
    })
    .on_menu_event(|event| {
      match event.menu_item_id() {
        "newproduct" => {
            let _ = event.window().emit("menu-event", "new-product-event").unwrap();
          }
        "forcesave" => {
            let _ = event.window().emit("menu-event", "force-save").unwrap();
        }
        "reprint" => {
            let _ = event.window().emit("menu-event", "reprint").unwrap();
        }
        "editproductmode" => {
            let _ = event.window().menu_handle().get_item("salemode").set_enabled(true);
            let _ = event.window().menu_handle().get_item("restockmode").set_enabled(true);
            let _ = event.window().menu_handle().get_item("editproductmode").set_enabled(false);
            let _ = event.window().emit("menu-event", "edit-product-mode").unwrap();
        }
        "salemode" => {
            let _ = event.window().menu_handle().get_item("salemode").set_enabled(false);
            let _ = event.window().menu_handle().get_item("restockmode").set_enabled(true);
            let _ = event.window().menu_handle().get_item("editproductmode").set_enabled(true);
            let _ = event.window().emit("menu-event", "sale-mode");
        }
        "restockmode" => {
            let _ = event.window().menu_handle().get_item("salemode").set_enabled(true);
            let _ = event.window().menu_handle().get_item("restockmode").set_enabled(false);
            let _ = event.window().menu_handle().get_item("editproductmode").set_enabled(true);
            let _ = event.window().emit("menu-event", "restock-mode");
        }
        "companyinfo" => {
            let _ = event.window().emit("menu-event", "edit-company-info").unwrap();
        }
        "help" => {
            let _ = event.window().emit("menu-event", "help-event").unwrap();
        }
        "bmc" => {
            let _ = event.window().emit("menu-event", "bmc-event").unwrap();
        }
        "quit" => {
          std::process::exit(0);
        }
        _ => {}
      }
    })
    .invoke_handler(tauri::generate_handler![
        update_save_file, 
        calculate_etsy_fee, 
        calculate_paypal_fee, 
        publish_sale, 
        publish_purchase,
        query_with,
        get_last_order_number,
        get_last_purchase_number,
    ])
    .run(tauri::generate_context!())
    .expect("Error while running tauri application");
}

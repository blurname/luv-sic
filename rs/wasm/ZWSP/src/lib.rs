use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn add_zwsp(name: String) -> String {
    // so many string concatenate ways, which should I choose
    //
    // path1
    // let result = format!("heddllo,{}", name);
    // alert(&name);
    // let mut output = String::from("");
    // for ch in name.chars() {
    //     output.push(ch);
    //     output.push('\u{200b}')
    // }

    // path2
    let mut output = String::from("");
    for ch in name.chars() {
        output.push_str(&(String::from(ch) + &String::from('\u{200b}')));
    }
    // alert("hello");
    // result.into()
    output
}

fn main() {
    add_zwsp(&String::from("helloworld"));
}
pub fn add_zwsp(name: &str) {
    // so many string concatenate ways, which should I choose
    //
    // path1
    let mut output = String::from("");
    for ch in name.chars() {
        output.push(ch);
        output.push('\u{200b}')
    }

    // path2
    // let mut output = String::from("");
    // for ch in name.chars() {
    //     output.push_str(&(String::from(ch) + &String::from('\u{200b}')));
    // }

    println!("{}", output)
}

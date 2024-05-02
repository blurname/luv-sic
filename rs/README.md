# rs

my Rust playground

## command

### wasm

- link pkg to fonrtend app

  ```bash
  ln -sfT ../../../bl-kit/src/wasm/${correspond-wasm}/ pkg
  ```

- keep rebuilding wasm-file

  ```bash
  fswatch -o -r ./src | xargs -I\{\} wasm-pack build --target web
  ```

kitty @ set-enabled-layouts grid
kitty @ launch --title 'imockFSP' --cwd ~/git/imock npm run FSP
kitty @ launch --title 'protoStart' --cwd ~/git/mb-proto 
kitty @ launch --title 'imockTerm' --cwd ~/git/imock 
kitty @ launch --title 'protoTerm' --cwd ~/git/mb-proto 
kitty @ launch --title 'flatTerm' --cwd ~/git/mb-flat-json 
kitty @ send-text -m title:"protoStart" Nis\r
# kitty @ focus-window --match title:"protoStart"
kitty @ launch --type tab
kitty @ focus-tab -m index:0

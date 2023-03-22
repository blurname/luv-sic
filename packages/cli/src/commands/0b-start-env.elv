kitty @ set-enabled-layouts grid
kitty @ launch --title 'mock1' --cwd ~/git/mock1 npm run xxx
kitty @ launch --title 'mock2' --cwd ~/git/mock2 
kitty @ launch --title 'mock3' --cwd ~/git/mock3
kitty @ launch --title 'mock4' --cwd ~/git/mock4
kitty @ launch --title 'mock5' --cwd ~/git/mock5
kitty @ send-text -m title:"mock2" Nis\r
# kitty @ focus-window --match title:"protoStart"
kitty @ launch --type tab
kitty @ focus-tab -m index:0

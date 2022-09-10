kitty @ set-enabled-layouts grid
kitty @ launch --title 'imockFSP' --cwd ~/git/imock npm run FSP
kitty @ launch --title 'workspaceMock' --cwd ~/git/mb-workspace npm run start:mock:server
kitty @ launch --title 'workspaceStart' --cwd ~/git/mb-workspace 
kitty @ launch --title 'imockTerm' --cwd ~/git/imock 
kitty @ launch --title 'workspaceTerm' --cwd ~/git/mb-workspace 
kitty @ focus-window --match title:"workspaceStart"
kitty @ launch --type tab
kitty @ focus-tab -m index:0

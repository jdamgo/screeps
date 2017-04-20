

doc: FORCE
	jsdoc --verbose -c jsdoc.json --template node_modules/minami

doc-blank: FORCE
	jsdoc --verbose -c jsdoc.json

remote: FORCE
	grunt --gruntfile gruntfile.js screeps

local: FORCE
	COPY ".\\src\\*.js" "C:\\Users\\kilia\\AppData\\Local\\Screeps\\scripts\\127_0_0_1___21025\\develop\\"



FORCE: ;

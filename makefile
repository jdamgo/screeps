

doc: FORCE
	jsdoc --verbose -c jsdoc.json

upload: FORCE
	grunt --gruntfile gruntfile.js screeps


FORCE: ;

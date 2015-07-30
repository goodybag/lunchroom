#!/bin/bash
# Source https://github.com/cadorn/bash.origin
. "$HOME/.bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"


	# TODO: We should declare the environment we want to run in
	#       and have whoever is calling us init the right environment
	#       so we don't need to do it here.
	if [ -e "$(dirname $BO_ROOT_SCRIPT_PATH)/activate" ]; then
		BO_sourcePrototype "$(dirname $BO_ROOT_SCRIPT_PATH)/activate"
	fi



	function ensureDependencies {
		BO_format "$VERBOSE" "HEADER" "Building lunchroom-mockup"
		pushd "$__BO_DIR__" > /dev/null

			# http://stackoverflow.com/a/22639444/330439
			"node_modules/.bin/bower" install --allow-root --config.interactive=false

		popd > /dev/null
		BO_format "$VERBOSE" "FOOTER"
	}

	function copyStyle {
		BO_format "$VERBOSE" "HEADER" "Copying style"
		pushd "$__BO_DIR__" > /dev/null

			local SOURCE_PATH=`sm.resolve 07-lunchroom-less`

			if [ -e "$__BO_DIR__/$SOURCE_PATH/dist/style.css" ]; then

				echo "Copying style from '$__BO_DIR__/$SOURCE_PATH/dist/style.css' to '$__BO_DIR__/www/style.css'"

				cp -f "$SOURCE_PATH/dist/style.css" "www/style.css"

			fi

		popd > /dev/null
		BO_format "$VERBOSE" "FOOTER"
	}

	ensureDependencies
	copyStyle

}
init $@
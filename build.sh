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
		BO_format "$VERBOSE" "HEADER" "Building lunchroom"
		pushd "$__BO_DIR__" > /dev/null

			# http://stackoverflow.com/a/22639444/330439
			"node_modules/.bin/bower" install --allow-root --config.interactive=false

		popd > /dev/null
		BO_format "$VERBOSE" "FOOTER"
	}

	function copyStyle {
		BO_format "$VERBOSE" "HEADER" "Copying style"
		pushd "$__BO_DIR__" > /dev/null

			# The Index skin which we abandoned
			# We now use the '07-lunchroom-style' to clobber the Semantic UI skin
			# We still keep the old skin running as an example of how to skin the site using
			# something else other than semantic UI.
			local SOURCE_PATH=`sm.resolve 07-lunchroom-less`
			if [ -e "$__BO_DIR__/$SOURCE_PATH/dist/style.css" ]; then
				echo "Copying style from '$__BO_DIR__/$SOURCE_PATH/dist/style.css' to '$__BO_DIR__/www/style.css'"
				cp -f "$SOURCE_PATH/dist/style.css" "www/style.css"
			fi

			# The landing page skin
			local SOURCE_PATH=`sm.resolve 07-lunchroom-landing`
			pushd "$__BO_DIR__/$SOURCE_PATH" > /dev/null
				gulp build
			popd > /dev/null
			echo "Copying from '$__BO_DIR__/$SOURCE_PATH/public/dist' to '$__BO_DIR__/www/dist'"
			cp -Rf "$SOURCE_PATH/public/dist" "www/dist"
			cp -Rf "$SOURCE_PATH/public/img" "www/img"

		popd > /dev/null
		BO_format "$VERBOSE" "FOOTER"
	}

	function bundleAssets {
		BO_format "$VERBOSE" "HEADER" "Bundle Assets"

echo "TODO"

		BO_format "$VERBOSE" "FOOTER"
	}

	function bundleApp {
		BO_format "$VERBOSE" "HEADER" "Bundle App"

echo "TODO"
		
		BO_format "$VERBOSE" "FOOTER"
	}

	function uglifyBundles {
		BO_format "$VERBOSE" "HEADER" "Uglify Bundles"
		pushd "$__BO_DIR__" > /dev/null

			"node_modules/.bin/defs" \
				--config "defs-config.json" \
				"www/assets.js" > "www/assets.defs.js"

			"node_modules/.bin/defs" \
				--config "defs-config.json" \
				".components.built/bundle.js" > ".components.built/bundle.defs.js"

			"node_modules/.bin/uglifyjs" \
				"www/assets.defs.js" \
				".components.built/bundle.defs.js" \
				-o "www/app.build.min.js" \
				-c -m

		popd > /dev/null
		BO_format "$VERBOSE" "FOOTER"
	}


	ensureDependencies
	copyStyle
	bundleAssets
	bundleApp
	uglifyBundles

}
init $@
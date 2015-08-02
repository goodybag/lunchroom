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


	function pushToHeroku {
		BO_format "$VERBOSE" "HEADER" "Pushing to Heroku"
		pushd "$__BO_DIR__" > /dev/null

	echo "ERROR: Cannot deploy manually. This project is setup to deploy from github to heroku using a webhook."
	return;

		if ! BO_has heroku ; then
			echo "ERROR: 'heroku' command not found! Install Heroku toolbelt first: https://toolbelt.heroku.com/"
			exit 1
		fi

		heroku git:remote -a goodybag-lunchroom-staging
		git push heroku master

		popd > /dev/null
		BO_format "$VERBOSE" "FOOTER"
	}

	pushToHeroku

}
init $@
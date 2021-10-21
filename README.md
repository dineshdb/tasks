# Tasks

Tasksfile for your common repetitive tasks

## tx: Integrating with your shell workflow

TODO: Use Taskfile at the root of project if not found on curren folder. Or even
better transverse upward via another custom script alias tx='deno run
<script-url>'

```bash
# Add following content in your rc file(.bashrc or .zshrc)

export DENO_HOME=$HOME/.deno
export PATH="${DENO_HOME}/bin:$PATH"

if_not_command() {
	local cmd=$1
	local script=$2
	if ! [ -x "$(command -v $cmd)" ]
	then
		eval "$script"
	fi
}

# to install deno automatically if it is not already. Comment out or change install directory
if_not_command deno "curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=$DENO_HOME sh"

# tx task. Run taskfiles directlty as ``$ tx <rule>``.
tx(){
	if [[ -f tasks.ts ]]
	then
	  deno run -A --unstable tasks.ts $@
	elif [[ -f tasks.ts ]]
	then
	  deno run -A --unstable tasks.ts $@
    else
      echo "No taskfile found"
    fi
}
```

## LICENSE

# SPDX-License-Identifier: MIT

#!/bin/bash

# push_all.sh - Project-specific configuration for push_projects.sh
#
# Runs the shared release workflow for sicorder_web. The project is private,
# so it is versioned, validated, committed, and pushed without an npm publish wait.
#
# Usage:
#   ./scripts/push_all.sh          # Update dependencies and push when changed
#   ./scripts/push_all.sh --force  # Force a version bump
#   ./scripts/push_all.sh --help   # Show shared workflow options

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Keep this as a one-project workflow. The shared script resolves project paths
# from WORKSPACE_DIR, just like the multi-project wrappers in sibling repos.
PROJECTS=(
    "../sicorder_extension:0"
    "../sicorder_web:0"
)

# Source reusable script: prefer local workflows repo, fall back to GitHub
LOCAL_SCRIPT="$(cd "$BASE_DIR" && pwd)/../workflows/scripts/push_projects.sh"
if [ -f "$LOCAL_SCRIPT" ]; then
    source "$LOCAL_SCRIPT"
else
    PUSH_SCRIPT=$(mktemp)
    trap "rm -f $PUSH_SCRIPT" EXIT
    if ! curl -fsSL "https://raw.githubusercontent.com/johnqh/workflows/main/scripts/push_projects.sh" -o "$PUSH_SCRIPT"; then
        echo "Error: Failed to download push_projects.sh from GitHub"
        exit 1
    fi
    source "$PUSH_SCRIPT"
fi

# Parse command-line arguments
parse_args "$@"

# Run the push process
run_push_projects "$BASE_DIR" "${PROJECTS[@]}"

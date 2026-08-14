#!/usr/bin/env bash
set -euo pipefail

BASE_BRANCH="dev"
CONVENTIONAL_COMMIT_REGEX='^(feat|fix|style|refactor|test|chore)(\([a-z0-9.-]+\))?: .+'

usage() {
  cat <<'EOF'
Usage:
  ./scripts/git-feature.sh branch <feature-branch-name>
  ./scripts/git-feature.sh commit "<type(scope): description>"

Examples:
  ./scripts/git-feature.sh branch feat/checklist-ui-reskin
  ./scripts/git-feature.sh commit "style(theme): add pokedex checklist design tokens"
EOF
}

require_git_repo() {
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "Error: not inside a git repository." >&2
    exit 1
  fi
}

validate_commit_message() {
  local message="$1"
  if [[ ! "$message" =~ $CONVENTIONAL_COMMIT_REGEX ]]; then
    echo "Error: commit message must match Conventional Commits." >&2
    echo "Expected format: type(scope): description" >&2
    echo "Allowed types: feat, fix, style, refactor, test, chore" >&2
    exit 1
  fi
}

create_branch() {
  local feature_branch="$1"

  if [[ -z "$feature_branch" ]]; then
    echo "Error: feature branch name is required." >&2
    usage
    exit 1
  fi

  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Warning: working tree has uncommitted changes." >&2
  fi

  echo "Checking out ${BASE_BRANCH}..."
  git checkout "$BASE_BRANCH"

  echo "Pulling latest origin/${BASE_BRANCH}..."
  git pull origin "$BASE_BRANCH"

  echo "Creating feature branch ${feature_branch} from ${BASE_BRANCH}..."
  git checkout -b "$feature_branch"

  echo "Ready on branch: $(git branch --show-current)"
}

commit_changes() {
  local message="$1"

  if [[ -z "$message" ]]; then
    echo "Error: commit message is required." >&2
    usage
    exit 1
  fi

  validate_commit_message "$message"

  git add -A

  if git diff --cached --quiet; then
    echo "Error: nothing staged to commit." >&2
    exit 1
  fi

  git commit -m "$message"
  echo "Committed: $message"
}

main() {
  require_git_repo

  local command="${1:-}"
  shift || true

  case "$command" in
    branch)
      create_branch "${1:-}"
      ;;
    commit)
      commit_changes "${1:-}"
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"

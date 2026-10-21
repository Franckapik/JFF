#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
bash scripts/with-node.sh npm run validate
bash scripts/with-node.sh npm audit --audit-level=moderate

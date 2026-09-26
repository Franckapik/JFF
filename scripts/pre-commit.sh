#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run validate
npm audit --audit-level=moderate

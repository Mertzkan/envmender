# 🛠️ EnvMender

**Find missing variables. Fix your environment.**

EnvMender is a lightweight, open source CLI that validates your environment configuration files.

It compares your `.env` file against `.env.example` and detects missing, empty, and undocumented environment variables.

No account. No external services. No secrets printed.

## ✨ Features

- Detect missing environment variables
- Detect empty environment variables
- Find undocumented environment variables
- Support custom file paths
- Human-readable terminal output
- Machine-readable JSON reports
- CI-friendly exit codes
- Local processing without external APIs
- Written in TypeScript

## 📦 Installation

Requires Node.js 22.12.0 or newer.

Once published to npm:

```bash
npm install --save-dev envmender
```

You can also run the package with:

```bash
npx envmender check
```

## 🚀 Quick Start

Create a `.env.example` file:

```dotenv
APP_NAME=MyApp
DATABASE_URL=postgresql://localhost/example
API_KEY=placeholder
```

Create your `.env` file:

```dotenv
APP_NAME=MyApp
API_KEY=
```

Run:

```bash
npx envmender check
```

Example output:

```text
🛠️ EnvMender
==========================
Checking environment configuration...

Summary

  ✓ Valid:        1
  ✗ Missing:      1
  ✗ Empty:        1
  ⚠ Undocumented: 0

✗ Missing variables (1)
  DATABASE_URL

✗ Empty variables (1)
  API_KEY

==========================
✗ Validation failed
2 error(s), 0 warning(s)
```

## ⚙️ CLI Usage

### Check environment files

```bash
envmender check
```

### Use custom file paths

```bash
envmender check --env ./config/.env --example ./config/.env.example
```

### Generate JSON output

```bash
envmender check --format json
```

### Display help

```bash
envmender --help
```

### Display version

```bash
envmender --version
```

## 📊 JSON Output

EnvMender supports machine-readable JSON reports:

```json
{
  "schemaVersion": 1,
  "status": "passed",
  "summary": {
    "valid": 2,
    "missing": 0,
    "empty": 0,
    "undocumented": 0,
    "errors": 0,
    "warnings": 0
  },
  "variables": {
    "valid": ["APP_NAME", "PORT"],
    "missing": [],
    "empty": [],
    "undocumented": []
  }
}
```

## 🔄 CI Integration

EnvMender uses the following exit codes:

| Code | Meaning                                    |
| ---- | ------------------------------------------ |
| 0    | Validation passed                          |
| 1    | Missing or empty variables                 |
| 2    | File reading or validation execution error |

Example:

```bash
envmender check --format json
```

The command exits with code `1` if required variables are missing or empty.

Undocumented variables are warnings and do not cause validation to fail.

## 🔒 Security

EnvMender:

- Reads environment files locally
- Never sends data to an external API
- Does not modify environment files
- Does not print environment variable values
- Only reports variable names and validation results

Variable names themselves are included in reports. Review your reports before sharing them publicly.

## 🧪 Development

Clone the repository and install dependencies:

```bash
npm install
```

Start the CLI in development mode:

```bash
npm run dev -- check
```

Run tests:

```bash
npm test
```

Check TypeScript:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

## 📋 Current Limitations

- Supports dotenv-style files
- Does not validate variable types
- Does not expand variable references
- Does not check whether variables are used in source code
- Does not distinguish required and optional variables
- Assumes all example keys should be present and non-empty

Additional validation features are planned for future releases.

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome.

Please open a GitHub issue before implementing major changes.

## 📄 License

MIT License. See [LICENSE](LICENSE).

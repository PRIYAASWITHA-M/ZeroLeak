import re


def scan_code(code):

    findings = []

    patterns = {
        "API Key": {
            "pattern": r"api[_-]?key\s*[:=]\s*['\"][^'\"]+['\"]",
            "severity": "HIGH"
        },

        "Password": {
            "pattern": r"(password|passwd|pwd)\s*[:=]\s*['\"][^'\"]+['\"]",
            "severity": "HIGH"
        },

        "Secret": {
            "pattern": r"(secret|secret[_-]?key)\s*[:=]\s*['\"][^'\"]+['\"]",
            "severity": "MEDIUM"
        },

        "Access Token": {
            "pattern": r"(token|access[_-]?token|auth[_-]?token)\s*[:=]\s*['\"][^'\"]+['\"]",
            "severity": "HIGH"
        },

        "Private Key": {
            "pattern": r"-----BEGIN .*PRIVATE KEY-----",
            "severity": "CRITICAL"
        }
    }

    for name, rule in patterns.items():

        matches = re.finditer(
            rule["pattern"],
            code,
            re.IGNORECASE
        )

        for match in matches:

            line_number = code[:match.start()].count("\n") + 1

            findings.append({
                "type": name,
                "severity": rule["severity"],
                "line": line_number,
                "message": f"Possible {name} detected."
            })

    return findings
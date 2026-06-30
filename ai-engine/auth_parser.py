import sys
import json
import re

RELEVANT_KEYWORDS = [
    "Failed password", "Accepted password",
    "sudo:", "CRON", "Invalid user",
    "session opened", "session closed",
    "authentication failure"
]

events = []

with open(sys.argv[1], "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()

        if not line:
            continue

        if not any(kw in line for kw in RELEVANT_KEYWORDS):
            continue

        event = {
            "timestamp": "",
            "message": line,
            "eventType": "Unknown",
            "severity": "Low",
            "ip": "-",
            "user": "-",
            "host": "ubuntu",
            "mitre": "-"
        }

        # Timestamp
        ts_match = re.search(
            r'^(\w{3}\s+\d+\s+\d{2}:\d{2}:\d{2})',
            line
        )
        if ts_match:
            event["timestamp"] = ts_match.group(1)

        # Host
        host_match = re.search(
            r'^\w{3}\s+\d+\s+\d{2}:\d{2}:\d{2}\s+(\S+)',
            line
        )
        if host_match:
            event["host"] = host_match.group(1)

        # Event Type + Severity + MITRE
        if "Failed password" in line or "authentication failure" in line:
            event["eventType"] = "Failed Login"
            event["severity"] = "High"
            event["mitre"] = "T1110"

        elif "Invalid user" in line:
            event["eventType"] = "Invalid User"
            event["severity"] = "Medium"
            event["mitre"] = "T1110"

        elif "Accepted password" in line:
            event["eventType"] = "SSH Login"
            event["severity"] = "Low"

        elif "sudo:" in line:
            event["eventType"] = "Privilege Escalation"
            event["severity"] = "High"
            event["mitre"] = "T1068"

        elif "CRON" in line:
            event["eventType"] = "Persistence"
            event["severity"] = "Medium"
            event["mitre"] = "T1053"

        elif "session opened" in line:
            event["eventType"] = "Session Opened"
            event["severity"] = "Low"

        elif "session closed" in line:
            event["eventType"] = "Session Closed"
            event["severity"] = "Low"

        # IP
        ip_match = re.search(r'(\d{1,3}(?:\.\d{1,3}){3})', line)
        if ip_match:
            event["ip"] = ip_match.group(1)

        # User
        user_match = re.search(r'(?:for|user)\s+(\w+)', line)
        if user_match:
            event["user"] = user_match.group(1)

        events.append(event)

print(json.dumps(events))
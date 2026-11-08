#!/usr/bin/env python3
"""
Bengkel Motor REST API - Automated Security & OWASP Compliance Verifier
Author: Zakky Fawwaz Mubarok (@zakyfawwaz / 23215031)
Kelompok 2 - Pemrograman Web Service
"""

import sys
import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8000/api/v1"

def test_endpoint(name, method, url, headers=None, data=None, expected_status=200):
    headers = headers or {}
    if "Accept" not in headers:
        headers["Accept"] = "application/json"
    if data and "Content-Type" not in headers:
        headers["Content-Type"] = "application/json"
    
    encoded_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req, timeout=5) as res:
            status = res.status
            body = res.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        status = e.code
        body = e.read().decode("utf-8")
    except Exception as e:
        print(f"[-] {name}: Connection failed ({e})")
        return False

    passed = (status == expected_status)
    mark = "[PASS]" if passed else "[FAIL]"
    print(f"{mark} {name} -> Status: {status} (Expected: {expected_status})")
    return passed

def main():
    print("==========================================================")
    print("  BENGKEL MOTOR REST API — OWASP SECURITY COMPLIANCE AUDIT")
    print("==========================================================")
    
    tests = [
        # API2: Broken Authentication
        ("API2: Unauthenticated Access Guard (/api/v1/vehicles)", "GET", f"{BASE_URL}/vehicles", {}, None, 401),
        ("API2: Unauthenticated Profile Guard (/api/v1/auth/me)", "GET", f"{BASE_URL}/auth/me", {}, None, 401),
        ("API2: Invalid Login Credentials Guard", "POST", f"{BASE_URL}/auth/login", {}, {"email": "cust@bengkel.id", "password": "wrongpassword123"}, 401),

        # API5: Broken Function Level Authorization (RBAC)
        ("API5: Admin Endpoint Unauthenticated Guard (/api/v1/admin/stats)", "GET", f"{BASE_URL}/admin/stats", {}, None, 401),

        # API8: Security Misconfiguration / 404 Standard Error
        ("API8: Non-existent Route Clean Error Handler", "GET", f"{BASE_URL}/route-that-does-not-exist", {}, None, 404),

        # API1: Public Health Check Operability
        ("API1: Public Health Check Status", "GET", f"{BASE_URL}/health", {}, None, 200),
    ]

    total = len(tests)
    passed = 0

    for name, method, url, headers, data, expected_status in tests:
        if test_endpoint(name, method, url, headers, data, expected_status):
            passed += 1

    print("\n----------------------------------------------------------")
    print(f"Summary: {passed}/{total} Security Assertions Passed ({(passed/total)*100:.1f}%)")
    print("----------------------------------------------------------")

    if passed == total:
        print("[SUCCESS] OWASP API Security baseline checks verified.\n")
        return 0
    else:
        print("[WARNING] Some security assertions did not match expectations.\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())

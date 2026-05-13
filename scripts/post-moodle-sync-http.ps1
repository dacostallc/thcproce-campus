$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..
Remove-Item jar-sync.txt -ErrorAction SilentlyContinue
$csrfJson = curl.exe -s -c jar-sync.txt http://localhost:3030/api/auth/csrf
$csrf = ($csrfJson | ConvertFrom-Json).csrfToken
curl.exe -s -b jar-sync.txt -c jar-sync.txt -X POST http://localhost:3030/api/auth/callback/credentials -H "Content-Type: application/x-www-form-urlencoded" --data-urlencode "csrfToken=$csrf" --data-urlencode "email=demo-admin@local.test" --data-urlencode "password=demo" --data-urlencode "callbackUrl=http://localhost:3030/campus" --data-urlencode "json=true" -o NUL
curl.exe -s -b jar-sync.txt -X POST http://localhost:3030/api/admin/moodle/sync-lesson-content -H "Content-Type: application/json; charset=utf-8" --data-binary "@$PSScriptRoot/moodle-sync-body.json"

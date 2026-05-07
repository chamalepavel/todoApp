# Evidencia Clase 9 — Rate Limiting

## Curl 1: 6to intento de login → 429

```bash
for i in {1..6}; do \
  curl -i -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpassword"}'; \
  echo "--- intento $i ---"; \
done
```

```
--- intento 1 ---
HTTP/1.1 401
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 5;w=900
ratelimit-limit: 5
ratelimit-remaining: 4
ratelimit-reset: 900
content-type: application/json; charset=utf-8
content-length: 31
etag: W/"1f-mRYQ6Yx/raK/ssDeWseqQCiH0yM"
date: Thu, 07 May 2026 05:52:10 GMT
connection: keep-alive
keep-alive: timeout=5

{"error":"Invalid credentials"}

--- intento 2 ---
HTTP/1.1 401
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 5;w=900
ratelimit-limit: 5
ratelimit-remaining: 3
ratelimit-reset: 900
content-type: application/json; charset=utf-8
content-length: 31
etag: W/"1f-mRYQ6Yx/raK/ssDeWseqQCiH0yM"
date: Thu, 07 May 2026 05:52:10 GMT
connection: keep-alive
keep-alive: timeout=5

{"error":"Invalid credentials"}

--- intento 3 ---
HTTP/1.1 401
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 5;w=900
ratelimit-limit: 5
ratelimit-remaining: 2
ratelimit-reset: 900
content-type: application/json; charset=utf-8
content-length: 31
etag: W/"1f-mRYQ6Yx/raK/ssDeWseqQCiH0yM"
date: Thu, 07 May 2026 05:52:10 GMT
connection: keep-alive
keep-alive: timeout=5

{"error":"Invalid credentials"}

--- intento 4 ---
HTTP/1.1 401
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 5;w=900
ratelimit-limit: 5
ratelimit-remaining: 1
ratelimit-reset: 900
content-type: application/json; charset=utf-8
content-length: 31
etag: W/"1f-mRYQ6Yx/raK/ssDeWseqQCiH0yM"
date: Thu, 07 May 2026 05:52:10 GMT
connection: keep-alive
keep-alive: timeout=5

{"error":"Invalid credentials"}

--- intento 5 ---
HTTP/1.1 401
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 5;w=900
ratelimit-limit: 5
ratelimit-remaining: 0
ratelimit-reset: 900
content-type: application/json; charset=utf-8
content-length: 31
etag: W/"1f-mRYQ6Yx/raK/ssDeWseqQCiH0yM"
date: Thu, 07 May 2026 05:52:10 GMT
connection: keep-alive
keep-alive: timeout=5

{"error":"Invalid credentials"}

--- intento 6 ---
HTTP/1.1 429
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 5;w=900
ratelimit-limit: 5
ratelimit-remaining: 0
ratelimit-reset: 900
retry-after: 900
content-type: application/json; charset=utf-8
content-length: 64
etag: W/"40-/b/mER7Bqz3gQz+6NndqcmDxLgE"
date: Thu, 07 May 2026 05:52:10 GMT
connection: keep-alive
keep-alive: timeout=5

{"error":"Demasiados intentos. Intenta de nuevo en 15 minutos."}

```

---

## Curl 2: Register 4ta vez desde misma IP → 429

```bash
for i in {1..4}; do \
  curl -i -s -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"reg@example.com","password":"Password123!"}'"; \
  echo "--- intento $i ---"; \
done
```

```
--- intento 1 ---
HTTP/1.1 201
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 3;w=3600
ratelimit-limit: 3
ratelimit-remaining: 2
ratelimit-reset: 3600
content-type: application/json; charset=utf-8
content-length: 625
etag: W/"271-ttiDZyhAavYVdf16Zc0Ox4L3ebI"
date: Thu, 07 May 2026 05:52:11 GMT
connection: keep-alive
keep-alive: timeout=5

{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmMyODhiYzQ3NGFhNmY0YWFmM2ZlMyIsImVtYWlsIjoicmVnQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzgxMzMxMzEsImV4cCI6MTc3ODEzNDAzMX0.MYvTAisAlq5MJ3Fx7QBOgHQgLfBbl_Fa-0eMHEo-3MQ","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmMyODhiYzQ3NGFhNmY0YWFmM2ZlMyIsImVtYWlsIjoicmVnQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJqdGkiOiJlNmU4MjczNC1iYTZlLTQ3YTktYjg5OC02Zjk5ZWJlZmUxZTYiLCJpYXQiOjE3NzgxMzMxMzEsImV4cCI6MTc3ODczNzkzMX0.QNxm8GL2uJP6W_MIUJwDtPImQjMr8Kjgjn68Swy7hkc","user":{"id":"69fc288bc474aa6f4aaf3fe3","email":"reg@example.com","role":"user"}}

--- intento 2 ---
HTTP/1.1 409
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 3;w=3600
ratelimit-limit: 3
ratelimit-remaining: 1
ratelimit-reset: 3600
content-type: application/json; charset=utf-8
content-length: 36
etag: W/"24-5B56xuvmw3IrU+e3WAtyoxowjFk"
date: Thu, 07 May 2026 05:52:11 GMT
connection: keep-alive
keep-alive: timeout=5

{"error":"Email already registered"}

--- intento 3 ---
HTTP/1.1 409
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 3;w=3600
ratelimit-limit: 3
ratelimit-remaining: 0
ratelimit-reset: 3600
content-type: application/json; charset=utf-8
content-length: 36
etag: W/"24-5B56xuvmw3IrU+e3WAtyoxowjFk"
date: Thu, 07 May 2026 05:52:11 GMT
connection: keep-alive
keep-alive: timeout=5

{"error":"Email already registered"}

--- intento 4 ---
HTTP/1.1 429
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 3;w=3600
ratelimit-limit: 3
ratelimit-remaining: 0
ratelimit-reset: 3600
retry-after: 3600
content-type: application/json; charset=utf-8
content-length: 72
etag: W/"48-jzA1c2oiqdYCmaYELGBikD81q1E"
date: Thu, 07 May 2026 05:52:11 GMT
connection: keep-alive
keep-alive: timeout=5

{"error":"Demasiados intentos de registro. Intenta de nuevo en 1 hora."}

```

---

## Curl 3: Login dentro del límite → 200

```bash
curl -i -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"Password123!"}'
```

```
HTTP/1.1 200
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-xss-protection: 0
vary: Origin
ratelimit-policy: 5;w=900
ratelimit-limit: 5
ratelimit-remaining: 4
ratelimit-reset: 900
content-type: application/json; charset=utf-8
content-length: 639
etag: W/"27f-GgyYBRUe26ZZWTySNljtTZnKZcE"
date: Thu, 07 May 2026 05:52:11 GMT
connection: keep-alive
keep-alive: timeout=5

{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmMyODhiYzQ3NGFhNmY0YWFmM2ZlOCIsImVtYWlsIjoidXN1YXJpb0BleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc4MTMzMTMxLCJleHAiOjE3NzgxMzQwMzF9.323Ob2rKcCkLORnjZWJWkuzslzB1zRK96laAJtOmRmI","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmMyODhiYzQ3NGFhNmY0YWFmM2ZlOCIsImVtYWlsIjoidXN1YXJpb0BleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwianRpIjoiNDZlMGQ4NWEtNDRjOS00YzhlLTg5ZTEtNTU5YzZlOWNkNzE0IiwiaWF0IjoxNzc4MTMzMTMxLCJleHAiOjE3Nzg3Mzc5MzF9.-X-cShbYG1oVbOd90eXjTDbvPV-IPXoKKc8Dg2k3HrE","user":{"id":"69fc288bc474aa6f4aaf3fe8","email":"usuario@example.com","role":"user"}}
```
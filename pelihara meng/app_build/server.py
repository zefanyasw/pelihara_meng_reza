#!/usr/bin/env python3
"""
MIMI & MOCHI — A LITTLE COZY CAT LIFE
Local Development & Production Game Server
"""

import http.server
import socketserver
import os
import sys
import mimetypes

# Ensure correct MIME types on Windows
mimetypes.init()
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/javascript', '.mjs')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('image/svg+xml', '.svg')

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable caching and CORS for smooth local play
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Concise logging
        if "404" in format % args:
            sys.stderr.write(f"[Server 404] {format % args}\n")

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

def run():
    os.chdir(DIRECTORY)
    server_address = ('127.0.0.1', PORT)
    
    # Try finding an open port starting from PORT
    port = PORT
    httpd = None
    while port < PORT + 10:
        try:
            httpd = ReusableTCPServer(('127.0.0.1', port), QuietHandler)
            break
        except OSError:
            port += 1
            
    if not httpd:
        print(f"Error: Could not bind to any port from {PORT} to {PORT+9}")
        sys.exit(1)

    url = f"http://localhost:{port}"
    print(f"==================================================")
    print(f"  MIMI & MOCHI — A LITTLE COZY CAT LIFE")
    print(f"  Serving cozy cat sanctuary at: {url}")
    print(f"==================================================")
    sys.stdout.flush()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nCat sanctuary server closed gently.")
        httpd.server_close()

if __name__ == '__main__':
    run()

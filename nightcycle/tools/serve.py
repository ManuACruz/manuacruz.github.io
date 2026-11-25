"""Static server for Night Cycle that tells the browser not to cache, so edits show up on reload.

Usage: python tools/serve.py [port]   (serves the NightCycle folder, default port 8083)

Debug: POST /shot/<name>.png from this machine saves a screenshot to shots/<name>.png (see NC.shot in main.js).
"""
import http.server
import os
import re
import sys
from functools import partial

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, 'shots')


class NoCache(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript', '.mjs': 'text/javascript'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_POST(self):
        m = re.fullmatch(r'/shot/([a-z0-9][a-z0-9-]{0,60}\.(?:png|jpg))', self.path)
        size = int(self.headers.get('Content-Length') or 0)
        if not m or self.client_address[0] not in ('127.0.0.1', '::1') or not 0 < size < 20_000_000:
            self.send_error(403)
            return
        os.makedirs(SHOTS, exist_ok=True)
        with open(os.path.join(SHOTS, m.group(1)), 'wb') as f:
            f.write(self.rfile.read(size))
        self.send_response(204)
        self.end_headers()

    def log_message(self, fmt, *args):
        pass


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8083
    handler = partial(NoCache, directory=ROOT)
    with http.server.ThreadingHTTPServer(('0.0.0.0', port), handler) as httpd:
        print(f'Night Cycle on http://localhost:{port}')
        httpd.serve_forever()

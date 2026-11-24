"""Static server for Night Cycle that tells the browser not to cache, so edits show up on reload.

Usage: python tools/serve.py [port]   (serves the NightCycle folder, default port 8083)
"""
import http.server
import os
import sys
from functools import partial

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoCache(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.js': 'text/javascript', '.mjs': 'text/javascript'}

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8083
    handler = partial(NoCache, directory=ROOT)
    with http.server.ThreadingHTTPServer(('0.0.0.0', port), handler) as httpd:
        print(f'Night Cycle on http://localhost:{port}')
        httpd.serve_forever()

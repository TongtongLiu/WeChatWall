__author__ = 'Epsirom'

import os
os.environ.setdefault('WALL_DEPLOYMENT', 'wechat_wall')

from app import app

application = app
